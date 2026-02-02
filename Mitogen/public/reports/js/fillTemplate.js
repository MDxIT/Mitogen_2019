$(function () {
                         var reportData =         {
                                    "report": {
                                                        "reportId": "RPT3",
                                                        "overallInterpretation":  "Glycine is significantly elevated in this specimen consistent with a diagnosis of non ketotic hyperglycinemia.Clinical correlation and genetic counseling are recommended.",
                                                        "references": [
                                                                                      {
                                                                                        "url": "temp",
                                                                                        "reference": "Additional reference for panel 4",
                                                                                        "codeName": "Panel_4",
                                                                                        "name": "Combined Panel"
                                                                                      },
                                                                                      {
                                                                                        "url": "temp",
                                                                                        "reference": "One more reference",
                                                                                        "codeName": "Panel_4",
                                                                                        "name": "Combined Panel"
                                                                                      },
                                                                                      {
                                                                                        "url": "temp",
                                                                                        "reference": "Reference for panel 3",
                                                                                        "codeName": "Panel_3",
                                                                                        "name": "General Panel 1"
                                                                                      }
                                                                              ],
                                      "overallWording": "OVERALLWORDING",
                                      "reportTitle": "General Report",
                                      "specimens": [
                                                                  {
                                                                    "panels": [
                                                                                        {
                                                                                          "code": "Panel_3",
                                                                                          "overallInterpreation": "INTERP",
                                                                                          "analysisMethodId": "14",
                                                                                          "overallWording": "PANELOVERALLWORDING",
                                                                                          "overallResult": "PANEL_OVERALL_0",
                                                                                          "analysisMethodName": "REPORTINGDEV",
                                                                                          "tests": [
                                                                                            {
                                                                                              "code": "Test_1",
                                                                                              "name": "General Test 1",
                                                                                              "results": [
                                                                                               { dataType: 'decimal',
                                                                                                  reportable:'reportFieldData',
                                                                                                  units: 'None',
                                                                                                  result: '50',
                                                                                                  interpretation:'',
                                                                                                  limit: '21 - 89',
                                                                                                  wording: 'toDo: WORDING',
                                                                                                  resultLabel: 'Alanine'
                                                                                              },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '22',
                                                                                                 interpretation: '',
                                                                                                 limit: '10-50' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Arginine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '7',
                                                                                                 interpretation: '',
                                                                                                 limit: '5-22' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Asparagine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '2',
                                                                                                 interpretation: '',
                                                                                                 limit: '0-6' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Aspartate'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '3',
                                                                                                 interpretation: '',
                                                                                                 limit: '1-8' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Citrulline'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '22',
                                                                                                 interpretation: '',
                                                                                                 limit: '1-27' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Glutamate'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '290',
                                                                                                 interpretation: '(L)',
                                                                                                 limit: '299-1127' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Glutamine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '200',
                                                                                                 interpretation: '(H)',
                                                                                                 limit: '4-48' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Glycine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '40',
                                                                                                 interpretation: '',
                                                                                                 limit: '9-41' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Histidine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '10',
                                                                                                 interpretation: '',
                                                                                                 limit: '3 - 20' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Isoleucine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '20',
                                                                                                 interpretation: '',
                                                                                                 limit: '9-40' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Leucine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '20',
                                                                                                 interpretation: '',
                                                                                                 limit: '11-53' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Lysine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '20',
                                                                                                 interpretation: '',
                                                                                                 limit: '11-53' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Methionine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '20',
                                                                                                 interpretation: '',
                                                                                                 limit: '11-53' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Ornithine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '20',
                                                                                                 interpretation: '',
                                                                                                 limit: '11-53' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Phenylalanine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '20',
                                                                                                 interpretation: '',
                                                                                                 limit: '11-53' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Pipecolate'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '20',
                                                                                                 interpretation: '',
                                                                                                 limit: '11-53' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Proline'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '20',
                                                                                                 interpretation: '',
                                                                                                 limit: '11-53' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Serine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '20',
                                                                                                 interpretation: '',
                                                                                                 limit: '11-53' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Taurine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '20',
                                                                                                 interpretation: '',
                                                                                                 limit: '11-53' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Threonine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '20',
                                                                                                 interpretation: '',
                                                                                                 limit: '11-53' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Tryptophan'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '20',
                                                                                                 interpretation: '',
                                                                                                 limit: '11-53' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Tyrosine'
                                                                                             },
                                                                                              { dataType: 'varchar',
                                                                                                 reportable: 'reportBoth',
                                                                                                 units: 'None',
                                                                                                 result: '20',
                                                                                                 interpretation: '',
                                                                                                 limit: '11-53' ,
                                                                                                 wording: 'toDo: WORDING',
                                                                                                 resultLabel: 'Valine'
                                                                                             } ],
                                                                                            }
                                                                                          ],
                                                                                          "name": "General Panel 1"
                                                                      }
                                                                    ],
                                                                    "specimen": "REPORT_SPECIMEN_1"
                                                                  }
                                                                ],
                                      "overallResult": "OVERALL_0",
                                      "siteInfo": {
                                                            "locationSiteFax2": "",
                                                            "primarySiteZip": "85100",
                                                            "locationSiteFax1": "",
                                                            "primarySiteAddress2": "IB 350",
                                                            "primarySiteAddress1": "975 W. Walnut Street",
                                                            "locationSitePhone1": "",
                                                            "departmentSiteAddress2": "Micro Address 2",
                                                            "departmentSiteState": "Florida",
                                                            "departmentSiteAddress1": "Micro Address 1",
                                                            "primarySiteState": "IN",
                                                            "locationSiteCity": "Indianapolis",
                                                            "primarySiteFax2": "600-500-4040",
                                                            "departmentSitePhone1": "",
                                                            "departmentSiteFax1": "",
                                                            "departmentSitePhone2": "",
                                                            "primarySiteFax1": "317-278-1616",
                                                            "departmentSiteFax2": "",
                                                            "departmentSiteCity": "Orlando",
                                                            "departmentSiteZip": "87000",
                                                            "primarySiteCity": "Indianapolis",
                                                            "departmentName": "IU Genetic Testing Laboratories",
                                                            "locationName": "Biochemical Genetics Laboratory",
                                                            "locationSiteAddress2": "MWW Address 2",
                                                            "locationSiteAddress1": "MWW Address 1",
                                                            "locationSiteState": "Florida",
                                                            "locationSiteZip": "86000",
                                                            "primarySitePhone2": "600-500-2020",
                                                            "primarySitePhone1": "317-278-6486",
                                                            "locationSitePhone2": "",
                                                            "primarySiteName": "Indiana University School of Medicine"
                                                          },
                                      "metaData": {
                                           "specimenInfo": {
                                                                        "REPORT_SPECIMEN_1": {
                                                                                                                        "externalSpecimenId": {
                                                                                                                          "label": "",
                                                                                                                          "value": ""
                                                                                                                        },
                                                                                                                        "collectionTime": {
                                                                                                                          "label": "",
                                                                                                                          "value": ""
                                                                                                                        },
                                                                                                                        "additionalFields": {},
                                                                                                                        "currentQuantityUnits": {
                                                                                                                          "label": "",
                                                                                                                          "value": ""
                                                                                                                        },
                                                                                                                        "receivedCondition": {
                                                                                                                          "label": "",
                                                                                                                          "value": ""
                                                                                                                        },
                                                                                                                        "specimenId": {
                                                                                                                          "label": "",
                                                                                                                          "value": "REPORT_SPECIMEN_1"
                                                                                                                        },
                                                                                                                        "collectionDate": {
                                                                                                                          "label": "",
                                                                                                                          "value": "12/02/2019"
                                                                                                                        },
                                                                                                                        "receivedQuantityUnits": {
                                                                                                                          "label": "",
                                                                                                                          "value": ""
                                                                                                                        },
                                                                                                                        "receivedQuantity": {
                                                                                                                          "label": "",
                                                                                                                          "value": ""
                                                                                                                        },
                                                                                                                        "expectedBarcode": {
                                                                                                                          "label": "",
                                                                                                                          "value": ""
                                                                                                                        },
                                                                                                                        "specimenType": {
                                                                                                                          "label": "",
                                                                                                                          "value": "Blood"
                                                                                                                        },
                                                                                                                        "receivedDate": {
                                                                                                                          "label": "",
                                                                                                                          "value": "12/20/2019"
                                                                                                                        },
                                                                                                                        "currentQuantity": {
                                                                                                                          "label": "",
                                                                                                                          "value": ""
                                                                                                                        },
                                                                                                                        "receivedComments": {
                                                                                                                          "label": "",
                                                                                                                          "value": ""
                                                                                                                        }
                                                                                                  }
                                                                      },
                                        "patientInformation": {
                                                                                  "lastName": {
                                                                                    "label": "Last Name",
                                                                                    "value": "Mason"
                                                                                  },
                                                                                  "country": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "ethnicity": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "mitogenPatientId": {
                                                                                    "label": "",
                                                                                    "value": "PA9"
                                                                                  },
                                                                                  "additionalFields": {},
                                                                                  "city": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "postalCode": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "homeCountryCode": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "state": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "email": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "mobileCountryCode": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "address2": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "address1": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "geneticGender": {
                                                                                    "label": "",
                                                                                    "value": "F"
                                                                                  },
                                                                                  "homePhone": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "genderId": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "mrn": {
                                                                                    "label": "",
                                                                                    "value": "1111111"
                                                                                  },
                                                                                  "sqId": {
                                                                                    "label": "",
                                                                                    "value": "sqId7"
                                                                                  },
                                                                                  "firstName": {
                                                                                    "label": "",
                                                                                    "value": "Kurt"
                                                                                  },
                                                                                  "workCountryCode": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "mobilePhone": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "dob": {
                                                                                    "label": "DOB",
                                                                                    "value": "2010-11-04"
                                                                                  },
                                                                                  "govtId": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "middleName": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "workPhone": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "placerPatientId": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "notes": {
                                                                                    "label": "",
                                                                                    "value": "This is the patient Notes."
                                                                                  }
                                                                                },
                                        "orderInformation": {
                                                                  "labNumber" : {
                                                                                    "label": "Lab #",
                                                                                    "value": "1231231"
                                                                                },
                                                                                "cap" : {
                                                                                    "label": "CAP #:",
                                                                                    "value": "1678930"
                                                                                },
                                                                                "clia": {
                                                                                    "label": "CLIA #:",
                                                                                    "value": "15D06447198"
                                                                                },
                                                                              "statusDate": {
                                                                                "label": "",
                                                                                "value": "2019-11-19 19:10:47"
                                                                              },
                                                                              "additionalFields": {},
                                                                              "consenteePatientRelationship": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "mrnType": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "panels": {
                                                                                "label": "",
                                                                                "value": "Panel_3^General Panel 1"
                                                                              },
                                                                              "patientSignatureDate": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "physicianComment": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                 "physicianInformation": {
                                                                                "lastName": {
                                                                                  "label": "",
                                                                                  "value": "Test Physician"
                                                                                },
                                                                                "mitogenPhysicianId": {
                                                                                  "label": "",
                                                                                  "value": "PH1"
                                                                                },
                                                                                "gender": {
                                                                                  "label": "",
                                                                                  "value": "Female"
                                                                                },
                                                                                "additionalFields": {},
                                                                                "title": {
                                                                                  "label": "",
                                                                                  "value": "MD-PhD"
                                                                                },
                                                                                "providerType": {
                                                                                  "label": "",
                                                                                  "value": "Genetic Counselor"
                                                                                },
                                                                                "firstName": {
                                                                                  "label": "",
                                                                                  "value": "Susan"
                                                                                },
                                                                                "dob": {
                                                                                  "label": "",
                                                                                  "value": "1950-01-31"
                                                                                },
                                                                                "providerId": {
                                                                                  "label": "",
                                                                                  "value": "40004000"
                                                                                },
                                                                                "middleName": {
                                                                                  "label": "",
                                                                                  "value": "A"
                                                                                }
                                                                              },
                                                                              "type": {
                                                                                "label": "",
                                                                                "value": "General"
                                                                              },
                                                                              "externalRequestId": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "physicianSignature": {
                                                                                "label": "",
                                                                                "value": "\u0000"
                                                                              },
                                                                              "consentBy": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "requestId": {
                                                                                "label": "Order ID",
                                                                                "value": "R30"
                                                                              },
                                                                              "siteInformation": {
                                                                                "country": {
                                                                                  "label": "",
                                                                                  "value": "USA"
                                                                                },
                                                                                "website": {
                                                                                  "label": "",
                                                                                  "value": ""
                                                                                },
                                                                                "siteCode": {
                                                                                  "label": "",
                                                                                  "value": ""
                                                                                },
                                                                                "additionalFields": {},
                                                                                "address2": {
                                                                                  "label": "",
                                                                                  "value": "Test Address 2"
                                                                                },
                                                                                "city": {
                                                                                  "label": "",
                                                                                  "value": "Tucson"
                                                                                },
                                                                                "address1": {
                                                                                  "label": "",
                                                                                  "value": "Test Address 1"
                                                                                },
                                                                                "postalCode": {
                                                                                  "label": "",
                                                                                  "value": "84700"
                                                                                },
                                                                                "phone2": {
                                                                                  "label": "",
                                                                                  "value": "520-100-1000"
                                                                                },
                                                                                "siteName": {
                                                                                  "label": "",
                                                                                  "value": "Client A"
                                                                                },
                                                                                "mitogenOrganizationId": {
                                                                                  "label": "",
                                                                                  "value": "ORG1"
                                                                                },
                                                                                "phone1": {
                                                                                  "label": "",
                                                                                  "value": "520-200-2000"
                                                                                },
                                                                                "mitogenSiteId": {
                                                                                  "label": "",
                                                                                  "value": "SITE1"
                                                                                },
                                                                                "organization": {
                                                                                  "label": "",
                                                                                  "value": "Organization Y"
                                                                                },
                                                                                "fax2": {
                                                                                  "label": "",
                                                                                  "value": "520-400-4000"
                                                                                },
                                                                                "state": {
                                                                                  "label": "",
                                                                                  "value": "Arizona"
                                                                                },
                                                                                "fax1": {
                                                                                  "label": "",
                                                                                  "value": "520-300-3000"
                                                                                },
                                                                                "email": {
                                                                                  "label": "",
                                                                                  "value": "site_A@gmail.com"
                                                                                }
                                                                              },
                                                                              "mrnFacility": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "receivedDate": {
                                                                                "label": "Received Date",
                                                                                "value": "2019-11-12"
                                                                              },
                                                                              "encounterNumber": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "placerOrderId": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "uxPriority": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "orderMrn": {
                                                                                "label": "",
                                                                                "value": "1111111"
                                                                              },
                                                                              "consent": {
                                                                                "label": "",
                                                                                "value": "\u0000"
                                                                              },
                                                                              "priority": {
                                                                                "label": "Priority",
                                                                                "value": "0"
                                                                              },
                                                                              "accountNumber": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "externalSystem": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "patientSignature": {
                                                                                "label": "",
                                                                                "value": "\u0000"
                                                                              },
                                                                              "workersComp": {
                                                                                "label": "",
                                                                                "value": "\u0000"
                                                                              },
                                                                              "physicianSignatureDate": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "sendingFacility": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "sendingApp": {
                                                                                "label": "",
                                                                                "value": ""
                                                                              },
                                                                              "clinicalTrial": {
                                                                                "label": "",
                                                                                "value": "\u0000"
                                                                              },
                                                                              "status": {
                                                                                "label": "",
                                                                                "value": "In Lab"
                                                                              }
                                        },
                                        "clinicalInformation": {
                                                                                  "miscarriagesComments": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "biopsyHistoryOther": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "additionalFields": {},
                                                                                  "hysterectomy": {
                                                                                    "label": "",
                                                                                    "value": "0"
                                                                                  },
                                                                                  "meconiumIleusComments": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "geneticCounselor": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "babyIdentifyingNumber": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "clinicalHistory": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "transfusionTransplantHistory": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "thyroidIssuesComments": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "pregnant": {
                                                                                    "label": "",
                                                                                    "value": "0"
                                                                                  },
                                                                                  "lastPregnancy": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "dateOfFirstMilk": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "locationOfSampling": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "ageAtInitialPresentation": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "problematicMedicationsList": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "timeOfFirstMilk": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "meconiumIleus": {
                                                                                    "label": "",
                                                                                    "value": "0"
                                                                                  },
                                                                                  "dateOfLastPSA": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "referringDoctor": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "donorOrRecipient": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "percentFreePSA": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "ambiguousGenitalia": {
                                                                                    "label": "",
                                                                                    "value": "0"
                                                                                  },
                                                                                  "privatePublicPatient": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "clinicalNotes": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "birthTime": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "bloodType": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "drugAllergiesList": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "pregnantComments": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "histopathologyFindings": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "familyHistoryCFComments": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "miscarriages": {
                                                                                    "label": "",
                                                                                    "value": "0"
                                                                                  },
                                                                                  "ambiguousGenitaliaComments": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "hysterectomyComments": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "lastMenstrualCycle": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "clinicalHistoryOfMother": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "motherFullName": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "transfusionHistory": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "thyroidIssues": {
                                                                                    "label": "",
                                                                                    "value": "0"
                                                                                  },
                                                                                  "placeOfBirth": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "prePostTransfusion": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "dateOfLastDRE": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "feedingHistory": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "biopsyHistoryNumber": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "currentMedicationsList": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "familyHistoryCF": {
                                                                                    "label": "",
                                                                                    "value": "0"
                                                                                  },
                                                                                  "repeatSample": {
                                                                                    "label": "",
                                                                                    "value": "0"
                                                                                  },
                                                                                  "lastDREResults": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "lastPSA": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  },
                                                                                  "birthWeight": {
                                                                                    "label": "",
                                                                                    "value": ""
                                                                                  }
                                                                                }
                                      },
                                      "reportDate": "",
                                      "reportDescription": "This is the report description",
                                      "wording": {
                                                    "test": {
                                                              "Test_1": [
                                                                {
                                                                  "code": "Test_1",
                                                                  "type": "Test",
                                                                  "name": "General Test 1",
                                                                  "header": "Header for Test 1",
                                                                  "wording": "Information about Test 1"
                                                                },
                                                                {
                                                                  "code": "Test_1",
                                                                  "type": "Test",
                                                                  "name": "General Test 1",
                                                                  "header": "Header 2 for test 2",
                                                                  "wording": "More Information about test 1"
                                                                }
                                                              ]
                                                            },
                                        "method": {
                                                              "Mthd_1": [
                                                                          {
                                                                            "code": "Method",
                                                                            "type": "Method",
                                                                            "name": "General Method 1",
                                                                            "header": "Methodology",
                                                                            "wording": "This test was developed and its performance characteristics determined by Indiana University Biochemical Genetics Laboratory. It has not been cleared or approved by the U.S. Food and Drug Administration. This \
                                                                                                test is used for clinical purposes. It should not be regarded as investigational or for research. The laboratory \
                                                                                                is certified under the Clinical Laboratory Improvement Amendments of 1988 (CLIA ’88) as qualified to \
                                                                                                perform high complexity clinical laboratory testing. CLIA # 15D0647198 ▪ CAP# 1678930",
                                                                          }
                                                              ]
                                                            },
                                        "panel": {
                                                            "Panel_3": [
                                                          {
                                                            "code": "Panel_3",
                                                            "type": "Panel",
                                                            "name": "General Panel 1",
                                                            "header": "Header for panel 4",
                                                            "wording": "My wording"
                                                          }
                                                        ]
                                                      }
                                                }
                                          }
                                  };


          // Get signature name, title, and image for use in report
          // Template should reference {{signatureText}}, {{signatureTitle}} and {{signatureImagePath}} to use
          var signatureName = $("#signatureName").val();
          var signatureTitle =$("#signatureTitle").val();
          var signatureImagePath = $("#signatureImagePath").val();

          reportData.report.signatureName = signatureName;
          reportData.report.signatureTitle = signatureTitle;
          reportData.report.signatureImagePath = signatureImagePath;

          console.log(reportData);

          if(reportData.report.reportDate == "") {
               var reportDate = $.datepicker.formatDate('mm/dd/yy', new Date());
               console.log("reportDate:" + reportDate);
               reportData.report.reportDate = reportDate;
          }

              //compile template
              var source = $("#template").html();
              var template = Handlebars.compile(source);

             // var template = Handlebars.templates['template1'];
              var data =  template(reportData);
              $("#reportBody").append(data);

          // if with operators
          Handlebars.registerHelper('iff', function(a, operator, b, opts) {
              var bool = false;
              switch(operator) {
                 case '==':
                     bool = a == b;
                     break;
                 case '>':
                     bool = a > b;
                     break;
                 case '<':
                     bool = a < b;
                     break;
                 default:
                     throw "Unknown operator " + operator;
              }

              if (bool) {
                  return opts.fn(this);
              } else {
                  return opts.inverse(this);
              }
          });

          //limit each
          Handlebars.registerHelper('each_upto', function(ary, max, options) {
              if(!ary || ary.length == 0)
                  return options.inverse(this);

              var result = [ ];
              for(var i = 0; i < max && i < ary.length; ++i)
                  result.push(options.fn(ary[i]));
              return result.join('');
          });

          //limit each start and stop
          Handlebars.registerHelper('each_from_to', function(ary, min, max, options) {
              if(!ary || ary.length == 0)
                  return options.inverse(this);

              var result = [ ];
              for(var i = min; i < max && i < ary.length; ++i)
                  result.push(options.fn(ary[i]));
              return result.join('');
          });

          function substitute() {
            var vars = {};
            var x = window.location.search.substring(1).split('&');
            for (var i in x) {
              var z = x[i].split('=',2);
              vars[z[0]] = unescape(z[1]);
            }

            var subst = [
              // Defaults
              'page', 'frompage', 'topage', 'webpage',
              'section', 'subsection', 'date', 'isodate', 'time',
              'title', 'doctitle', 'sitepage', 'sitepages',
              // User
              'patientName'
            ];
            for (var i in subst) {
              var y = document.getElementsByClassName(subst[i]);
              var c = y.length;
              for (var j = 0; j < c; ++j) {
                y[j].textContent = vars[subst[i]];
              }
            }
          }

});
