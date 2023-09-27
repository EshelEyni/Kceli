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
import { useCreateDay } from "../../hooks/useCreateDay";
import { Button } from "../../components/App/Button/Button";

const Homepage = () => {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const { createDay, isLoading: isLoadingCreateDay } = useCreateDay();
  const isTodayDetailsShown = loggedInUser && !isLoadingCreateDay;
  usePageLoaded({ title: "Home / Kceli" });

  function handleCreateDay() {
    const confirm = window.confirm("Are you sure you want to start a new day?");
    if (!confirm) return;
    createDay({});
  }

  return (
    <main className="home" data-testid="home-page">
      {!loggedInUser && <LoginSignupMsg />}

      {isTodayDetailsShown && (
        <TodayDataProvider>
          <TodayDetails />
        </TodayDataProvider>
      )}
      {isLoadingCreateDay && <SpinnerLoader />}
      <Button className="home__btn" onClickFn={handleCreateDay}>
        start a new day
      </Button>

      <Suspense fallback={<SpinnerLoader />}>
        <Outlet />
      </Suspense>
    </main>
  );
};

export default Homepage;

// Path: src/pages/MainPages/Home/Home.tsx
