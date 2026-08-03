# Price Range Filter - Implementation Plan

Source Jira User Story: EPMCDMETST-57810
Epic Link: EPMCDMETST-55964

Selected Feature Scope (ONLY):
- Add a Price Range filter to the accommodation search flow that allows users to specify minimum and maximum price per night, with validation and no-results handling.

---

## 1) Phases, Milestones, Tasks with Owners and Effort Estimates

Effort unit: days (effective engineering days, excluding blocked time).

Roles / owners (suggested):
- BE = Backend Engineer
- FE = Frontend Engineer
- QA = QA Engineer
- DEVOPS = DevOps / Release Engineer
- PO/BA = Product Owner / Business Analyst or Tech Lead

---

### Phase A: Analysis

Milestone A0 - Requirements confirmed and scope frozen

A1. Review user story, scenarios, acceptance criteria (esp. validation and no-results message)
- Owner: PO/BA
- Effort: 0.5 day
- Deliverable: Clarified behavior notes and open questions (if any)

A2. Determine current state of data model and search pipeline
- Check if accommodations table already has price_per_night column
- Check how /api/search builds its query (ORM/query builder vs raw SQL)
- Owner: BE
- Effort: 0.5 day
- Deliverable: Impact analysis notes (files/modules likely to change)

A3. Agree on UX behavior for price filter
- Slider vs two inputs (min/max)
- Defaults (empty means no filter)
- Validation rules and error text
- Owner: PO/BA + FE
- Effort: 0.5 day
- Deliverable: UX decisions captured

Definition of Done (Analysis)
- Stakeholders confirm input format minPrice/maxPrice in API spec
- FE validation rules and no-results message approved
- Dependencies identified

---

### Phase D: Design

Milestone D0 - Technical design and API contract ready

D1. API contract update for /api/search
- Add query params:
  - minPrice (optional, number)
  - maxPrice (optional, number)
- Validation: non-negative, min <= max if both provided
- Behavior: if one missing, apply only the other bound
- Owner: BE + PO/BA
- Effort: 0.5 day
- Deliverable: API spec/notes (OpenAPI if present)

D2. Database design decisions
- Confirm type (INTEGER/DECIMAL) and currency assumption
- Indexing on price_per_night if needed (based on table size)
- Owner: BE
- Effort: 0.5 day
- Deliverable: DB migration plan (if needed)

D3. Frontend design: filters panel addition
- Component: Price Range (min, max)
- State handling: store filters in URL query or local state (match current app pattern)
- Error state and message presentation
- Owner: FE + PO/BA
- Effort: 0.5 day
- Deliverable: Wireframe/component spec

Definition of Done (Design)
- API contract agreed and documented
- DB change planned and safe for rollback
- FE component interactions and validation spec approved

---

### Phase E: Development

Milestone E0 - Backend filtering and input validation working

E1. DB (if price_per_night missing)
- Add price_per_night column to accommodations table
- Backfill defaults or make nullable based on data availability
- Owner: BE
- Effort: 1.0 day

E2. Update /api/search handler to accept minPrice/maxPrice params
- Parse and coerce to number; handle missing/empty
- Validate: non-negative, min <= max
- Return 400 with clear error payload on invalid input
- Owner: BE
- Effort: 1.0 day

E3. Apply filter to data access query
- When both bounds: WHERE price_per_night BETWEEN min AND max
- When only min: price_per_night >= min
- When only max: price_per_night <= max
- Decide how to handle NULL prices (recommended: exclude NULL when filter present)
- Owner: BE
- Effort: 1.0 day

E4. Backend unit tests (query builder/service)
- Test combinations: none, min only, max only, both, invalid
- Owner: BE + QA
- Effort: 0.75 day

Milestone E1 - Frontend filter UI and integration working

E5. Add Price Range control to filters panel
- Two inputs or slider based on design decision
- Labels: Min price per night, Max price per night
- Owner: FE
- Effort: 1.0 day

E6. Client validation
- Negative values rejected
- min > max rejected
- Disable Search or show inline error and prevent submit
- Owner: FE
- Effort: 0.75 day

E7. Param mapping to /api/search request
- Include minPrice/maxPrice in query params on submit
- Preserve existing filters amenities, property type (no regressions)
- Owner: FE
- Effort: 0.75 day

E8. No-results message integration
- When backend returns empty result set, show "No results found" message (match existing app pattern)
- Owner: FE
- Effort: 0.5 day

E9. Frontend unit tests for validation and param mapping
- Test form validation and request payload
- Owner: FE + QA
- Effort: 0.75 day

Definition of Done (Development)
- Backend endpoint accepts minPrice/maxPrice, validates input, and filters results
- Frontend displays price range filter, validates, sends params, and handles empty results

---

### Phase T: Testing

Milestone T0 - Test coverage and sign-off

T1. API integration tests (or e2e)
- Given data with known prices, verify filtered results
- Cases: min/max bounds, min only, max only, no bounds
- Negative and min > max returns 400
- Owner: QA + BE
- Effort: 1.0 day

T2. Frontend e2e tests (or Cypress scenarios if present)
- Set price range, submit, verify results restricted
- Invalid input shows validation error and does not send request
- No-results displays correct message
- Owner: QA + FE
- Effort: 1.0 day

T3. Manual regression testing for existing filters
- Amenities and property type filters still work
- URL param persistence (if applicable)
- Owner: QA
- Effort: 0.5 day

Definition of Done (Testing)
- All AC passed in test env
- Automated tests added where feasible
- No critical regressions in search flow

---

### Phase DP: Deployment

Milestone DP0 - Release and rollback ready

DP1. DB will be migrated (if needed)
- Ensure additive change (add column) is backwards compatible
- Rollback plan: revert migration / ignore column in code
- Owner: DEVOPS + BE
- Effort: 0.5 day

DP2. Deploy to staging env
- Run automated tests and smoke tests
- Owner: DEVOPS + QA
- Effort: 0.5 day

DP3. Prod deployment
- Monitor search error rates and performance
- Owner: DEVOPS
- Effort: 0.5 day

Definition of Done (Deployment)
- Feature deployed to target env(s) with no increase in error rate
- Rollback plan validated
- Feature notes updated (if you have release notes)

---

## 2) Effort Summary

- Analysis: 1.5 days
- Design: 1.5 days
- Development: 7.5 days
- Testing: 2.5 days
- Deployment: 1.5 days

Total (approx): 14.5 days

---

## 3) Dependencies

- Accommodations data model and price_per_night availability
- Stable search API code path to extend with new query params
- Frontend filters panel component structure (to insert new control)

---

## 4) Risks and Mitigations

- Risk: price_per_night missing or inconsistent in data
  - Mitigation: allow NULL, exclude NULLs when filter applied, backfill gradually
- Risk: performance degradation on large table scans
  - Mitigation: index on price_per_night, add query plan check in staging
- Risk: inconsistent validation between FE and BE
  - Mitigation: shared validation rules in spec; be strict in API (FE is UX only)

---

## 5) Checklist against Acceptance Criteria

- AC1: DB price_per_night column exists (verify migration or existing)
- AC2: /api/search accepts minPrice and maxPrice and filters results
- AC3: FE displays Price Range filter in filters panel
- AC4: Users can set min and max and see filtered results
- AC5: Validation prevents negative prices or minPrice > maxPrice
- AC6: No results message shown when no matches
- AC7: Changes linked to epic EPMCDMETST-55964
