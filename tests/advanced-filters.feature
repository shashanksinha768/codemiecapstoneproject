Feature: Advanced filters for accommodation search

  As user
  Iwant to refine search results using advanced filters
  So that I can find accommodations that match my preferences

  Background:
    Given the application is running
    And I am on the Travel Accommodation Search page

  @EPMCDMETST-57558
  Scenario: Filter by amenities (free Wi-Fi, breakfast included)
    When I select the amenity "Free Wi-Fi"
    And I select the amenity "Breakfast included"
    And I click "Search"
    Then I should see only accommodations that have both amenities
    And I should see at least one result

  @EPMCDMETST-57559
  Scenario: Filter by property type (hotel)
    When I select the property type "Hotel"
    And I click "Search"
    Then I should see only accommodations with property type "hotel"
    And I should see at least one result

  @EPMCDMETST1-57560
  Scenario: Combine amenities and property type filters (villa + free Wi-Fi)
    When I select the amenity "Free Wi-Fi"
    And I select the property type "Villa"
    And I click "Search"
    Then I should see only accommodations with property type "villa"
    And I should see only accommodations that have amenity "Free Wi-Fi"
