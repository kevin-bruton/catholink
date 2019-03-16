@registration
Feature: Register a new user in the system

  @web @registrationNoEmail
  Scenario: Register a user in the system
    Given I select the sign up option on the login page
    When I fill in the registration form and send it
    And I verify my email with the code sent
    Then I am a registered user

  @deleteTestUser
  Scenario: Delete the registered user
    Given I am a registered user
    When I delete myself from the DB
    Then I am no longer found on the DB
