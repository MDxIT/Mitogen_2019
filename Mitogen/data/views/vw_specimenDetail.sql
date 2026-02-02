CREATE OR REPLACE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `vw_specimenDetail` AS
    SELECT
        rs.specimenId,
        rs.externalIdentifier,
        rs.expectedBarcode,
        rs.specimenType,
        rs.specimenSource,
        rs.collectionDate,
        rs.collectionTime,
        rs.receivedDate,
        rs.specimenQuantity,
        rs.specimenQuantityUnits,
        rs.collectorName,
        rs.specimenCondition,
        rs.status,
        e.eventDate as statusDate,
        p.sqid,
        p.patientId,
        p.firstName as patientFirstName,
        p.middleName as patientMiddleName,
        p.lastName as patientLastName,
        p.dob as patientDOB,
        p.geneticGender as patientGeneticGender,
        p.genderId as patientGenderIdentity,
        p.ethnicity as patientEthnicity
    FROM
        patients p
        INNER JOIN requestSpecimens rs
        ON p.patientId = rs.patientId
        LEFT OUTER JOIN events e
        ON rs.statusEventId = e.eventId
