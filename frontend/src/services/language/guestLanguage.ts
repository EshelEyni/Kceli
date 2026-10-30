// A local hint for visitors before an account preference is available.
// Time zone is not a country lookup; no location permission or network call is needed.
export function getGuestLanguage(): "en" | "he" {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return ["Asia/Jerusalem", "Asia/Tel_Aviv", "Israel"].includes(timeZone) ? "he" : "en";
  } catch {
    return "en";
  }
}
