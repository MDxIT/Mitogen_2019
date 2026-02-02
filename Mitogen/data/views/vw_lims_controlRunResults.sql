DROP VIEW IF EXISTS `vw_lims_controlRunResults`;

CREATE VIEW `vw_lims_controlRunResults` 
AS
SELECT 
	cr.`id` as `controlRunsId`,
    cr.`controlRunId`,
    cr.`controlId`,
    cr.`currentContainerId`,
    cr.`eventId`,
    e1.`eventDate`,
    cr.`lastUpdatedEventId`,
	e2.`eventDate` as `lastUpdateEventDate`,
    acd.`varcharResult`,
    acd.`decimalResult`,
    acd.`dateTimeResult`,
    acd.`units`,
    acd.`calculatedInterpretation`,
    acd.`actualInterpretation`,
    acd.`eventId` as `analysisControlDataEventId`,
    e3.`eventDate` as `analysisControlDataEventDate`    
FROM controlRuns cr
	INNER JOIN controls c
    ON cr.controlId = c.controlid
    INNER JOIN analysisControlDataRuns acdr
    ON cr.id = acdr.controlRunsId
    INNER JOIN analysisControlData acd
    ON acdr.id = acd.analysisControlDataRunsId
    INNER JOIN `events` e1
    ON cr.`eventId` = e1.`eventId`
    INNER JOIN `events` e2
    ON cr.`lastUpdatedEventId` = e2.`eventId`
    INNER JOIN `events` e3
    ON acd.`eventId` = e3.`eventId`;
    
