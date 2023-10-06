import { FC } from "react";
import { Header } from "../Header/Header";
import { Nav } from "../Nav/Nav";
import { NavLink } from "react-router-dom";
import { FaHome, FaRegCalendarAlt, FaUser } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";
import { useAuth } from "../../../hooks/useAuth";
import "./AppHeader.scss";
import { GoalIndicator } from "../../GoalIndicator/GoalIndicator";

export const AppHeader: FC = () => {
  const { loggedInUser } = useAuth();

  return (
    <Header className="app-header">
      <GoalIndicator />
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
