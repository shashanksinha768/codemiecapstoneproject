Feature: Price Range Filter
  As a user
  I want to filter accommodations by a minimum and/or maximum price per night
  So that I can find accommodations within my budget

  Background:
    Given the Travel Accommodation Search application is running

  Scenario: Filter results by valid minimum and maximum price range
    Given I open the accommodation search page
    When I search with min price "50" and max price "200"
    Then the search API request should include minPrice "50" and maxPrice "200"
    And all returned results should have price per night between 50 and 200 inclusive

  Scenario: Filter results with minimum price only
    Given I open the accommodation search page
    When I search with min price "150" and no maximum price
    Then the search API request should include minPrice "150" and not include maxPrice
    And all returned results should have price per night greater than or equal to 150

  Scenario: Filter results with maximum price only
    Given I open the accommodation search page
    When I search with no minimum price and max price "120"
    Then the search API request should include maxPrice "120" and not include minPrice
    And all returned results should have price per night less than or equal to 120

  Scenario: Reject negative minimum price input
    Given I open the accommodation search page
    When I call the search API with minPrice "-1"
    Then the response status should be 400
    And the response should include error "minPrice must be a non-negative number"

  Scenario: Reject negative maximum price input
    Given I open the accommodation search page
    When I call the search API with maxPrice "-10"
    Then the response status should be 400
    And the response should include error "maxPrice must be a non-negative number"

  Scenario: Reject non-numeric minimum price input
    Given I open the accommodation search page
    When I call the search API with minPrice "abc"
    Then the response status should be 400
    And the response should include error "minPrice must be a non-negative number"

  Scenario: Reject non-numeric maximum price input
    Given I open the accommodation search page
    When I call the search API with maxPrice "xyz"
    Then the response status should be 400
    And the response should include error "maxPrice must be a non-negative number"

  Scenario: Reject when minimum price is greater than maximum price
    Given I open the accommodation search page
    When I call the search API with minPrice "300" and maxPrice "100"
    Then the response status should be 400
    And the response should include error "minPrice must be less than or equal to maxPrice"

  Scenario: Show no results message when no accommodations match the price range
    Given I open the accommodation search page
    When I search with min price "99999" and max price "100000"
    Then the results area should show "No accommodations found matching your filters."