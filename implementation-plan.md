# Advanced Filters (Amenities, Property Type, Review Score) – Implementation Plan

Epic: *EPCMCDMETST-55964* — <https://jiraeu.epam.com/browse/EPMCDMETST-55964>

Jira User Stories:
- *EPCMCDMETST-56170* Amenities filter
  - As a traveler, I want to filter accommodations by amenities, so that I can find properties that meet my specific needs.
- *EPMCDMETST-56171* Property Type filter
  - As a traveler, I want to filter accommodations by property type, so that I can find the type of property that best suits my preferences.
- *EPMCDMETST-56172* Customer Review Score filter
  - As a traveler, I want to filter accommodations by customer review score, so that I can choose properties with high ratings.

Existing implementation Tasks (reference/live trackable work in Jira):
- *EPMCDMETST-56173* Implement amenities filter in search UI & backend
- *EPMCDMETST-56174* Implement property type filter in search UI & backend
- *EPMCDMETST-56175* Implement customer review score filter in search UI & backend

---

## 1) Phase Breakdown (Plan By Phase)

This plan is broken into the required phases: **Analysis, Design, Development, Testing, Deployment**. Each phase includes tasks, owners (roles), estimates (story points), dependencies, and a phase Definition of Done.


---

## 2) Gaps Identified (As-Is → To-Be)

### As-Is (current)
- Search filters: destination, dates, passenger count
- No filtering by amenities, property type, or review score
- UI lacks filter panel/chips and a shareable filter state (URL) model

### To-Be (target)
- Add advanced filters to refine search results by:
  - Amenities (multi-select)
  - Property type (multi-select or single-select – to confirm in Annalysis)
  - Customer review score (min threshold e.g. ≡ 8.0)
- Unified filter state sync between UI ↔ URL → API query params