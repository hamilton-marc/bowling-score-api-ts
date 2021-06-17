# This feature file describes the expected behavior of our 
# Bowling Score implementation using the Gherkin style syntax
#
Feature: Bowling Score

  Scenario: Forefit an incomplete game
    Given I am playing a single player game
    And I throw a ball and knock down 9 pins
    When I quit the game
    Then my score should be 9

  Scenario: Bowl a perfect game
    Given I am playing a single player game
    And I bowl a perfect game
    When I quit the game
    Then my score should be 300

  Scenario: Bowl all spares with 5 pins on each throw
    Given I am playing a single player game
    And I bowl all 5s
    When I quit the game
    Then my score should be 150