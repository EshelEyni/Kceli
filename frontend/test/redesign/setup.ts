import { beforeEach } from "vitest";
import i18n from "../../src/i18n";

// Baseline UI assertions use English regardless of the test machine's time zone.
// Location-specific tests explicitly mount App with their own time-zone hint.
beforeEach(async () => {
  await i18n.changeLanguage("en");
});
