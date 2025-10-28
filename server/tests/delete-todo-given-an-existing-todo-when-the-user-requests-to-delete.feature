Feature: Delete Todo

  Scenario: GIVEN an existing Todo; WHEN the user requests to delete the Todo; THEN a 'Todo deleted' event is published.
    Given an existing Todo
    When the user requests to delete the Todo
    Then a 'Todo deleted' event is published.