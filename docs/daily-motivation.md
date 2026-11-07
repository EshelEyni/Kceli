# Optional daily motivation

Profile > Edit personal details contains **Daily tips and motivation** (Hebrew: טיפים ומוטיבציה יומית). It defaults to OFF, including for accounts whose records predate the setting. Saving the profile persists the boolean and optional tone override through the existing authenticated profile update. With OFF, the home sentence and greeting are unchanged and the browser makes no motivation request.

When ON, the existing subtitle is replaced with a short message. The browser submits its IANA timezone; the server computes the calendar date using the same date helper as daily journals. The authenticated user's database preference is checked on every request. The client does not supply a user ID, language, gender or effective opt-in.

## Generation and cost control

POST /api/user/daily-motivation uses the existing OpenAI Responses transport/model, store:false, a 200-token output cap and the existing provider timeout. Only selected gender, effective tone and recent messages are supplied, not food records, weight, names, email or other personal details. Automatic tone is warm for female, direct for male, and neutral when unspecified; explicit warm/direct/neutral overrides that default. Grammatical gender still follows the selected gender. Prompts require respectful, sustainable habits, fluent preferred language, and no extreme diets, shame, medical advice or weight-loss promises.

A new daily_motivation collection stores userId, localDate, timeZone, language, status, attemptedAt and generated text. An additive unique (userId, localDate) index is explicitly ensured before reservations, including where automatic indexing is disabled. A pending record is inserted BEFORE the paid request. Duplicate-key contenders only read the record and never call AI. This coordinates tabs/devices and separate server processes. The initiating request continues caching even if its browser closes.

One attempt per user/date is deliberate: provider failure, malformed or repetitive output, a worker crash, or a failed final database write does not cause another paid request that day. Pending readers poll briefly; after sixty seconds an unfinished reservation produces the static fallback. A new calendar day allows a fresh attempt. Cached results persist across refreshes and sessions. Changes to language or tone take effect with the next generated message; a cached message in another language is hidden. Disabling hides output immediately on that device and the server rechecks opt-in before generation and before returning new text. Other sessions observe the saved preference on reload; already-enabled sessions also recheck through the endpoint on focus/reconnect.

The last fourteen successful messages are supplied to the prompt. Exact and near-duplicate outputs are rejected without regeneration. This helps variety but is not a semantic guarantee. Generated text is rendered as plain React text. Failure or unavailable network/database preserves the original static sentence without an error banner or new home-page controls. No paid provider calls or real account writes are made during automated verification.

## Checks

- Backend: npx jest --config jest.daily-motivation.config.cjs --runInBand
- Frontend: npx vitest run --config vitest.daily-motivation.config.ts
- Builds: npm run build in frontend (shared types first), then backend.

Concurrency/database behavior is exercised with an atomic in-memory reservation mock and schema-index assertions; these tests do not replace a live MongoDB deployment smoke test.
