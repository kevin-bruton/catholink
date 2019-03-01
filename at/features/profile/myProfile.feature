@web @profile
Feature: My Profile Page

  Scenario: See my profile page
    Given I login as user with "Registered"
    When I select the "my profile" button
    And I select "view profile"
    Then I'm on the profile page

  # With webdriver we can't automate the actual upload
  Scenario: Add photo to profile
    Given I login as user with "Registered, NoProfilePhotoSet"
    And I go to my profile page
    When I select the add profile photo option
    Then I can select upload a photo

  Scenario: See set photo on profile page
    Given I login as user with "Registered, ProfilePhotoSet"
    When I go to my profile page
    Then I can see my photo on my profile page
