@web
Feature: Web Driver IO Test
  As a developer
  I want to see the webdriver working on a web page
  So that I can run tests that interact with the browser

  Scenario: Web Driver Test
    Given the browser starts
    When navegate to google
    Then the title of the web page is google
    