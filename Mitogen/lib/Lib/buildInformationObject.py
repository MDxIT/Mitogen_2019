errorLocation = ''
class infoObject(object):

  import java.sql.ResultSetMetaData
  import com.uniconnect.uniflow.Node as Node
  from java.sql import SQLException

  def __init__ (self, switchboard, mainQuery, userDataQuery):

    self.switchboard = switchboard
    self.mainQuery = mainQuery
    self.userDataQuery = userDataQuery

  def getData(self, mainQuery, userDataQuery):

    errorLocation = '<<<<<< BEGIN: BUILDINFOOBJECT GETDATA >>>>>>'
    try:

      stmt = self.switchboard.connection.createStatement()
      rs = stmt.executeQuery(mainQuery)

      rsMetaData = rs.getMetaData()
      rsColumnCount = rsMetaData.getColumnCount()
      dataObject = {}


      while rs.next():

        for i in range(1, rsColumnCount+1):
          
          columnName = rsMetaData.getColumnLabel(i)
          dataObject[columnName] = {'value' : rs.getString(columnName), 'label' : ''}

      rs.close()

      dataObject['additionalFields'] = self.getAdditionalFields(userDataQuery)

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

    except Exception as e:
      self.switchboard.log("---*** EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except StandardError as e:
      self.switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except SystemException as e:
      self.switchboard.log("---*** UNIFlow SystemException ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except SQLException as e:
      self.switchboard.log("---*** SQLException ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except BaseException as e:
      self.switchboard.log("---*** PYTHON EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except TypeError as e:
      self.switchboard.log("---*** TYPE ERROR ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except:
      self.switchboard.log("---*** UNSPECIFIED ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    return dataObject

  def getAdditionalFields(self, userDataQuery):

    self.switchboard.log('<<<<<< GETTING ADDITIONAL FIELDS >>>>>>')
    errorLocation = '<<<<<< BEGIN: BUILDINFOOBJECT GETADDITIONALFIELDS >>>>>>'
    try:

      addFieldsObject = {}

      stmt = self.switchboard.connection.createStatement()
      rs = stmt.executeQuery(userDataQuery)
      while rs.next():

        addFieldsObject[rs.getString('property')] = {'value' : rs.getString('value'), 'label' : rs.getString('addFieldLabel') }

      rs.close()

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')
    except Exception as e:
      self.switchboard.log("---*** EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except StandardError as e:
      self.switchboard.log("---*** STANDRAD PYTHON ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except SystemException as e:
      self.switchboard.log("---*** UNIFlow SystemException ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except SQLException as e:
      self.switchboard.log("---*** SQLException ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except BaseException as e:
      self.switchboard.log("---*** PYTHON EXCEPTION ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except TypeError as e:
      self.switchboard.log("---*** TYPE ERROR ***----")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.log("ERROR MESSAGE: " + str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
    except:
      self.switchboard.log("---*** UNSPECIFIED ERROR ***---")
      self.switchboard.log("ERROR LOCATION: " + errorLocation)
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    return addFieldsObject


  def buildNode(self, nodeName, dataObject, nodeIndex, mainQuery, userDataQuery):



    dataTree = self.Node(nodeName, str(nodeIndex))

    for item in dataObject:

      if item == 'additionalFields':
        addFields = dataTree.add("additionalFields", "")

        for addField in dataObject[item]:
          addFieldValue = ''
          addFieldLabel = ''

          for value in dataObject[item][addField]:
            if value == "value":
              addFieldValue = dataObject[item][addField][value]

            else:
              addFieldLabel = dataObject[item][addField][value]

          addFields.add("addFieldLabel", addFieldLabel)
          addFields.getByTagAndValue("addFieldLabel", addFieldLabel).add('value', addFieldValue)

      elif (item == 'currentMedications' \
        or item == 'problematicMedications' \
        or item == 'drugAllergies'):

        drugList = dataTree.add(item, "")
        for drug in dataObject[item].split(','):
          drugList.add('drugName', drug)

      elif item == 'mrn':
        mrns = dataTree.add("mrns", "")

        for mrn in dataObject[item]:
          mrns.add("mrn", mrn)
          mrns.getByTagAndValue("mrn", mrn).add('type', dataObject[item][mrn]['type'])
          mrns.getByTagAndValue("mrn", mrn).add('facility', dataObject[item][mrn]['facility'])

      elif item == 'codes':
        codes = dataTree.add("diagnosticCodes", "")

        for code in dataObject[item]:
          codes.add("code", code)

      elif item == 'testCode':
        tests = dataTree.add("tests", "")

        for testCode in dataObject[item]:
          tests.add("testCode", testCode)
          tests.getByTagAndValue("testCode", testCode).add('cptCode', dataObject[item][testCode]['cptCode'])
          tests.getByTagAndValue("testCode", testCode).add('billingCode', dataObject[item][testCode]['billingCode'])
          tests.getByTagAndValue("testCode", testCode).add('zCode', dataObject[item][testCode]['zCode'])

      elif item == 'panels':

        panels = dataTree.add(item, "")
        for panel in dataObject[item]['value'].split('|'):
          panelCode = panel.split('^')[0]
          panelName = panel.split('^')[1]
          panels.add('panelCode', panelCode)
          panels.getByTagAndValue("panelCode", panelCode).add('name', panelName)

      elif item == 'siteInformation':
        siteInfoNode = dataTree.add("siteInformation", "")
        siteInfoDict = dataObject[item]
        for info in siteInfoDict:
          if info not in ['additionalFields']:
            siteInfoNode.add(info, siteInfoDict[info]['value'])

      elif mainQuery == 'Reporting':
        thisNode = dataTree.add(item, "")
        for value in dataObject[item]:
          if value == 'value':
            thisNode.add('value', dataObject[item][value])
            # dataTree.add(item, dataObject[item][value])
          if value == 'label':
            thisNode.add('label', dataObject[item][value])


      else:
        # thisNode = dataTree.add(item, "")
        for value in dataObject[item]:
          if value == 'value':
            # thisNode.add('value', dataObject[item][value])
            dataTree.add(item, dataObject[item][value])
          # if value == 'label':
          #   thisNode.add('label', dataObject[item][value])


    return dataTree

