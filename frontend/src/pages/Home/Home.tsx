import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { usePageLoaded } from "../../hooks/usePageLoaded";
import "./Home.scss";
import { TodayDetails } from "../../components/Day/TodayDetails/TodayDetails";
import { useSelector } from "react-redux";
import { RootState } from "../../types/app";
import { LoginSignupMsg } from "../../components/Msg/LoginSignupMsg/LoginSignupMsg";
import { TodayDataProvider } from "../../contexts/TodayDataContext";

const Homepage = () => {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  usePageLoaded({ title: "Home / Kceli" });

  return (
    <main className="home" data-testid="home-page">
      {!loggedInUser ? (
        <LoginSignupMsg />
      ) : (
        <TodayDataProvider>
          <TodayDetails />
        </TodayDataProvider>
      )}
      <Suspense fallback={<SpinnerLoader />}>
        <Outlet />
      </Suspense>
    </main>
  );
};

export default Homepage;

// Path: src/pages/MainPages/Home/Home.tsx
