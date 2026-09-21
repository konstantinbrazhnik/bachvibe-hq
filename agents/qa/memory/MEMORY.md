# QA — memory

## Targets
- Preview: https://test.bachvi.be · impersonation: `POST /api/dev/impersonate`.
- E2E suite in Daren-bach runs `workers: 1`; read `last-ride` "Testing
  standards" before running it — several specs wipe tables and refuse to run
  against a remote URL by design.

## Persona catalogue
- organizer, attendee, honoree, reseller, peeker (draft until the feature
  exists), payer.

## Gotchas
- `toBeVisible()` passes on a buried modal; hit-test the centre
  (`last-ride` #37, #43).
