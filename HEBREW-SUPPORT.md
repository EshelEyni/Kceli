# Hebrew support

Branch: `codex/hebrew-support`, based on redesign commit `f953e0e`.

Integrated into `main` in `dev`, preserving the subsequent Home feature removals and removal of the weekly workout planner.

The header language selector switches between English and Hebrew without reloading or clearing form drafts. The preference is stored in a cookie and local storage. `?lng=he` or `?lng=en` overrides the saved preference; the browser language is used on a first visit, with English as fallback.

This follows Roza's i18next/react-i18next setup, English/Hebrew dictionaries, and document `lang`/`dir` synchronization. Dictionaries are bundled rather than fetched so switching also works offline. Resources are in `frontend/public/locales/{en,he}/translation.json`; string keys are literal English text, with complete interpolated sentences for dynamic messages.

Hebrew uses RTL desktop and mobile layouts, Hebrew dates, translated labels and units, Unicode full-name validation, and English spellchecking only for Latin words. User-authored names and descriptions retain their original text. Stored enum values, units, form field IDs, drag/drop IDs and scheduling values remain unchanged. Language preference is local to the browser, without a backend schema change.

Validation from `frontend`:

```sh
npm run build
npm run test:redesign
```

The localization integration tests cover switching in a live page while preserving a Hebrew meal draft, persisted preference and direction, workout filters without the retired weekly planner, canonical signup values, Hebrew validation, dictionary parity and interpolation variables.

For an isolated preview using fictional data, run `npm run dev` and open `/test/redesign/index.html?lng=he`. Append `&page=/workouts`, `&page=/schedule`, or `&page=/profile/review-user` to inspect other pages. The review API is separate from the production entry point.
