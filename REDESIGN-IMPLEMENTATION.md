# Modern Kceli — first implementation pass

Branch: `codex/modern-responsive-ui`.

The approved prototype remains in `redesign-demo/`. The actual React application now uses its forest-green, lime and neutral visual direction, with live values from the existing hooks and API services. This is the first implementation pass; detailed legacy editors retain their original behavior and some of their internal layouts.

## Implemented

- Shared desktop sidebar, top bar, clear active navigation and account identity. At 720px and below, navigation becomes a fixed bottom bar with safe-area padding. Route changes reset scroll position; query changes within the journal retain context.
- Responsive page headings, metric cards, buttons, cards, fields, status badges, workout artwork, spacing and typography. Focus indicators, a skip link and reduced-motion rules are included.
- **Home:** real calorie consumption/target/remaining values, current measurement, today's completed sessions, routines from the recurring plan, recorded water, and an API-backed 250ml water action. Existing meal entry, drafts, favorites, water options, measurements, nutrition queries, hunger tracking and goals remain in the daily journal. Detailed calorie/weight insights remain in a disclosure.
- **Workouts:** real library counts, strength/cardio filters, cards with existing edit/delete/session actions, and the recurring weekly plan. Drag-and-drop remains available. The new labelled weekday selector and remove buttons let mobile/keyboard users plan without dragging. Updates use the existing user endpoint and synchronize React Query and Redux after success.
- **Schedule:** accessible date buttons, selected/logged/completed-workout indicators, a recurring-plan sidebar, and the existing daily/weekly/monthly reports and goal controls. Moving months clears stale selection and uses the first day to avoid skipping February from a 31st-day date.
- **Profile:** real account summary, starting/current measurements, weight/waist charts, existing profile editing, targets, personal goals and milestone indicator. Additional recommended-weight and goal-time panels remain accessible in a disclosure; no feature or historical data was deleted.
- Daily saves now invalidate measurement-history and calendar queries separately so other pages see updated data. Save failures display feedback and do not replace the saved weekly plan. If the latest record is an older day, the dashboard labels its date and disables the new quick-add controls until a new day is started.

## Run and review

Use the existing application setup for normal backend-connected operation:

```powershell
cd frontend
npm run dev
```

The backend still runs separately on port 3030 and requires its existing configuration/database. This implementation does not change the backend or deploy anything.

For an isolated visual review with fictional data, start the same Vite server and open:

`http://localhost:5173/test/redesign/index.html`

Use the actual port printed by Vite. This entry renders the real App and page providers with a test-only Axios adapter that rejects unmatched requests. It uses a memory router; navigation stays inside the review, and refresh resets data. It cannot send changes to a real account. It is not imported by the production entry or included in the production build.

## Checks

```powershell
cd frontend
npm run build
npm run test:redesign
```

The production build first regenerates shared TypeScript declarations. The checked-in user declaration was stale and missing `targetCaloricDeficitPerDay`; it now matches the source contract.

The previously missing, ignored `src/config.ts` dependency for Cloudinary has been replaced with tracked `src/runtimeConfig.ts`, reading public Vite environment values `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`. No secrets or local configuration were copied into the repository. Supply these public values when using uploads; never use a Cloudinary API secret in frontend environment variables.

The focused integration suite uses actual page providers and services with mocked HTTP transport. It covers hydration payloads and cache invalidation, older-day quick-add guards, non-drag scheduling/removal/deduplication, failed schedule saves, profile/account synchronization, accessible month selection and signed-out navigation. The redesign command also runs the existing Button, daily-filter and water-editor suites: 22 tests across four files pass.

The repository's existing default `vitest.config.ts` points only at `ScheduleContext.test.tsx`, which is empty. Consequently the default test command fails with “No test suite found”; it has not been presented as a passing full regression suite. The dedicated redesign command avoids changing the existing test configuration.

Browser checks use the isolated review entry. All four main pages were checked at 320px, 390px, 768px and 1440px without page-level horizontal overflow. Report tables scroll within their own region. The meal editor, profile editor, workout editor and active workout session were also checked at 390px. A real database, third-party nutrition services, uploads and full backend end-to-end flows have not been tested in this pass.

## Follow-up scope

Continue migrating advanced meal/routine editors and detailed reports into dedicated modern components, reducing the transitional rules in `styles/redesign.scss`. Validate real backend flows and a full accessibility pass before release. Feature removals and the prototype's proposed consolidation remain separate decisions; this branch preserves their existing entry points. Existing local lockfile changes were left untouched.
