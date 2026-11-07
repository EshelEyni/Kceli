import React from "react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { UserEdit } from "./UserEdit";
import i18n from "../../i18n";
const state = vi.hoisted(() => ({ user: {} as any, updateUser: vi.fn(), setIsEditing: vi.fn() }));
vi.mock("./ProfileContext", () => ({ useProfile: () => state }));
beforeEach(() => { vi.clearAllMocks(); state.user = { id: "u", username: "demo", fullname: "Demo", birthdate: new Date("1990-01-01"), language: "en" }; });
afterEach(cleanup);
test("existing user starts OFF; tone is revealed only after explicit enable and saved with the profile", async () => {
 render(<UserEdit />);
 const toggle = screen.getByRole("switch", { name: "Daily tips and motivation" }) as HTMLInputElement;
 expect(toggle.checked).toBe(false); expect(screen.queryByLabelText("Preferred tone")).toBeNull();
 fireEvent.click(toggle); fireEvent.change(screen.getByLabelText("Preferred tone"), { target: { value: "warm" } });
 fireEvent.submit(toggle.closest("form")!);
 await waitFor(() => expect(state.updateUser).toHaveBeenCalled());
 expect(state.updateUser.mock.calls[0][0]).toMatchObject({ dailyMotivationEnabled: true, dailyMotivationTone: "warm" });
});
test("saved preference survives remount and can be switched off", async () => {
 state.user = { ...state.user, dailyMotivationEnabled: true, dailyMotivationTone: "neutral" };
 render(<UserEdit />);
 const toggle = screen.getByRole("switch") as HTMLInputElement;
 expect(toggle.checked).toBe(true); expect((screen.getByLabelText("Preferred tone") as HTMLSelectElement).value).toBe("neutral");
 fireEvent.click(toggle); fireEvent.submit(toggle.closest("form")!);
 await waitFor(() => expect(state.updateUser).toHaveBeenCalled());
 expect(state.updateUser.mock.calls[0][0].dailyMotivationEnabled).toBe(false);
});
test("Hebrew profile uses the requested toggle label", async () => {
 await i18n.changeLanguage("he"); render(<UserEdit />);
 expect(screen.getByRole("switch", { name: "טיפים ומוטיבציה יומית" })).toBeTruthy();
});
