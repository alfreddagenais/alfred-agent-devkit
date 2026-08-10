---
name: test-quality
version: 0.1.0
description: >-
  Analyzes test coverage, identifies gaps in core features, adds or updates
  tests when necessary, and validates that all tests pass. Use when validating
  tests, assessing coverage, or ensuring core functionality remains well-tested.
---

# Test Quality & Analysis

**Core and important features must have tests.** Add tests incrementally with new code. When tests fail, fix the code. Never disable or skip tests.

**Principles:** KISS, lean coverage, domain-aligned behavior.

## Phase 1: Baseline

1. Run the project’s lint/static/test baseline commands from `CLAUDE.md` / docs.
2. All must pass (or failures classified as pre-existing) before gap analysis.

## Phase 2: Domain list

Identify **core domains** from `.cursor/PROJECT_CONTEXT.md` and `CLAUDE.md` (auth, billing, tenancy, critical user journeys, etc.). If undocumented, infer from the change set and propose a domain list for the user.

## Phase 3: Gap analysis

For each core domain touched by the change: Feature/Unit coverage present? Meaningful assertions? Missing paths for new behavior?

## Phase 4: Add or update only when necessary

- New feature → add tests for new behavior
- Changed behavior → update tests
- Refactor only → existing tests should still pass
- Keep tests lean; prefer meaningful assertions over high counts

## Phase 5: Fix failures

Never skip. Re-run until green.
