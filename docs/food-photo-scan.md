# Food photo scanning

The meal form's **Scan food** button opens a full-screen camera and review dialog.
It prefers the rear camera, with native photo selection as a fallback. Camera
capture requires HTTPS on iPhone (localhost is only useful on the same device).

The user previews the photo, optionally supplies portion details, and requests
analysis. Results contain editable names, weights in grams, and estimated kcal.
Changing a weight in the review scales its calories. **Use these items** appends
the confirmed foods to the current meal; **Save Intake** persists the meal as usual.

## Backend configuration

- `OPENAI_API_KEY`: backend-only API key, as in Roza.
- `FOOD_SCAN_MODEL`: optional image/structured-output capable model;
  defaults to `gpt-4.1-mini`.
- `OPEN_AI_ORGANIZATION` is no longer read or sent by Kceli. It may be removed
  from deployment environment settings.

`POST /api/nutrition/scan-food` requires the existing authenticated session.
It accepts a JPEG data URL (up to 2 MB decoded) and optional context (500 chars).
It is limited to 20 scans per IP per 15 minutes and uses a 45-second provider
timeout. No meal is persisted by this endpoint.

## Photo handling

Camera capture uses a canvas in memory; uploaded photos are also re-encoded as
JPEG, resized to a maximum edge of 1280px, and stripped of metadata. Neither
capture nor analysis writes to local storage, IndexedDB, disk, or the database.
Object URLs are revoked. Camera tracks stop after capture, on backgrounding,
and when the dialog closes. Closing or unmounting cancels pending analysis and
ignores late results. The preview is cleared on analysis completion or failure.
Failed scans require a new capture or selection.

Requests use a dedicated fetch helper (no payload/error logging), `no-store`,
and a NetworkOnly PWA rule, with no offline retry queue. The backend sanitizes
provider/parser errors so they cannot expose photos or API credentials. It sends
inline images to the Responses API with `store: false`, without creating Files.
OpenAI's separate provider retention policy still applies; `store: false` does
not itself enable Zero Data Retention.

## Verification

Backend: `npx jest --config jest.food-scan.config.cjs --runInBand`

Frontend: `npx vitest run --config vitest.food-scan.config.ts`

Run both application builds. Before release, test the installed PWA on an actual
iPhone over HTTPS: rear camera and orientation, permission denial, gallery/HEIC
decoding (unsupported images produce a retake message), background/foreground,
retake, offline analysis, cancellation, review edits, and meal save. Check API
availability with the deployment key. Automated tests mock OpenAI and camera
hardware; they cannot establish nutrition accuracy or real-device behavior.
