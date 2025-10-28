Feature: Update Todo

  Scenario: GIVEN an existing Todo with a description; WHEN the user modifies the description; THEN a 'Todo updated' event is published with the new details.
    Given an existing Todo with a description
    When the user modifies the description
    Then a 'Todo updated' event is published with the new details