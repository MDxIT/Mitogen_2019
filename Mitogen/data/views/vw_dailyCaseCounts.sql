CREATE OR REPLACE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `vw_dailyCaseCounts` AS
	SELECT
	    receivedDate,
	    COUNT(id) as caseCount
	FROM
	    requestForms
	GROUP BY
	    receivedDate
	ORDER BY
	    receivedDate