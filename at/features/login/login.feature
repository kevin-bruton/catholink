@web @login
Feature: login

  Scenario: Login as user with name
    When I login as user with name "test1"
    Then I am on the "Home" page

  Scenario: Login as a user with a condition
    When I login as user with "ProfilePhotoSet"
    Then I am on the "Home" page

  Scenario: Login as a user with more than one condition
    When I login as user with "Registered, NoProfilePhotoSet"
    Then I am on the "Home" page
