import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { usePageLoaded } from "../../hooks/usePageLoaded";
import { DayEdit } from "./DayEdit/DayEdit";
import { LoginSignupMsg } from "../../components/Msg/LoginSignupMsg/LoginSignupMsg";
import { DayEditProvider } from "./DayEdit/DayEditContext";
import { useCreateDay } from "../../hooks/useCreateDay";
import { useGetTodayData } from "../../hooks/useGetTodayData";
import { DayData } from "../../../../shared/types/dayData";
import { useAuth } from "../../hooks/useAuth";
import { Modal } from "../../components/Modal/Modal";
import "./Home.scss";

const Homepage = () => {
  const { loggedInUser } = useAuth();
  const { dailyData } = useGetTodayData();
  const { createDay, isLoading: isLoadingCreateDay } = useCreateDay();
  const isTodayDetailsShown = loggedInUser && !isLoadingCreateDay;
  const isCreateDayBtnShown = loggedInUser && dailyData && !_calcIsCurrDay(dailyData);

  usePageLoaded({ title: "Home / Kceli" });

  function handleCreateDay() {
    const newDateStr = new Date().toDateString();
    createDay({ date: newDateStr });
  }

  return (
    <main className="home" data-testid="home-page">
      {!loggedInUser && <LoginSignupMsg />}

      {isTodayDetailsShown && (
        <DayEditProvider>
          <DayEdit />
        </DayEditProvider>
      )}

      {isLoadingCreateDay && <SpinnerLoader />}

      {isCreateDayBtnShown && (
        <Modal>
          <Modal.OpenBtn modalName="create-day">
            <button className="home__btn" data-testid="create-day-open-modal-btn">
              start a new day
            </button>
          </Modal.OpenBtn>

          <Modal.Window name="create-day" className="create-day-modal">
            <h2 className="create-day-modal__title">
              Are you sure you want to start a new day? <br />
            </h2>

            <Modal.CloseBtn onClickFn={handleCreateDay}>
              <button className="btn create-day-modal__btn" data-testid="create-day-modal-btn">
                start a new day
              </button>
            </Modal.CloseBtn>

            <Modal.CloseBtn>
              <button className="btn create-day-modal__btn">cancel</button>
            </Modal.CloseBtn>
          </Modal.Window>
        </Modal>
      )}
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
