CREATE OR REPLACE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `vw_specimenTypeReceiptCounts` AS
	SELECT
		rs.receivedDate,
		rs.specimenType,
	COUNT(rs.id)  AS receivedCount
	FROM
		requestSpecimens rs
	GROUP BY
		rs.receivedDate
	ORDER BY
		rs.receivedDate,
		rs.specimenType
