Feature: Price Range Filter for accommodation search

  As a user
  I want to filter accommodations by a price range
  So that I can find accommodations within my budget

  Background:
    Given the application is running
    And I am on the Travel Accommodation Search page

  @EPMMCDMETST-57797
  Scenario: Filter by valid minimum and maximum price
    When I enter minimum price "90"
    And I enter maximum price "200"
    And I click "Search"
    Then I should see only accommodations with price per night between "90" and "200"
    And I should see at least one result

  @EPMMCDMETST-57797
  Scenario: Filter by minimum price only
    When I enter minimum price "200"
    And I click "Search"
    Then I should see only accommodations with price per night greater than or equal to "200"
    And I should see at least one result


  @EPMMCDMETST-57797
  Scenario: Filter by maximum price only
    When I enter maximum price "150"
    And I click "Search"
    Then I should see only accommodations with price per night less than or equal to "150"
    And I should see at least one result


  @EPMMCDMETST-57797
  Scenario: Invalid input - negative minimum price is rejected
    When I enter minimum price "-1"
    And I click "Search"
    Then I should see a validation error message for the price range


  @EPMMCDMETST-57797
  Scenario: Invalid input - non-numeric price is rejected
    When I enter minimum price "abc"
    And I click "Search"
    Then I should to see a validation error message for the price range

  @EPMCDMETST-57797
  Scenario: Invalid input - minimum price greater than maximum price is rejected
    When I enter minimum price "250"
    And I enter maximum price "100"
    And I click "Search"
    Then I should to see a validation error message for the price range

  @EPMMCDMETST-57797
  Scenario: No results for price range with no matching accommodations
    When I enter minimum price "10000"
    And I enter maximum price "10500"
    And I click "Search"
    Then I should see a no results message stating no accommodations are found
