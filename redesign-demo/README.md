# Kceli — redesign concept 01

Open `index.html` directly in a browser. No install, build, account, server, API key, external fonts, or network requests are needed. The four pages link to each other and share `styles.css` and `app.js`.

## Review the prototype

Exactly four HTML pages:

| File | Purpose | Try it |
| --- | --- | --- |
| `index.html` | Daily dashboard | Log a meal, add a saved meal, add water, open a workout, record hunger |
| `workouts.html` | Reusable workout library and weekly rhythm | Filter Strength/Cardio, create a routine, open a session, start/pause timer, check activities and finish |
| `schedule.html` | Calendar, selected-day agenda, period reports | Change months, select days, plan an activity, switch Day/Week/Month reports |
| `profile.html` | Personal details, measurement history, targets, goals | Edit name/height/birthdate, record a check-in, adjust calorie target, toggle preferences |

All figures describe a fictional user, Alex Morgan, on October 29, 2026. They are illustration data, not recommendations. The basic energy calculation is 2,600 kcal estimated TDEE minus a 500 kcal planned deficit = 2,100 kcal intake target. Meal entries sum to 1,480 kcal, leaving 620 kcal. Weight progress is 84.0 → 78.4 kg toward a user-chosen 75.0 kg goal: 5.6 of 9 kg, or approximately 62%.

Interactions are deliberately local and temporary: navigating or reloading resets changes. There is no backend connection, AI inference, authentication, account mutation, or persistence. Period reports are fixed example datasets, not dynamically calculated from every selected day. The weight graph is illustrative and does not redraw after check-ins. Goal dialogs capture a proposed target and show confirmation; they do not recalculate the static overview. New routines demonstrate creation but do not include a full exercise editor. The workout player is a simplified count-up timer and completion checklist, not the existing full rest/HIIT timer engine. Settings demonstrate preferences without playing any audio. These boundaries keep the deliverable a visual approval prototype.

## Existing application: architecture

The repository is a TypeScript application with three main areas:

- `frontend/`: React 18, Vite, Sass, React Router, React Query for remote state, Redux Toolkit for application/auth state, React Hook Form, Recharts, and context providers scoped to pages. Tests use Vitest and Testing Library. The workout scheduler uses react-beautiful-dnd. A worker supports workout timers.
- `backend/src/`: Express REST API with routers → controllers → services/models, MongoDB/Mongoose persistence, cookie authentication, auth guards, request validation/sanitization, rate limiting, and error handling. Production serves the compiled frontend. Tests cover routers, controllers, services and models.
- `shared/types/`: Contracts shared by frontend and backend for users, daily records, food/drink items, workout routines and exercise types.

API domains mounted in `backend/src/servers/main/app.ts`: `/api/auth`, `/api/user`, `/api/day`, `/api/calorie`, `/api/workout`, `/api/nutrition`, `/api/intake`, and `/api/goal`. The calorie/nutrition services use OpenAI in the existing app; this prototype does not call them. User fields include personal measurements, estimated TDEE, intake/deficit targets and a recurring weekly workout schedule. Daily records contain food/drink intakes, workout snapshots, optional weight/waist, hunger events and daily targets. Goals cover user/day/week/month/workout scopes.

## Existing routes and user flows

| Current route / feature | Flow and relationships | Proposed destination |
| --- | --- | --- |
| `/signup`, `/login` | Establish identity and personal energy baseline; protected routes require authentication | Keep as supporting authentication flows in the eventual implementation; outside these four demos |
| `/home` | Explicitly start a new day, then switch among logging, recorded/unrecorded intakes, saved meals, water, weight/waist, workouts, nutrition queries, daily goals and hunger tracking | Home dashboard; prominent meal logging; secondary tools in dialogs |
| `/workouts` | Create/manage routines, drag routines into recurring weekdays, display workout goals | Workouts library; compact weekly summary links to Schedule |
| `/workouts/edit/:id` | Edit aerobic activity, anaerobic sets/reps/weights/rest and supersets | Contextual routine editor, retaining advanced exercise types |
| `/workouts/details/:id` | Start session, copy workout into today's record, track started/completed exercises and timers | Focused workout session view, accessible from Home, Workouts and Schedule |
| `/schedule` | Select a month/day/week and inspect logs plus day/week/month reports; create or edit period goals | Unified Schedule with a selected-day agenda, report selector and goal card |
| `/day/:id` | Inspect a historical daily record | Selected-day details within Schedule; retain deep links in future implementation |
| `/profile/:id` | Edit personal data, chart weight/waist, show goals, recommended-weight range and projected timelines | Profile with measurement history, one personal milestone and clear target settings |

The important loop is: profile establishes targets → Home captures daily nutrition/measurements and workout completion → Schedule aggregates history → Profile shows longer-term change → goals and routine planning inform the next day. Preserve that loop instead of treating the pages as unrelated tools.

## What to preserve

