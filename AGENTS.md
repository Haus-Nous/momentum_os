# AGENTS.md — Momentum_OS Architecture & Autonomous Operating Guidelines

## Codebase Map
- **Framework**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React, Framer Motion, Zustand.
- **Entry Points**:
  - `src/app/layout.tsx`: Root layout, fonts (`Gaegu`, `VT323`), metadata, providers.
  - `src/app/page.tsx`: Main dashboard router. Supports switching between Cozy Marker Desk OS (`momentumos-desk-v2`) and Classic V2.5 Sidebar OS.
- **Stores**:
  - `src/store/useMomentumStore.ts`: Primary application state (tasks, habits, projects, assignments, internships, hackathons, risks, XP, level, coins, focus timer, streaks, settings, Dexie offline + Supabase sync).
  - `src/store/useAuthStore.ts`: Authentication state, current user metadata (`name`, `role`, `email`, session token).
- **Database & Sync**:
  - `src/lib/db.ts`: Dexie.js IndexedDB schema and offline persistence.
  - `src/lib/supabaseClient.ts`: Supabase browser client.
- **Components Structure**:
  - `src/components/dashboard/desk/`:
    - `DeskStylesAndDefs.tsx`: SVG filters (`#rough`, `#rough2`), marker CSS rules, font family bindings.
    - `CatKeyboardIntro.tsx`: "Sparky the Cat on the Keyboard" interactive onboarding scene.
    - `DeskHomeBaseView.tsx`: Cozy marker 1200x800 scaling room with windowsill plants, corkboard notes, gauges, calendar, cat in bed, to-do pad, focus clock, knitting needles.
    - `DeskModuleRoom.tsx`: Module room sheet featuring Knitted Scarf strip (`scarfStrip()`) and `[⚡ Cozy Sheet | 🖥 Full Studio View]` bridge.
    - `DeskDialogs.tsx`: Interactive dialogs (Sparky AI chat, Risk plan/resolve, Plant status, Task modal, Search).
  - `src/components/dashboard/`: `NASAMissionControlView.tsx`, `PremiumDashboardView.tsx`, `SolarSystemHero.tsx`.
  - `src/components/tasks/`: `TasksView.tsx`, `TaskItem.tsx`.
  - `src/components/habits/`: `HabitsView.tsx`.
  - `src/components/calendar/`: `CalendarView.tsx`.
  - `src/components/focus/`: `FocusView.tsx`.
  - `src/components/notes/`: `NotesView.tsx`.
  - `src/components/analytics/`: `AnalyticsView.tsx`.
  - `src/components/academic/`: `SemesterDashboardView.tsx`.
  - `src/components/career/`: `CareerDashboardView.tsx`.
  - `src/components/goals/`: `GoalsView.tsx`.
  - `src/components/achievements/`: `AchievementCenterView.tsx`.
  - `src/components/settings/`: `SettingsView.tsx`.
- **Utilities**:
  - `src/utils/aiAssistantEngine.ts`: Natural language command parsing, AI companion prompt formatting.
  - `src/utils/personaHelpers.ts`: User name and initials derivation (`getInitials`, `getDisplayName`).
  - `src/utils/soundEngine.ts`: Audio cues for task completion and timer ticks.

## Verification Commands
1. Type check: `npx tsc --noEmit`
2. Lint check: `npx oxlint`
3. Hardcoded literals audit: `node --experimental-strip-types scratch/audit_hardcoded_literals.ts`
4. Build check: `npm run build`
