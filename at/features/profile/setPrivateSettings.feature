@setPrivacy @web
Feature: Set privacy settings on Profile Page

  Scenario: User sets his/her privacy settings
  Given I login as user with "Registered"
  And I go to my profile page
  And I go to my visibility settings
  When I change my visibility setting for "address"
  And I save my changes to my visibility settings
  And I go to my profile page
  And I go to my visibility settings
  Then my visibility setting for "address" is what I set previously
