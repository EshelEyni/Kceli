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
