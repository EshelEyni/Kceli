import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { usePageLoaded } from "../../hooks/usePageLoaded";
import "./Home.scss";
import { TodayDetails } from "../../components/Day/TodayDetails/TodayDetails";
import { LoginSignupMsg } from "../../components/Msg/LoginSignupMsg/LoginSignupMsg";
import { TodayDataProvider } from "../../contexts/TodayDataContext";
import { useCreateDay } from "../../hooks/useCreateDay";
import { Button } from "../../components/App/Button/Button";
import { useGetTodayData } from "../../hooks/useGetTodayData";
import { DayData } from "../../../../shared/types/dayData";
import { useAuth } from "../../hooks/useAuth";

const Homepage = () => {
  const { loggedInUser } = useAuth();
  const { dailyData } = useGetTodayData();
  const { createDay, isLoading: isLoadingCreateDay } = useCreateDay();
  const isTodayDetailsShown = loggedInUser && !isLoadingCreateDay;
  const isCreateDayBtnShown = dailyData ? !_calcIsCurrDay(dailyData) : true;

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

      {isCreateDayBtnShown && (
        <Button className="home__btn" onClickFn={handleCreateDay}>
          start a new day
        </Button>
      )}

      <Suspense fallback={<SpinnerLoader />}>
        <Outlet />
      </Suspense>
    </main>
  );
};

export default Homepage;

function _calcIsCurrDay(dailyData: DayData) {
  const today = new Date().toDateString();
  const dailyDataDate = new Date(dailyData.date).toDateString();
  return today === dailyDataDate;
}

// Path: src/pages/MainPages/Home/Home.tsx
