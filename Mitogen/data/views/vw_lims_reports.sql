DROP VIEW IF EXISTS `vw_lims_reports`;

CREATE VIEW `vw_lims_reports` 
AS
SELECT 
    rd.`id`,
    rd.`reportId`,
    rf.`requestId`,
    rd2.reportName,
    rdv.versionNumber,
    rdv.id AS reportDefinitionVersionId,
    rd.`reportType`,
    rd.`status`,
    rd.`statusEventId`,
    e2.eventDate as statusDate,
    e.eventDate as eventDate,
    CASE WHEN ISNULL(q.reqId) = 1 THEN 0 ELSE 1 END AS `hasAddendum`
FROM  
    `reportDetails` AS rd
    INNER JOIN `requestForms` rf
    ON rd.`requestFormsId` = rf.`id`
    INNER JOIN `reportDefinitionVersion` rdv
    ON rd.reportDefinitionVersionId = rdv.id
    INNER JOIN reportDefinition rd2
    ON rdv.reportDefinitionId = rd2.id
    INNER JOIN events e
    ON rd.eventId = e.eventID
    INNER JOIN events e2
    ON rd.statusEventId = e2.eventID
    LEFT OUTER JOIN (SELECT DISTINCT reqID, reportID FROM reportHTMLAddendums) q
    ON rd.reportId = q.reportId AND rf.requestId = q.reqID;
    
    





