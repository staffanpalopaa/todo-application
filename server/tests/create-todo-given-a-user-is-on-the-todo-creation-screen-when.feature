Feature: Create Todo

  Scenario: GIVEN a user is on the todo creation screen; WHEN the user enters a description and submits; THEN a 'Todo created' event is published.
    Given a user is on the todo creation screen;
    When the user enters a description and submits;
    Then a 'Todo created' event is published.