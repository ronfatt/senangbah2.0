# SenangBah 2.0 Database Design

## Goals

The 2.0 database should:

- support multiple subjects without duplicating table families endlessly
- support free and paid access
- support modular content
- support attempt history and progress summaries
- support migration from the legacy SQLite model

## Design principles

1. Keep users and billing separate from learning content.
2. Model subjects and modules explicitly.
3. Store practice attempts in a reusable format.
4. Allow AI-generated feedback and structured summaries.
5. Preserve room for legacy data imports.

## Main domains

### Identity and access

- `users`
- `profiles`
- `plans`
- `subscriptions`
- `entitlements`

### Learning content

- `subjects`
- `modules`
- `lessons`
- `activities`
- `activity_items`

### Learning execution

- `attempts`
- `attempt_item_results`
- `feedback_events`
- `progress_snapshots`

### Commercial and migration support

- `payments`
- `legacy_user_mappings`
- `legacy_import_runs`

## Key table ideas

### users

Core auth identity.
Usually mirrors Supabase auth users.

### profiles

Student-facing profile data.

Examples:

- display name
- form
- target band
- class info
- onboarding state

### plans

Product plans offered by the platform.

Examples:

- free
- trial_full_access
- language_pack
- humanities_pack
- math_pack
- all_access

### subscriptions

Billing subscription records.

### entitlements

Feature and subject access grants.
This makes it easy to unlock English, BM, Sejarah, Geografi, Math, or Add Math separately if needed.
It also makes it easy to grant trial-based temporary access without special-case logic everywhere else.

### subjects

Top-level academic area.

Examples:

- english
- bahasa_melayu
- sejarah
- geografi
- math
- add_math

### modules

Learning products within a subject.

Examples:

- writing_coach
- grammar_lab
- reading_decoder
- vocab_builder

### lessons

Structured guided learning units.

### activities

A reusable unit of practice or assessment.

Examples:

- daily drill
- diagnostic
- comprehension set
- writing submission

### activity_items

Questions or prompts within an activity.

### attempts

One user’s run through an activity.

Tracks:

- status
- score
- stars
- timing
- ai summary

### attempt_item_results

Per-question or per-step result records.

### feedback_events

Structured feedback messages, especially useful for AI feedback history.

### progress_snapshots

Cached rollups for dashboard speed.

Examples:

- current streak
- total stars
- subject mastery
- weekly completion

## Legacy migration mapping

Old 1.0 tables can map like this:

- `users` -> `users` + `profiles`
- `sessions` -> `attempts`
- `responses` -> `attempt_item_results` or `feedback_events`
- `vocab_sessions` -> `attempts`
- `grammar_sessions` -> `attempts`
- `reading_sessions` -> `attempts`
- `essay_uploads` -> `attempts` plus storage objects
- `weekly_checkpoints` -> `progress_snapshots` or dedicated review records
- `teachers` -> later teacher domain tables

## Recommended implementation notes

- use UUID primary keys in 2.0
- use `jsonb` for flexible structured AI payloads
- use `timestamptz` everywhere for created/updated fields
- use explicit enums only where the domain is stable
- use storage buckets instead of local uploads
- model the 7-day trial as a plan plus time-bounded entitlements

## Suggested phases

### Phase 1

Ship the minimum tables needed for:

- auth
- profiles
- subjects
- modules
- activities
- attempts
- entitlements

Recommended initial seed data:

- subjects:
  - english
  - bahasa_melayu
  - sejarah
  - geografi
  - math
  - add_math
- plans:
  - free
  - trial_full_access
  - language_pack
  - humanities_pack
  - math_pack
  - all_access

### Phase 2

Add:

- subscriptions
- payments
- teacher relationships
- richer reporting snapshots

### Phase 3

Add:

- parent reporting
- referrals
- campaigns
- notifications
