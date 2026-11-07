import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "../../src/App";
import { store } from "../../src/store/store";
import { setLoggedInUser } from "../../src/store/slices/authSlice";
import { installReviewApi } from "./mockApi";

// Explicit development review entry; not imported by the production application.
const { fixtures } = installReviewApi();
// Keep the native-fetch motivation path isolated from real accounts and AI too.
const originalFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input instanceof Request ? input.url : input.toString();
  if (url.includes("/api/user/daily-motivation")) {
    const now = new Date();
    const localDate = [now.getFullYear(), String(now.getMonth()+1).padStart(2,"0"), String(now.getDate()).padStart(2,"0")].join("-");
    const enabled = fixtures.user.dailyMotivationEnabled === true;
    const text = fixtures.user.language === "he"
      ? "גם ביום עמוס אפשר לפנות רגע לעצמך. בחירה קטנה ומיטיבה היא צעד של התמדה."
      : "Make a little room for yourself today. One small, thoughtful choice can build a steady habit.";
    return new Response(JSON.stringify({ status: "success", data: { localDate, status: enabled ? "ready" : "disabled", text: enabled ? text : null } }), { headers: { "Content-Type": "application/json" } });
  }
  return originalFetch(input, init);
};
store.dispatch(setLoggedInUser(fixtures.user));
const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const requestedPage = new URLSearchParams(location.search).get("page") || "/home";
const page = ["/home", "/workouts", "/schedule", "/profile/review-user"].includes(requestedPage)
  ? requestedPage
  : "/home";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[page]}>
        <App />
        <Toaster />
      </MemoryRouter>
    </QueryClientProvider>
  </Provider>
);
