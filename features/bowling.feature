# This feature file describes the expected behavior of our 
# Bowling Score implementation using the Gherkin style syntax
#
Feature: Bowling Score

  Scenario: Forefit an incomplete game
    Given I am playing a single player game
    And I throw a ball and knock down 0 pins
    When I quit the game
    Then my score should be 0