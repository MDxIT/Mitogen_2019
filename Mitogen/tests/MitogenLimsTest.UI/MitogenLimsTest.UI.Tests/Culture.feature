Feature: Culture
	In order to use Mitogen as a user I need to create culture requisitions

@mytag
Scenario: New Requisition
	Given I login to Mitogen as "willb" with password "$unquestDEV"
	And I create a Patient with demographics:
	| FirstName | LastName | SSN         | DateOfBirth | Gender | Ethnicity        | AddressLine1     | City   | State | PostalCode |
	| Test      | Patient  | 999-99-7897 | 05/10/1991  | Female | African American | 222 Address Line | Denver | CO    | 55555      |
	When I go to "Accessioning"
	And I create a new "Cytogenetics" request
	And I enter patient information
	And I enter ordering facility "ABC Laboratory" and physician "Jen Johnson"
	And I enter specimen info
	And I select test panel "BCR/ABL Panel"
	And I bill to "Customer"
	And I submit the new requisition
	Then the requisition is ready for QC requisition

