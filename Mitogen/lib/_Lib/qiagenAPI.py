import sys
import os
import requests
import time
import re
import shlex
import json
import subprocess
from requests.exceptions import HTTPError
from requests.exceptions import ConnectionError

# TODO: Add more exception handling

class QiagenApiHandler(object):
    """
        Qiagen API handler.
            API support:
                - Obtain access token
                - Upload zip file to Qiagen server for testing
                - Check current status of the test
                - Export results in PDF
    """

    # TODO: Make switchboard optional
    def __init__(self, api_info, switchboard):
        """
            api_info (dict): contains clientId, clientSecret, and url for Qiagen
            switchboard (obj): gives access to uniflow functionality
        """
        self.switchboard = switchboard

        self.api_keys = {}
        switchboard.log(str(api_info))
        self.api_keys["id"] = api_info["clientId"]
        self.api_keys["secret"] = api_info["clientSecret"]
        self.url = api_info["url"]

        self.get_new_access_token()


    def get_qiagen_info(self, key):
        """
            Get configurables from the database based on the 'key'
        """
        ps = self.switchboard.connection.prepareStatement("SELECT value FROM qiagenInfo WHERE name = '%s'" % (key))
        self.switchboard.resultSet = ps.executeQuery()
        while self.switchboard.resultSet.next():
            return self.switchboard.resultSet.getString(1)

        return None


    def log(self, message):
        """
            Log message to uniflow with QiagenAPI tag
        """
        self.switchboard.log("[QiagenAPI] %s" % (message))


    def get_access_token(self):
        """
            Get access token from the database.
        """
        # Get access token from DB.. Good idea or just store it in memory?
        # TODO store in memory, only need to store access key and secret
        access_token = self.get_qiagen_info("accessToken")
        
        # access_token = None
        # Get new access token if there's no access token stored.
        if not access_token:
            access_token = self.get_new_access_token()

        return str(access_token)
    
    def get_new_access_token(self):
        """
            Talk to Qiagen and request for access token.

            Requires clientId, clientSecret, and base url
        """


        # TODO: Change this to make it look cleaner?
        url = self.url + "v1/oauth/access_token?grant_type=%s&client_id=%s&client_secret=%s" % ("client_credentials", self.api_keys["id"], self.api_keys["secret"])
        try:
            req = requests.get(url)
            if req:
                data = req.json()
            else:
                return None
            access_token = data["access_token"]
        except ConnectionError as e:
            self.log("ConnectionError. Unable to connect to Qiagen server. "  + str(e))
            raise ConnectionError("Unable to connect to Qiagen server.")
        except HTTPError as e:
            self.log("Invalid HTTP response. " + str(e))
            raise HTTPError("Invalid HTTP response.")
        except Exception as e:
            self.log("Unknown error: " + str(e))
            raise Exception("Unknown error: " + str(e))

        self.log("Obtained new token.. Updating DB")
        ps = self.switchboard.connection.prepareStatement("INSERT INTO qiagenInfo (name, value) VALUES('accessToken', ?) ON DUPLICATE KEY UPDATE value=?")
        ps.setString(1, access_token)
        ps.setString(2, access_token)
        ps.executeUpdate()

        return str(access_token)


    # NOTE: When uploading a zip using Python's requests (in Uniflow), QCI keeps returning invalid submission.
    # After doing some testing, it looks like this is a Uniflow specific issue as I was able to successfully send the same
    # test with a sample script with same functionality that uploads the same zip file.
    # I found out that using curl and popen can work around this issue
    def submit_test_curl(self, access_token, filename, url):
        cmd = "curl -X POST -H \"Authorization: %s\" -H \"Content-Type: multipart/form-data\" -F \"file=@/%s\" %s" % (access_token, filename, url)
        args = shlex.split(cmd)
        try:
            output = os.popen(cmd).read()
            json_data = json.loads(output)
        except Exception as e:
            self.log(str(e))
        return json_data

   
    def submit_test(self, filename):
        """
            Submit test to Qiagen
            
            Input:
                filename: Zip file (str)
                user_id: Username of the submitter (str)

        """
        if not os.path.exists(filename):
            raise Exception("Zip file not found!")

        access_token = self.get_access_token()
        header = {
                    "Authorization": access_token,
                 }
        url = self.url + "v1/datapackages"


        self.log("Filename: " + str(filename))

        data = self.submit_test_curl(access_token, filename, url)
        self.log(data)
        
        if "error" in data and data["error"] == "invalid access token":
            access_token = self.get_new_access_token()
            header["Authorization"] = access_token
            data = self.submit_test_curl(access_token, filename, url)

        if "errors" in data:
            data["errors"] = self.parse_errors(data["errors"])

        return data

    def extract_id(self, url):
        """
            Extract Qiagen's Data Package ID (DP_ID) from status url
        """
        match = re.search(r"v1\/datapackages\/(.+)$", url)
        if match:
            return match.group(1)
        return None 

    def get_results_pdf(self, dp_id, output_path):
        """
            Get the results in pdf format
        """
        access_token = self.get_access_token()

        header = {
            "Authorization": "Bearer " + access_token,
            "Accept": "application/pdf"
        }

        export_url = self.url + "v1/export/" + dp_id + "?view=pdf"

        req = requests.get(export_url, headers=header)

        # Check for expired token
        if req.status_code == 401:
            access_token = self.get_new_access_token()
            header["Authorization"] = "Bearer " + access_token
            req = requests.get(export_url, headers=header)

        # Write content to a file
        with open(output_path, "wb") as f:
            f.write(req.content)

        return True

    def check_status(self, dp_id):
        """
            Get all tests are still in progress from the database and
            their current status.

        """
        access_token = self.get_access_token()
        in_progress = {}
        
        # Header for checking current status
        header = {
            "Authorization": "Bearer " + access_token,
            "Content-Type": "application/json",
        }

        url = self.url + "v1/datapackages/" + dp_id 
        req = requests.get(url)

        # Found invalid token.. Renew access token and update header["Authorization"]
        if req.status_code == 401:
            access_token = self.get_new_access_token()    
            header["Authorization"] = "Bearer " + access_token 
            req = requests.get(url, headers=header)

        # Validate status code. status code should be either 200 or 201
        if req.status_code in [200, 201]:
            data = req.json() 
            if "errors" in data:
                data["errors"] = self.parse_errors(data["errors"])
            return data
        
        self.log("%s =>Status code not 200 or 201: %s " %  (dp_id, str(req.status_code)))
        return None

    def parse_errors(self, errors_dict):
        """
            Parses errors dict obtained from Qiagen API response and converts errors into a list of strings.
        """
        errors = []
        for error in errors_dict:
            details = error["message"]

            if "details" in error:
                if "message" in error["details"]:
                    details += ": %s" % (error["details"]["message"])
                elif "reason" in error["details"]:
                    details = error["details"]["reason"]
                
            errors.append(details)

        return errors


