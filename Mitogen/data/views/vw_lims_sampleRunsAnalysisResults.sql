DROP VIEW IF EXISTS `vw_lims_sampleRunsAnalysisResults`;

CREATE VIEW `vw_lims_sampleRunsAnalysisResults` 
AS
SELECT 	
    sr.`id` as `specimenRunsId`,
	sr.`runId`,
	sr.`currentContainerId` as `sampleId`,
	sr.`eventId`,
	e1.`eventDate`,    
	sr.`lastUpdatedEventId`,
	e2.`eventDate` as `lastUpdatedEventDate`,
    c.`content` as `specimenId`,
    c.`eventId` as `specimenEventId`,
    e3.`eventDate` as `specimenDate`,
    ad.`varcharResult`,
    ad.`decimalResult`,
    ad.`dateTimeResult`,
    ad.`units`,
    ad.`calculatedInterpretation`,
    ad.`actualInterpretation`,
    ad.`eventId` as `analysisDataEventId`,
    e4.`eventDate` as `analysisDataEventDate`
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
    INNER JOIN `events` e4
    ON ad.`eventId` = e4.`eventId`
    where c.contentType='specimenId'