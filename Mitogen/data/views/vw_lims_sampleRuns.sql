DROP VIEW IF EXISTS `vw_lims_sampleRuns`;

CREATE VIEW `vw_lims_sampleRuns` 
AS
SELECT 	
    sr.`id` as `specimenRunId`,
	sr.`runId`,
	sr.`currentContainerId` as `sampleId`,
	sr.`eventId`,
	e1.`eventDate`,    
	sr.`lastUpdatedEventId`,
	e2.`eventDate` as `lastUpdatedEventDate`,
    c.`content` as `specimenId`,
    c.`eventId` as `specimenEventId`,
    e3.`eventDate` as `specimenDate`
FROM 
    `specimenRuns` sr
    INNER JOIN `contents` c
    ON sr.`currentContainerId` = c.`containerId`
    INNER JOIN `events` e1
    ON sr.`eventId` = e1.`eventId`
    INNER JOIN `events` e2
    ON sr.`lastUpdatedEventId` = e2.`eventId`
    INNER JOIN `events` e3
	ON c.`eventId` = e3.`eventId`
    INNER JOIN `analysisDataRuns` adr
    ON sr.`id` = adr.`specimenRunsId`
    INNER JOIN `analysisData` ad
    ON adr.`id` = ad.`analysisDataRunsId`
    where c.contentType='specimenId'