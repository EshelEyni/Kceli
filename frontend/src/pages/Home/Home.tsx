import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { usePageLoaded } from "../../hooks/usePageLoaded";
import "./Home.scss";
import { DayDetails } from "../../components/Day/DayDetails/DayDetails";
import { useSelector } from "react-redux";
import { RootState } from "../../types/app";
import { LoginSignupMsg } from "../../components/Msg/LoginSignupMsg/LoginSignupMsg";

const Homepage = () => {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  usePageLoaded({ title: "Home / Kceli" });

  return (
    <main className="home" data-testid="home-page">
      {!loggedInUser ? <LoginSignupMsg /> : <DayDetails />}
      <Suspense fallback={<SpinnerLoader />}>
        <Outlet />
      </Suspense>
    </main>
  );
};

export default Homepage;

// Path: src/pages/MainPages/Home/Home.tsx
