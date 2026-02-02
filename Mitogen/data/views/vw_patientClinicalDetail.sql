CREATE OR REPLACE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW  `vw_patientClinicalDetail` AS
    SELECT
        p.sqid,
        p.patientId,
        p.firstName as patientFirstName,
        p.middleName as patientMiddleName,
        p.lastName as patientLastName,
        p.dob as patientDOB,
        p.geneticGender as patientGeneticGender,
        p.genderId as patientGenderIdentity,
        p.ethnicity as patientEthnicity,
        pc.diagnosis,
        pc.histoDiagnosis,
        pc.presentationAge,
        pc.medications,
        pc.problemMedications,
        pc.allergies,
        pc.clinicalNotes,
        pc.clinicalHIstory,
        pc.geneticCounselor
    FROM
        patients p
        INNER JOIN patientClinical pc
        ON p.patientId = pc.patientId
