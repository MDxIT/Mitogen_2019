DROP VIEW IF EXISTS `vw_lims_patients`;

CREATE VIEW `vw_lims_patients` 
AS
SELECT 
    pa.`id`,
    pa.`patientId`,
    pa.`sqId`,
    pa.`firstName`,
    pa.`middleName`,
    pa.`lastName`,
    pa.`userId`,
    pa.`status`,
    pa.`placerPatientId`,
    pa.`address1`,
    pa.`address2`,
    pa.`city`,
    pa.`state`,
    pa.`postalCode`,
    pa.`country`,
    pa.`email`,
    pa.`phone1CountryCode`,
    pa.`phone1`,
    pa.`phone2CountryCode`,
    pa.`phone2`,
    pa.`phone3CountryCode`,
    pa.`phone3`,
    pa.`dob`,
    pa.`govtId`,
    pa.`geneticGender`,
    pa.`genderId`,
    pa.`ethnicity`,
    pa.`eventId`,
     e.`eventDate`
FROM 
    `patients` pa
    INNER JOIN `events` e
    ON pa.`eventId` = e.`eventId`;
