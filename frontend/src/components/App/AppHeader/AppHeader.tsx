import { FC } from "react";
import { Header } from "../Header/Header";
import { Nav } from "../Nav/Nav";
import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaRegCalendarAlt, FaUser } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";
import { useAuth } from "../../../hooks/useAuth";
import "./AppHeader.scss";
import { GoalIndicator } from "../../GoalIndicator/GoalIndicator";
import { useGetColorByCalories } from "../../../hooks/useGetColorByCalories";
import { useSystem } from "../../../hooks/useSystem";
import { BtnGoBack } from "../../Buttons/BtnGoBack/BtnGoBack";

export const AppHeader: FC = () => {
  const { loggedInUser } = useAuth();
  const { isAppHeaderBtnGoBtnShown } = useSystem();
  const { backgroundColor, color } = useGetColorByCalories();
  const location = useLocation();
  const isHomePage = location.pathname.includes("/home");

  return (
    <Header
      className="app-header"
      style={
        isHomePage ? { backgroundColor, color, borderBottom: `1px solid ${color}` } : undefined
      }
    >
      <div className="app-header__btn-container">
        {isAppHeaderBtnGoBtnShown ? <BtnGoBack /> : <GoalIndicator />}
      </div>
      <Nav className="app-nav">
        <NavLink to="/home" className="app-nav-link">
          <FaHome className="app-nav-link__icon" />
          <span>home</span>
        </NavLink>
        <NavLink to={"workouts"} className="app-nav-link">
          <GiWeightLiftingUp className="app-nav-link__icon" />
          <span>workouts</span>
        </NavLink>
        <NavLink to="/schedule" className="app-nav-link">
          <FaRegCalendarAlt className="app-nav-link__icon" />
          <span>schedule</span>
        </NavLink>
        <NavLink to={`/profile/${loggedInUser?.id}`} className="app-nav-link">
          <FaUser className="app-nav-link__icon" />
          <span>profile</span>
        </NavLink>
      </Nav>
    </Header>
  );
};
