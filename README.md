# Travel Accommodation Search – Capstone Project

## Project overview
This project is a basic online accommodation booking app that allows users to browse and book accommodations. The current increment adds *Advanced Search Filters* to help users refine search results by:

- Amenities (e.g. Free Wi-Fi, Breakfast included)
- Property Type (e.g. Hotel, Villa)

## Tech stack
- Frontend: (see repo code for specific frameworks)
- Testing: Playwright (E2!)
- CI: GitHub (PR/branch-based workflow)

## Documentatiom (Confluence)
All SDLC artifacts for the Advanced Filters increment are published in Confluence (Space: SC):

- FRD – Advanced Filters — Functional Requirements Document (FRD)
  - https://shashanksinha768.atlassian.net/wiki/spaces/SC/pages/8224770/Advanced+Filters+Functional+Requirements+Document+FRD

- Architecture
  - https://shashanksinha768.atlassian.net/wiki/spaces/SC/pages/8552458/Advanced+Filters+-+Architecture+Document
  - (legacy architecture page): https://shashanksinha768.atlassian.net/wiki/spaces/SC/pages/5996545/Architecture+Advanced+Accommodation+Search+Filters

- Design
  - HLD:  https://shashanksinha768.atlassian.net/wiki/spaces/SC/pages/8749058/Advanced+Filters+-+High-Level+Design+HLD 
  - LLD:  https://shashanksinha768.atlassian.net/wiki/spaces/SC/pages/8847361/Advanced+Filters+-+Low-Level+Design+LLD 
- Wireframes
  - https://shashanksinha768.atlassian.net/wiki/spaces/SC/pages/8486929/Advanced+Filters+-+Wireframes

- Test Report (Playwright)
  - https://shashanksinha768.atlassian.net/wiki/spaces/SC/pages/8880129/Advanced+Filters+Test+Execution+Report+Playwright

## Setup
### Prerequisites
- Git
- Node.js (LTS)
- npm (or yarn/pnmp if the repo uses it)

### Install

```bash
git clone https://github.com/shashanksinha768/codemiecapstoneproject.git
cd codemiecapstoneproject
npm install
```


### Run the app (local)
Commands may vary depending on the repo scripts. Try:

```bash
npm start
```

## How to run tests
The automated E2E suite is written with Playwright. Try:

```bash
npm test
# or, usually for playwright
npx playwright test
```


## Related items
- Jira: EPMCDMETST-57558, EPMCDMETST-57559, EPMCDMETST-57560
