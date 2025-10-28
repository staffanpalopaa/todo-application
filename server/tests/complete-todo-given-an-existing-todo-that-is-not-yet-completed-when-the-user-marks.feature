Feature: Complete Todo

  Scenario: GIVEN an existing Todo that is not yet completed; WHEN the user marks the Todo as completed; THEN a 'Todo completed' event is published.
    Given an existing Todo that is not yet completed
    When the user marks the Todo as completed
    Then a 'Todo completed' event is published.