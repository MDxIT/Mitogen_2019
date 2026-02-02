from buildInformationObject import *
class PhysicianSite(infoObject):
  def __init__ (self, switchboard, siteId, siteIndex):
    self.switchboard = switchboard
    self.siteId = siteId
    self.siteIndex = siteIndex

    self.query =  """ SELECT
                    siteId AS "mitogenSiteId",
                    IFNULL(os.name, '') AS "siteName",
                    IFNULL(os.orgId, '') AS "mitogenOrganizationId",
                    IFNULL(o.name, '') AS "organization",
                    IFNULL(os.siteCode, '') AS "siteCode",
                    IFNULL(os.address1, '') AS "address1",
                    IFNULL(os.address2, '') AS "address2",
                    IFNULL(os.city, '') AS "city",
                    IFNULL(os.state, '') AS "state",
                    IFNULL(os.postalCode, '') AS "postalCode",
                    IFNULL(os.country, '') AS "country",
                    IFNULL(os.email, '') AS "email",
                    IFNULL(os.website, '') AS "website",
                    IFNULL(os.phone1, '') AS "phone1",
                    IFNULL(os.phone2, '') AS "phone2",
                    IFNULL(os.fax1, '') AS "fax1",
                    IFNULL(os.fax2 ,'') AS "fax2"
                  FROM organizationSites os
                  INNER JOIN organizations o
                    ON os.orgId = o.orgId
                  WHERE os.siteId = '%s' """ % self.siteId


    self.udQuery = """ SELECT
                  fcp.inputName AS "addFieldLabel",
                  cp.`value` AS "value",
                  REPLACE(cp.property, 'userDef_', '') AS "property"
                FROM containerProperties cp
                INNER JOIN formConfigurableParts fcp
                  ON REPLACE(cp.property, 'userDef_', '') = fcp.inputName
                WHERE containerId = '%s'
                  AND fcp.section = 'orderInformation'
                  AND cp.value <> '' """ % self.siteId

  def getPhysicianSite(self):

    physicianSiteObject = self.getData(self.query, self.udQuery)
    return physicianSiteObject

  def buildPhysicianSiteNode(self, physiciansIdx):

    # self.physicianId = physicianId

    dataObject = self.getData(self.query, self.udQuery)
    objectNode = self.buildNode('site', dataObject, self.siteIndex, self.query, self.udQuery)
    for index in physiciansIdx:
      objectNode.add('physician_link', str(index))

    return objectNode
