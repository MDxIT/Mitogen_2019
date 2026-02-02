DROP VIEW IF EXISTS `vw_lims_orders`;

CREATE VIEW `vw_lims_orders` 
AS
SELECT 
    rq.`id`,
    rq.`requestId`,
    rq.`placerOrderId`,
    rq.`sendingApp`,
    rq.`sendingFacility`,
    rq.`patientId`,
    pa.sqId,
    rq.`physicianId`,
     p.`first_name` as physicianFirstName, 
     p.`last_name`  as physicianLastName,
     p.`title` as physicianTitle,
     p.`providerId` as physicianProviderId,
     p.`providerType`  as physicianProviderType,
    rq.`physicianSiteId`,
   os3.`name` as physicianSiteName,
   os3.`siteCode` as physicianSiteCode,    
    rq.`type` as requestType,
    rq.`mrn`,
    rq.`mrnType`,
    rq.`mrnFacility`,
     o.`orgId`,
     o.`name` as organization, 
    rq.`locationId` as siteId,
   os1.`name` as locationName,
   os1.`siteCode` as locationCode,
    rq.`departmentId`,
   os2.`name` as departmentName,
   os2.`siteCode` as departmentCode,    
    rq.`consent`,
    rq.`consentBy`,
    rq.`consenteePatientRelationship`,
    rq.`clinicalTrial`,
    rq.`workersComp`,
    rq.`patientSignature`,
    rq.`patientSignatureDate`,
    rq.`physicianSignature`,
    rq.`physicianSignatureDate`,
    rq.`physicianComment`,
    rq.`priority`,
    rq.`eventId`,
    e1.eventDate,
    rq.`receivedDate`,
    rq.`externalRequestId`,
    rq.`externalSystem`,
    rq.`accountNumber`,
    rq.`encounterNumber`,
    rq.`status`,
    rq.`statusEventId`,
    e2.eventDate as statusDate
FROM 
    `requestForms` rq
    INNER JOIN `physicians` p
    ON rq.`physicianId` = p.`physicianId`
    INNER JOIN `patients` pa
    ON rq.`patientId` = pa.`patientId`
    LEFT OUTER JOIN `organizationSites` os1
    ON rq.`locationId` = os1.siteId
    LEFT OUTER JOIN `organizationSites` os2
    ON rq.`departmentId` = os2.siteId
    LEFT OUTER JOIN `organizations` o
    ON os1.`orgId` = o.orgId
    LEFT OUTER JOIN `organizationSites` os3
    ON rq.`physicianSiteId` = os3.siteId
    INNER JOIN `events` e1
    ON rq.`eventId` = e1.`eventId`
    INNER JOIN `events` e2
    ON rq.`statusEventId` = e2.`eventId`;

