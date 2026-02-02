from buildInformationObject import *
class Physician(infoObject):
  def __init__ (self, switchboard, physicianId, physicianIndex):
    self.switchboard = switchboard
    self.physicianId = physicianId
    self.physicianIndex = physicianIndex

    self.query =  """ SELECT
                      physicianId AS "mitogenPhysicianId",
                      IFNULL(first_name, '') AS "firstName",
                      IFNULL(middle_Name, '') AS "middleName",
                      IFNULL(last_name, '') AS "lastName",
                      IFNULL(dob, '') AS "dob",
                      IFNULL(title, '') AS "title",
                      IFNULL(gender, '') AS "gender",
                      IFNULL(providerId, '') AS "providerId",
                      IFNULL(providerType, '') AS "providerType"
                  FROM physicians
                  WHERE physicianId = '%s' """ % self.physicianId

    self.udQuery = """ SELECT '' FROM dual WHERE 1 = 0 """

  def getPhysician(self):

    physicianObject = self.getData(self.query, self.udQuery)
    return physicianObject

  def buildPhysicianNode(self, requestsIdx, sitesIdx, reportsIdx):

    dataObject = self.getData(self.query, self.udQuery)
    objectNode = self.buildNode('physician', dataObject, self.physicianIndex, self.query, self.udQuery)
    for index in requestsIdx:
      objectNode.add('order_link', str(index))
    for index in sitesIdx:
      objectNode.add('site_link', str(index))
    for index in reportsIdx:
      objectNode.add('report_link', str(index))

    return objectNode