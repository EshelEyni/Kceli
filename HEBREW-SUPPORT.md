# Hebrew support

Branch: `codex/hebrew-support`, based on redesign commit `f953e0e`.

Integrated into `main` in `dev`, preserving the subsequent Home feature removals and removal of the weekly workout planner.

The language selector appears in the signed-in user's profile under Personal details. It sends a language-only patch to `user/loggedInUser`, stores `language: "en" | "he"` in the MongoDB user document, and applies the server's returned user after a successful save. The control is disabled while saving; failure retains the current language and shows an error.

This follows Roza's i18next/react-i18next setup, English/Hebrew dictionaries, and document `lang`/`dir` synchronization. Dictionaries are bundled rather than fetched so switching also works offline. Resources are in `frontend/public/locales/{en,he}/translation.json`; string keys are literal English text, with complete interpolated sentences for dynamic messages.

Hebrew uses RTL desktop and mobile layouts, Hebrew dates, translated labels and units, Unicode full-name validation, and English spellchecking only for Latin words. User-authored names and descriptions retain their original text. Stored enum values, units, form field IDs, drag/drop IDs and scheduling values remain unchanged. Login and session restoration apply the language from the authenticated user document. Existing accounts without a preference default to English, as do signed-out pages. Browser cookies, local storage, and query parameters do not override the account preference.

Validation from `frontend`:

```sh
npm run build
npm run test:redesign
```

The localization integration tests cover profile saving, session restoration, failed saves, stale browser preferences, workout filters without the retired weekly planner, canonical signup values, Hebrew validation, dictionary parity and interpolation variables. Backend tests (`node node_modules/jest/bin/jest.js --config jest.language.config.cjs --runInBand` from `backend`) cover the schema default, validation and filtered database update.

For an isolated preview using fictional data, run `npm run dev` and open `/test/redesign/index.html?page=/profile/review-user`, then choose Hebrew in the profile. The review API is separate from the production entry point and keeps its mock account only for the current browser session.
