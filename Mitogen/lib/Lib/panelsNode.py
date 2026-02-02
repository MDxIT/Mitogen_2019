from buildInformationObject import *
class Panels(infoObject):
  import java.sql.ResultSetMetaData

  def __init__ (self, switchboard, containerId, containerType, panelIndex):
    self.switchboard = switchboard
    self.containerId = containerId
    self.containerType = containerType
    self.panelIndex = panelIndex

    self.udQuery = """ SELECT '' FROM dual WHERE 1 = 0 """

    self.panelQuery = """ SELECT '' FROM dual WHERE 1 = 0 """

    if self.containerType == 'runId':

      self.panelQuery = """ SELECT
                              p.panelCode, p.name AS "panel",
                              CASE ISNULL(t.testCode)
                                WHEN 1 THEN 'True'
                                ELSE 'False'
                              END AS "allTests",
                              IFNULL(t.testCode,'') AS "testCode",
                              IFNULL(t.name,'') AS "test",
                              IFNULL(m.methodCode, '') AS "methodCode",
                              IFNULL(m.name, '') AS "method"
                            FROM specimenRuns sr
                            INNER JOIN specimenMethods sm
                              ON sr.specimenMethodsId = sm.id
                            INNER JOIN panels p
                              ON sm.panelCode = p.panelCode
                            LEFT JOIN tests t
                              ON sm.testCode = t.testCode
                            LEFT JOIN methods m
                              ON sm.methodCode = m.methodCode
                            WHERE  sr.runId = '%s' """ % self.containerId

    elif self.containerType == 'specimenId':

      self.panelQuery = """ SELECT
                              p.panelCode, p.name AS "panel",
                              CASE ISNULL(t.testCode)
                                WHEN 1 THEN 'True'
                                ELSE 'False'
                              END AS "allTests",
                              t.testCode, t.name AS "test",
                              m.methodCode, m.name AS "method"
                            FROM requestSpecimens rs
                            INNER JOIN specimenMethods sm
                              ON rs.id = sm.requestSpecimensId
                            INNER JOIN panels p
                              ON sm.panelCode = p.panelCode
                            LEFT JOIN tests t
                              ON sm.testCode = t.testCode
                            LEFT JOIN methods m
                              ON sm.methodCode = m.methodCode
                            WHERE  rs.specimenId = '%s' """ % self.containerId

    elif self.containerType == 'requestId':

      self.panelQuery = """ SELECT
                              p.panelCode, p.name AS "panel",
                              CASE ISNULL(t.testCode)
                                WHEN 1 THEN 'True'
                                ELSE 'False'
                              END AS "allTests",
                              t.testCode, t.name AS "test",
                              m.methodCode, m.name AS "method"
                            FROM requestSpecimens rs
                            INNER JOIN specimenMethods sm
                              ON rs.id = sm.requestSpecimensId
                            INNER JOIN panels p
                              ON sm.panelCode = p.panelCode
                            LEFT JOIN tests t
                              ON sm.testCode = t.testCode
                            LEFT JOIN methods m
                              ON sm.methodCode = m.methodCode
                            WHERE  rf.requestId = '%s' """ % self.containerId


  def getPanel(self):

    panelObject = self.getData(self.panelQuery, self.udQuery)
    return panelObject

  def buildPanelNode(self, runsIdx, specimensIdx, requestsIdx, reportsIdx):

    dataObject = self.getData(self.panelQuery, self.udQuery)
    objectNode = self.buildNode('panel', dataObject, self.panelIndex, self.panelQuery, self.udQuery)
    for index in runsIdx:
      objectNode.add('labProcess_link', str(index))
    for index in specimensIdx:
      objectNode.add('specimen_link', str(index))
    for index in requestsIdx:
      objectNode.add('order_link', str(index))
    for index in reportsIdx:
      objectNode.add('report_link', str(index))
    return objectNode

  def getPanels(self):

    try:

      i = 1

      stmt = self.switchboard.connection.createStatement()
      rs = stmt.executeQuery(self.panelQuery)
      while rs.next():

        panelTree = self.uniflow.Node("panel", str(i))

        panelTree.add("panelCode", rs.getString('panelCode'))
        panelTree.add("panelName", rs.getString('panel'))
        panelTree.add("allTests", rs.getString('allTests'))
        panelTree.add("testCode", rs.getString('testCode'))
        panelTree.add("testName", rs.getString('test'))
        panelTree.add("methodCode", rs.getString('methodCode'))
        panelTree.add("methodName", rs.getString('method'))

        i +=1

      rs.close()

      for index in self.runIndex:
        panelTree.add("labProcess_link", str(index))
      for index in self.specimenIndex:
        panelTree.add("specimen_link", str(index))
      for index in self.orderIndex:
        panelTree.add("order_link", str(index))
      for index in self.reportIndex:
        panelTree.add("report_link", str(index))

      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'true')

    except Exception as e:
      self.switchboard.log("---FAILURE TO INSERT/UPDATE DATA----")
      self.switchboard.log(str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      panelTree = self.uniflow.Node("ERROR", '---FAILURE TO INSERT/UPDATE DATA----')

    except StandardError as e:
      self.switchboard.log("---*** Standard Py Error *** ")
      self.switchboard.log(str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      panelTree = self.uniflow.Node("ERROR", '---*** Standard Py Error *** ')

    # except SystemException as e:
    #   switchboard.log("---*** UNIFlow SystemException ***----")
    #   switchboard.log(str(e.message))
    #   switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    # except java.sql.SQLException as e:
    #   switchboard.log("---*** SQLException ***----")
    #   switchboard.log(str(e.message))
    #   switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')

    except BaseException as e:
      self.switchboard.log("---*** PyException ***----")
      self.switchboard.log(str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      panelTree = self.uniflow.Node("panels", '---*** PyException ***----')

    except TypeError as e:
      self.switchboard.log("---*** TypeError ***----")
      self.switchboard.log(str(e.message))
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      panelTree = self.uniflow.Node("ERROR", '---*** TypeError ***----')

    except:
      self.switchboard.log("*** Unspecified Error *****")
      self.switchboard.formResults.put('PROCESSINGSUCCESSFUL', 'false')
      panelTree = self.uniflow.Node("ERROR", '*** Unspecified Error *****')

    return panelTree