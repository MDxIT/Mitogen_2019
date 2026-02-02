CREATE OR REPLACE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `vw_requestDetail` AS
    SELECT
        rf.priority,
        rf.requestId,
        rf.placerOrderId,
        rf.externalRequestId,
        rf.externalSystem,
        rf.receivedDate,
        rf.type,
        rf.clinicalTrial,
        rf.workersComp,
        rf.consent,
        rf.consentBy,
        rf.consenteePatientRelationship,
        rf.patientSignature,
        rf.patientSignatureDate,
        rf.physicianSignature,
        rf.physicianSignatureDate,
        p.sqid,
        rf.mrn,
        rf.mrnType,
        rf.encounterNumber,
        rf.accountNumber,
        rf.patientId,
        p.firstName as patientFirstName,
        p.middleName as patientMiddleName,
        p.lastName as patientLastName,
        p.dob as patientDOB,
        p.geneticGender as patientGeneticGender,
        p.genderId as patientGenderIdentity,
        p.ethnicity as patientEthnicity,
        rf.physicianComment,
        rf.physicianId,
        ph.first_name as physicianFirstName,
        ph.middle_name as physicianMiddleName,
        ph.last_name as physicianLastName,
        ph.title as physicianTitle,
        ph.providerType,
        ph.providerId,
        o.orgId,
        o.name as organizationName,
        os.Name as siteName,
        os.address1 as siteAddress1,
        os.address2 as siteAddress2,
        os.city as siteCity,
        os.state as siteState1,
        os.postalcode as sitePostalCode,
        os.country as siteCountry,
        os.phone1 as sitePhone1,
        os.phone2 as sitePhone2,
        os.fax1 as siteFax1,
        os.fax2 as siteFax2,
        os.timezone as siteTZ
    FROM
        requestForms rf
        LEFT OUTER JOIN patients p
        ON rf.patientId = p.patientId
        LEFT OUTER JOIN physicians ph
        ON rf.physicianId = ph.physicianId
        LEFT OUTER JOIN organizationSites os
        ON rf.physicianSiteId = os.siteId
        LEFT OUTER JOIN organizations o
        ON os.orgId = o.orgId

