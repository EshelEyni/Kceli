import { usePageLoaded } from "../../hooks/usePageLoaded";
import { DayEdit } from "./DayEdit/DayEdit";
import { LoginSignupMsg } from "../../components/Msg/LoginSignupMsg/LoginSignupMsg";
import { DayEditProvider } from "./DayEdit/DayEditContext";
import { useAuth } from "../../hooks/useAuth";
import "./Home.scss";

const Homepage = () => {
  const { loggedInUser } = useAuth();
  usePageLoaded({ title: "Home / Kceli" });
  return (
    <main className="home" data-testid="home-page">
      {!loggedInUser && <LoginSignupMsg />}
      {loggedInUser && (
        <DayEditProvider>
          <DayEdit />
        </DayEditProvider>
      )}
    </main>
  );
};
export default Homepage;
