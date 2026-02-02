CREATE OR REPLACE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `vw_specimenReceiptCounts` AS
	SELECT
		rs.receivedDate,
		COUNT(rs.id) AS receivedCount
	FROM
		requestSpecimens rs
	GROUP BY
		rs.receivedDate
	ORDER BY
		rs.receivedDate