Preserve the meal diary with editable quantities/calories, food/drink distinction, reusable favorite meals, hydration tracking, optional hunger check-ins and weight/waist measurements. Keep AI-assisted estimates reviewable and clearly presented as estimates. Preserve both aerobic and strength routines, split labels, sets/reps/load/rest, supersets, workout timers and completion history. Preserve recurring weekday planning, historical logs, day/week/month summaries, scoped goals, editable personal data, TDEE/target transparency and meaningful milestone recognition.

The prototype intentionally presents the most common examples; omission from the visual overview does not propose deleting the underlying capability. Food quantities/manual override, advanced routine editing, recurring-plan editing, full waist charts and nutrition queries need later detailed designs before implementation.

## Consolidation and removal recommendations

These are review recommendations only. No feature has been removed, and no usage analytics were available to establish that a feature is actually unused.

| Candidate | Recommendation | Reason / condition |
| --- | --- | --- |
| Explicit “start a new day” modal | Replace with automatic date rollover and an editable date on logging | Avoid blocking the primary daily action; preserve the ability to log/backfill dates |
| Many Home tabs | Consolidate into one diary, one log action, and contextual secondary dialogs | Keep the day's state visible while reducing navigation overhead |
| Recorded vs. unrecorded intake lists | Use logged/draft state within one diary | The distinction is useful; separate top-level destinations add complexity |
| Standalone historical day page | Consolidate presentation into Schedule's day panel | Preserve deep-link access and detailed records; remove duplicate UI only after parity |
| Scheduling inside Workouts and reporting inside Schedule | Make Schedule the owner of planning and history; retain a linked weekly summary in Workouts | One place to resolve “what did I do / what is next?”; keep recurring-template support |
| Separate workout edit/details routes | Consider an editor drawer and focused player reached from the library | Preserve route/deep-link semantics if needed; reduce repeated navigation chrome |
| Multiple recommended-weight and time-to-goal panels | Remove from the default Profile view; consolidate the user's chosen goal | Existing ProfileContext uses a fixed daily-loss assumption for timelines; avoid presenting deterministic arrival dates or several competing goals |
| Full-page calorie-dependent color changes | Replace with stable surfaces, labelled totals and restrained status accents | Better legibility, predictable contrast, and less judgmental feedback; never rely on color alone |
| Automatic fireworks/music | Replace with a small, dismissible milestone; make sound opt-in | Keeps recognition without interrupting the user; honor reduced motion in a later animated implementation |
| General nutrition query and spelling-suggestion UI | Move into meal logging/help and validate usage before investing further | Preserve assisted entry; evaluate whether a separate query tab and bespoke spellchecker earn their complexity |
| Hunger meter/timer | Keep optional and secondary; assess real usage before removal | Useful self-reflection for some users, distracting as a primary dashboard feature |
| Goal editors repeated across pages | Reuse one goal editor with an explicit scope | Preserve daily, workout and period goals without separate interaction patterns |

Before removing anything, collect usage evidence, confirm user needs, preserve historical data, and check feature parity and deep links. None of those future changes are part of this delivery.

## Visual and interaction direction

“A little better, every day”: a calm personal health journal rather than a dense control panel. Forest green (`#254e3c`) anchors navigation and key actions; lime (`#d6ee93`) gives progress a warm accent. Off-white (`#f6f7f3`), white cards and subtle borders keep dense data organized. Sage, sand and blue differentiate movement and hydration. Typography uses the local system sans-serif stack with a clear heading/number hierarchy; no remote font dependency.

Spacing follows a compact 4/8px rhythm with larger 22–24px card gaps and 18–22px corner radii. One prominent action per page sets a clear starting point. Small line icons and abstract workout artwork are inline SVG, making the demo self-contained. The same account, four navigation links, breadcrumbs, cards, badges, progress bars and dialogs recur throughout.

Desktop uses a persistent sidebar and two-column content. At 1150px, the content stacks; at 720px, navigation becomes a fixed bottom bar, routine cards become a single column, and cards/headers adapt. Dialogs remain keyboard accessible with native modal focus behavior, labelled fields and Escape dismissal. Buttons have visible focus styles; status messages use a live region; calendar controls expose date names and selected state. A full production accessibility audit remains a later step.

## Verification

- JavaScript syntax checked with `node --check redesign-demo/app.js`.
- Browser reviewed desktop Home, Workouts, Schedule and Profile layouts.
- Verified meal entry appends to the diary and changes 1,480 → 1,930 kcal, leaving 170 kcal.
- Verified Cardio filtering leaves one card, opens its session, starts the timer and completes the checklist.
- Verified October 31 calendar selection shows the planned outdoor run.
- Verified profile name editing updates the visible profile information.
- Checked all four pages at a 390px viewport for horizontal overflow; desktop and mobile navigation use the same four destinations.
- The existing application was not installed, executed, refactored or tested as part of the prototype. Existing lockfile changes present in the shared workspace were left untouched.
