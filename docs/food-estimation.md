# Food estimation and quick logging

## Investigation (2026-11-04)

The original detailed editor called `POST /api/calorie/item`. The controller reused any user's latest matching food or called OpenAI SDK 3.3 with hard-coded `gpt-4`. The model returned free text parsed by `parseInt`: prose failed, and `1,200` could become 1. The nutrition-question screen used the same unavailable model.

A small request using this checkout's configured key returned HTTP 404, `model_not_found`, for `gpt-4`. This confirms that model is unavailable to this account; it does not establish a global API retirement. The configured key successfully accesses `gpt-4.1-mini` through Responses.

Saving a meal also invoked the intake subdocument's validation hook. It defaulted calories to zero, caught estimation failures, and still called `next()`. That allowed failed estimates to be saved as zero. The editor cleared before the save finished, and the production HTTP client swallowed failures. These are fixed, including query-update validation.

## Implementation

- Home shows one description field before the dashboard. Describe → Estimate calories → review/correct → Save meal. No portion selector or meal category is required. Detailed entry, favorites and photo scanning remain available.
- `POST /api/nutrition/estimate-food` requires authentication, is rate limited, disables caching, and returns `{ calories, assumptions }`. Input is bounded to 1–1000 characters. The existing item endpoint and nutrition questions use the same working transport/model.
- Responses uses strict structured output, `store: false`, bounded output and a 30-second provider timeout. Component calories are validated and summed in code. Refusals, incomplete output, non-food, invalid numbers, configuration/access errors and quota failures are handled explicitly. Axios errors containing credentials are never propagated.
- The client gives the request 35 seconds and aborts it when unmounted. Server disconnects cancel new meal-estimate requests. Failed estimates retain the description and offer manual entry; failed saves retain the corrected estimate. Success appears only after persistence succeeds.
- A quick meal uses the existing intake/item schema: its original description, quantity 1, unit `unit`, and reviewed total calories. No database migration or rewrite of historical data. Existing explicit zeroes remain zero; missing calories must estimate successfully. Foreign users' past entries are no longer treated as a nutrition database.
- Detailed entry rescales calories when quantity changes, invalidates estimates after a food/unit change, and ignores stale asynchronous results.
- Save responses update the current day's cache immediately, so consecutive additions preserve the previous meal. Retry attempts retain the meal id. The existing whole-day update API remains unchanged; concurrent edits from separate browser sessions still have its existing last-write-wins behavior.

## Configuration and limits

`OPENAI_API_KEY` stays backend-only. Optional `FOOD_ESTIMATE_MODEL` defaults to `gpt-4.1-mini` and must support Responses structured output. No new dependencies are needed. Restart the backend after changes. Workout-burn estimation remains a separate legacy SDK path; this change targets food logging and nutrition questions.

These are approximate food-composition estimates, not verified database matches. Portions, cooking and oil can materially affect the result; assumptions stay visible and users can correct calories. Seven live smoke cases passed: banana 105 kcal, two eggs plus oil 276, 100 g cooked rice 130, Hebrew water 0, Hebrew eggs plus bread 236, half a labeled 180-kcal bar 90, and non-food rejected with 422. This is a smoke check, not a comprehensive accuracy benchmark.

## UX research

[Cronometer voice logging](https://support.cronometer.com/hc/en-us/articles/47549391461780-Mobile-Voice-Logging) accepts typed descriptions, presents results for review, and then adds to the diary. [MyFitnessPal Meal Scan](https://support.myfitnesspal.com/hc/en-us/articles/360045761612-How-to-use-the-Meal-Scanner) lets people adjust portions before logging. Adopted the short capture/review/save pattern and existing home access, without adding voice recording, barcode tools or new databases.

[OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses) documents the strict schema format. Runtime validation is still necessary for incomplete responses, refusals and domain bounds; a schema alone does not establish nutritional accuracy.

## Verification

From `backend`: `npx jest --config jest.food-estimate.config.cjs --runInBand`.
From `frontend`: `npx vitest run --config vitest.food-estimate.config.ts` and `npm run test:redesign`.
Build shared types first (`frontend/node_modules/.bin/tsc -b shared` from the root), then run `npm run build` in backend and frontend.

Regression coverage includes provider failures and invalid responses, authentication, legacy food paths, zero calories, historical values, prevention of database writes after estimation failure, estimate correction, stale responses, duplicate clicks, retry ids, production HTTP failures and retaining failed saves. The isolated development preview was checked at 390 px and desktop widths with fictional records, including Hebrew RTL and consecutive saves. No account food records were written during verification.

## User history before AI

The primary estimate endpoint first checks the authenticated user's recorded meals from the last 90 days. A compound user/date index, field projection, a 100-day-document cap, and a 1.5-second database execution limit bound the lookup. More than 100 day documents or a lookup failure falls back to AI. Only quantity 1 / unit entries with the complete matching description qualify; grams, cups, different quantities, drafts, missing/future/old recording dates, invalid calories, and conflicting estimates do not qualify. No cross-user lookup or fuzzy ingredient matching is used.

Matching normalizes Unicode, case, whitespace, Hebrew vowel marks, directional marks, typographic quotes and terminal sentence punctuation. Numbers, portions and ingredient words stay significant. A single valid saved entry can qualify; without provenance in the legacy schema this is a conservative reuse policy, not nutritional verification. Users still review and can correct calories before saving. Existing saving persists the full description and reviewed calories, making both AI results and corrections available to later requests. Unsaved estimates are not cached. No historical data is rewritten.

Save-time validation uses the same history matcher whenever calories are missing. It matches the authenticated user, normalized name, exact unit and exact quantity; it does not rescale different portions. Explicit calories (including zero) bypass both lookup and AI. Missing authenticated context skips history rather than searching globally. A reliable match supplies the calories; otherwise the existing AI fallback runs, and its failure still blocks persistence.
