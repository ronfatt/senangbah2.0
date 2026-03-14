# SenangBah 2.0 Pricing Strategy

## Core model

SenangBah 2.0 should use a guided free-to-paid structure:

1. every new user gets a 7-day full-access trial
2. after the trial ends, the user falls back to a free plan
3. paid access is unlocked through subject bundles

This model keeps the onboarding generous without forcing a hard drop-off after day 7.

## Why this model fits SenangBah 2.0

### 1. Students can feel the full product value quickly

The first 7 days should let them experience:

- English
- Bahasa Melayu
- Sejarah
- Geografi
- Math
- Add Math

This is especially important for a multi-subject platform because users need to see breadth before they decide what to pay for.

### 2. The free plan keeps users alive after trial expiry

Do not fully block the user after the trial.

Instead, the free plan should still allow:

- login and dashboard access
- progress visibility
- a small amount of daily practice
- limited English and BM starter tasks

This reduces churn and keeps a path open for later conversion.

### 3. Bundles are better than selling every subject separately

Bundles reduce decision friction and support a healthier average revenue per user.

## Suggested plans

### Free

For users after trial expiry.

Includes:

- dashboard
- streaks and progress snapshots
- limited daily starter practice
- selected English and BM basics

### 7-Day Full Trial

Applied automatically to every newly registered user.

Includes:

- all subject hubs
- all modules open
- premium practice access
- full product exploration

### Language Pack

Includes:

- English
- Bahasa Melayu

Suggested positioning:

- most popular plan
- strongest value for broad exam preparation

### Humanities Pack

Includes:

- Sejarah
- Geografi

### Math Pack

Includes:

- Math
- Add Math

### All Access

Includes:

- all current subjects
- all future subject bundles while active, if desired by business policy

## Trial design

The 7-day trial should be intentional, not passive.

Suggested experience:

1. Day 1: English mission
2. Day 2: Bahasa Melayu mission
3. Day 3: Sejarah mission
4. Day 4: Geografi mission
5. Day 5: Math mission
6. Day 6: Add Math mission
7. Day 7: progress recap + upgrade recommendation

## Upgrade strategy

Upgrade prompts should appear when:

- the user finishes a module in a locked bundle
- the user reviews their 7-day trial summary
- the user reaches a free-plan usage cap

## Recommended first pricing posture

The first release should prioritize simplicity:

- Free
- Language Pack
- Humanities Pack
- Math Pack
- All Access

Avoid selling every subject individually at launch.

## Data model implications

The pricing system should be implemented through:

- `plans`
- `subscriptions`
- `entitlements`

Each bundle plan grants subject entitlements rather than one-off page access.
