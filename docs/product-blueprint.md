# SenangBah 2.0 Product Blueprint

## Vision

SenangBah 2.0 should feel like a serious student growth platform, not just a set of drills.
The product should help students improve daily, show visible progress, and turn premium subject access into a natural upgrade path.

## Product goals

1. Rebuild the platform on infrastructure that fits long-term growth.
2. Upgrade the experience so it feels more premium, more motivating, and more trustworthy.
3. Keep English and Bahasa Melayu as the strongest language pillars while expanding into core exam subjects.
4. Introduce clear paid access layers without making the free experience feel broken.
5. Migrate legacy users and preserve enough history that the move feels like an upgrade, not a reset.

## Core audiences

### Students

Primary user group.

What they want:

- quick daily practice
- clearer feedback
- visible progress
- better exam confidence
- premium tools that feel worth paying for

### Parents

Secondary buyer/influencer.

What they want:

- confidence that the platform is useful
- proof of progress
- clean pricing
- subject coverage

### Teachers

Optional near-term audience, stronger in later phases.

What they want:

- student progress visibility
- less manual checking
- useful summaries

## Product pillars

### 1. Daily momentum

Students should always know what to do next.

Examples:

- today’s tasks
- streaks
- progress cards
- weak-skill focus

### 2. Skill clarity

Students need to understand why an answer is wrong and what skill it trains.

Examples:

- skill tags
- tactic tips
- focused feedback
- retry and review loops

### 3. Multi-subject expansion

The platform starts strong with language mastery, then expands into core exam subjects.

Suggested order:

1. English
2. Bahasa Melayu
3. Sejarah
4. Geografi
5. Math
6. Add Math

### 4. Premium conversion

The free plan should create trust.
The paid plan should unlock meaningful capability.

Premium should feel like:

- deeper practice
- more feedback
- more subjects
- stronger reporting

Trial should feel like:

- immediate value
- full product visibility
- guided exploration across subjects

### 5. Reward identity

Students should feel that learning changes something they own.

Examples:

- star points
- avatar closet
- unlockable badges
- outfit collections
- subject-themed cosmetics

## Information architecture

### Public site

- Home
- Features
- Subjects
- Pricing
- Results / testimonials
- Parent / teacher trust page
- Login / register

### Authenticated student app

- Dashboard
- Avatar Closet
- Subjects
- Practice history
- Progress
- Billing
- Settings

### Subject hubs

Each subject should have:

- overview
- modules
- recommended next task
- progress snapshot
- locked premium modules where relevant

## Subject strategy

### English

Launch first with:

- Writing Coach
- Grammar Lab
- Reading Decoder
- Vocabulary Builder

### Bahasa Melayu

Initial module ideas:

- Tatabahasa practice
- Pemahaman reading drills
- Karangan coaching

### Sejarah

Initial premium module ideas:

- fact recall drills
- structured timeline review
- source-based question practice

### Geografi

Initial premium module ideas:

- concept review
- map and data interpretation
- structured short-answer drills

### Math

Initial premium module ideas:

- topic-based practice
- worked-solution review
- mistake pattern tracking

### Add Math

Initial premium module ideas:

- algebra and function drills
- step-by-step working checks
- higher-difficulty revision sets

## Membership model

### Free

- account creation
- diagnostic / onboarding
- basic progress dashboard
- limited daily starter practice
- selected English and BM basics

### 7-Day Full Trial

- unlocked automatically on registration
- all subject hubs open
- all premium areas visible
- guided 7-day onboarding across subjects

### Language Pack

- full English access
- full Bahasa Melayu access
- richer AI feedback
- stronger language progress tracking

### Humanities Pack

- Sejarah access
- Geografi access

### Math Pack

- Math access
- Add Math access

### All Access

- all subjects
- all current premium bundles
- strongest reporting and access path

## Key screens

### 1. Landing page

Purpose:

- explain value clearly
- show proof
- drive signup and upgrades

### 2. Student dashboard

Purpose:

- show today’s mission
- show streak and stars
- surface weak skills
- surface subject progress

### 3. Subject hub

Purpose:

- orient the student
- group modules clearly
- show free vs premium access

### 4. Practice player

Purpose:

- remove clutter
- keep the task focused
- deliver fast feedback

### 5. Progress center

Purpose:

- show growth over time
- identify weak areas
- make subscription value visible

### 6. Billing / upgrade

Purpose:

- keep pricing simple
- explain what unlocks
- convert at logical product moments

## Monetization principles

1. Every new user gets a 7-day full-access trial.
2. Trial expiry should downgrade users to Free, not hard-lock the account.
3. Primary monetization should use bundle plans, not per-subject micro-subscriptions.
4. Upgrade prompts should follow learning progress, not interrupt it randomly.

## Design direction

SenangBah 2.0 should feel:

- focused
- premium
- modern
- optimistic
- mobile-first

Visual goals:

- stronger typography
- more intentional spacing
- cleaner card hierarchy
- richer but disciplined color system
- meaningful motion, not noisy animation

## Gamification

Use in moderation.

Recommended:

- stars
- streaks
- weekly goals
- subject completion badges
- progress cards students can share

Avoid:

- noisy reward spam
- childish game mechanics that reduce trust

## Migration principles for old users

When legacy users move into 2.0:

- preserve account identity
- preserve enough history to avoid a “full reset” feeling
- map old module activity into new progress summaries
- welcome them with an upgrade message and onboarding refresh

## MVP scope

The first launch of 2.0 should include:

- auth
- dashboard
- English subject hub
- Bahasa Melayu subject hub
- Writing, Grammar, Reading, Vocabulary modules
- billing foundation
- premium gating foundation
- Supabase-backed data model
- 7-day trial logic
- bundle-based pricing structure

Not required for MVP:

- full teacher suite
- full parent suite
- all subjects fully built
- advanced admin analytics

## Build order

1. Product architecture and data model
2. Auth and user profile
3. Dashboard and navigation
4. English subject hub
5. Practice engine
6. Progress center
7. Billing and entitlements
8. Sejarah / Geografi / Math / Add Math premium expansion
