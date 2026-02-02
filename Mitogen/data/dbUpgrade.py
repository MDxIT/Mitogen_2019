import os
import sys
import re
import json
import subprocess

from optparse import OptionParser

class DbUpdateManager:
    def __init__(self, config_file):
        self.config = None
        self.config_file = config_file
        with open(self.config_file, "r") as f:
            self.config = json.load(f)

        self.filename = None
        self.mode = None
        self.path = None

    def check_git(self):
        """
            Compares current and another branch for differences in the file
        """
        print("Checking branch for difference")
        cmd = ("git diff --ignore-all-space --exit-code %s %s" % (self.config["branch"], self.config[self.mode]["file"])).split(" ")
        print(cmd)
        exit_code = subprocess.call(cmd)
        return exit_code == 0


    def get_sql_file_content(self, sql_file, current_version, next_version):
        """
            Opens and reads in SQL file content and replaces all tokens with assigned values.
        """
        sql_content = ""
        with open(sql_file, "r+") as f:
            sql_content = f.read().decode("utf-8")
            sql_content = re.sub("\$\$KEY\$\$", self.db_config_key, sql_content)
            sql_content = re.sub("\$\$CURRENT_VERSION\$\$", current_version, sql_content)
            sql_content = re.sub("\$\$NEXT_VERSION\$\$", next_version, sql_content)

        return sql_content

    def remove_crlf(self, line):
        return line.replace("\n", "").replace("\r", "")

    def add_to_main_file(self, sql_content):
        """
            Adds SQL update to the main file
        """
        spacing = 0
        INDENT = 4
        update_idx = None
        content = []
        with open(self.filename, "r") as f:
            for num, line in enumerate(f):
                tmp = line.decode("utf-8").strip()
                if tmp == self.config["updateToken"]:
                    spacing = len(line) - len(line.lstrip(" "))
                    update_idx = num
                content.append(self.remove_crlf(line))
            sql_content = sql_content.replace("\n", "\n" + (spacing * " "))
            sql_content = [self.remove_crlf(f) for f in sql_content.split("\n")]

            if update_idx != None:
                print("Found update token. Line number: %s" % (str(update_idx)))
            else:
                raise Exception("Failed to find update token. See configuration or %s " % (self.filename))

            content = content[:update_idx] + sql_content + content[update_idx:]

        with open(self.filename, "w") as f:
            #f.write("\n".join(content))
            for line in content:
                f.write(line + "\n")


        print("Done")

    def update_config(self, next_version, next_version_update):
        """
            Updates configuration file
        """
        self.config[self.mode]["currentVersion"]["update"] = next_version_update
        self.config[self.mode]["currentVersion"]["prefix"] = next_version
        with open(self.config_file, "w") as f:
            json.dump(self.config, f, indent=2)

    

    def run(self, mode, filename, skip):
        self.is_new = False
        self.mode = mode
        sql_file = filename


        self.filename = self.config[self.mode]["file"]
        self.db_config_key = self.config[self.mode]["key"]

        if not os.path.exists(sql_file):
            raise Exception("Cannot find file:  " + sql_file)

        if not os.path.exists(self.filename):
            raise Exception ("Cannot find file: " + self.filename)

        if skip == False and not self.check_git():
            raise Exception("Please pull in the latest updates to avoid merge conflicts")


        current_version = int(self.config[self.mode]["currentVersion"]["update"])
        next_version = current_version + 1

        current_version_prefix = self.config[self.mode]["currentVersion"]["prefix"]
        next_version_prefix = self.config[self.mode]["nextVersion"]["prefix"]


        # Reset next version to 1 if current and next version prefix are different
        if current_version_prefix != next_version_prefix:
            next_version = 1

        current_version_str = current_version_prefix + str(current_version).zfill(3)
        next_version_str = next_version_prefix + str(next_version).zfill(3)
        print(current_version_str + " --> " + next_version_str)

        sql_content = self.get_sql_file_content(sql_file, current_version_str, next_version_str)
        #print(sql_content)
        #print("\n\n")
        self.add_to_main_file(sql_content)

        print("Updating config file")
        self.update_config(next_version_prefix, next_version)

        


def main(argv):
    parser = OptionParser()
    parser.add_option("-m", "--mode", dest="mode", help="Supported modes: schema or data")
    parser.add_option("-f", "--file", dest="filename", help="Specify path to file with SQL updates")
    parser.add_option("-s", "--skip", dest="skip", action="store_true", default=False, help="Skip validation (i.e. git diff)")
    
    (options, args) = parser.parse_args()

    if not options.mode in ["schema", "data"]:
        print("Update mode not supported: " + options.mode)
        sys.exit(1)

    if not options.filename and not os.path.exists(options.filename):
        print("Cannot find file: " + options.filename)
        sys.exit(1)

    DbUpdateManager("./config.json").run(options.mode, options.filename, options.skip)

if __name__ == "__main__":
    main(sys.argv[1:])
