---
title: The dispatcher's email smoke test passed while every fixture was rejected
date: 2026-09-23
card: konstantinbrazhnik/Daren-bach#77
category: tooling
tags: [dispatch, smoke, email, fixtures, wrangler, vacuous-test]
symptom: "`node smoke.mjs` printed `smoke: pass` while each .eml fixture answered 400"
root_cause: the assertion was `status >= 500` and wrangler's local email harness rejects a message without a Message-ID with 400
---

## What happened
The first run of `hq/dispatch/smoke.mjs` reported pass on three fixtures that
had all been refused by the local email endpoint
(`/cdn-cgi/handler/email`) with `400 Email could not be parsed: invalid or no
message id provided`. The handler under test never ran.

## Why
The check was written as "anything that is not a server error is fine",
which encoded the missing information as success. Real mail always carries a
`Message-ID`; hand-written fixtures did not, and the harness enforces it
before the Worker sees the message.

## Fix
Fixtures carry a `Message-ID`; the smoke asserts `status === 200` and prints
the body on anything else. Same PR.

## Prevention
The product repo's `last-ride` skill already says it: *never let a test
assert an ambiguous value as the whole answer* and *prove a new test fails
before calling it a regression test*. For HQ tooling the rule is now in
`handbook/60-folder-and-compounding.md` §6 — every parser ships with fixtures
and a smoke that asserts the exact success status. Watch it fail once: remove
a `Message-ID` and the smoke must go red.

## See also
`hq/dispatch/README.md` "Dumb-problem fixtures".
