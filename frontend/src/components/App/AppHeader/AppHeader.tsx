import { getLocale } from "../../../i18n";
import { LanguageSelector } from "../LanguageSelector/LanguageSelector";
import { t } from "../../../i18n";
import { FC } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiGrid, FiCalendar, FiUser, FiActivity, FiFeather } from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";
import { useSystem } from "../../../hooks/useSystem";
import { BtnGoBack } from "../../Buttons/BtnGoBack/BtnGoBack";

export const AppHeader: FC = () => {
  const { loggedInUser } = useAuth();
  const { isAppHeaderBtnGoBtnShown } = useSystem();
  const { pathname } = useLocation();
  const profilePath = loggedInUser ? `/profile/${loggedInUser.id}` : "/login";
  const name = loggedInUser?.fullname || loggedInUser?.username || t("Your personal space");
  const initials = loggedInUser
    ? name
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0])
        .join("")
        .toUpperCase()
    : "K";
  const section = pathname.startsWith("/profile")
    ? "Profile"
    : pathname.startsWith("/workouts")
    ? "Workouts"
    : pathname.startsWith("/schedule") || pathname.startsWith("/day/")
    ? "Schedule"
    : pathname.startsWith("/login")
    ? "Log in"
    : pathname.startsWith("/signup")
    ? "Sign up"
    : "Home";

  return (
    <>
      <a className="ui-skip-link" href="#main-content">
        {" "}
        {t("Skip to content")}{" "}
      </a>
      <aside className="ui-sidebar">
        <Link className="ui-brand" to="/home" aria-label={t("Kceli home")}>
          <span>{t("k")}</span>
          {t("kceli")}
          <i>.</i>
        </Link>
        <p className="ui-tagline">{t("A little better, every day")}</p>
        <nav className="ui-navigation" aria-label={t("Main navigation")}>
          {[
            { to: "/home", label: "Home", Icon: FiGrid },
            { to: "/workouts", label: "Workouts", Icon: FiActivity },
            { to: "/schedule", label: "Schedule", Icon: FiCalendar },
            { to: profilePath, label: "Profile", Icon: FiUser },
          ].map(({ to, label, Icon }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `ui-nav-link${isActive && (label !== "Profile" || !!loggedInUser) ? " active" : ""}`
              }
            >
              <Icon aria-hidden="true" />
              <span>{t(label)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="ui-sidebar-note">
          <FiFeather aria-hidden="true" />
          <strong>{t("Progress has its own pace.")}</strong>
          <p>
            {" "}
            {t("Build habits that feel good.")} <br /> {t("The rest will follow.")}{" "}
          </p>
        </div>
        <Link to={profilePath} className="ui-account">
          <span className="ui-avatar">{initials}</span>
          <span>
            <strong>{name}</strong>
            <small>
              {loggedInUser ? t("Your personal space ↗") : t("Log in to get started ↗")}
            </small>
          </span>
        </Link>
      </aside>
      <header className="ui-topbar">
        <div className="ui-breadcrumb">
          {isAppHeaderBtnGoBtnShown && <BtnGoBack />}
          <span>{t("Your space")}</span>
          <span aria-hidden="true">/</span>
          <b>{t(section)}</b>
        </div>
        <div className="ui-topbar-account">
          <LanguageSelector />
          <time dateTime={new Date().toISOString()}>
            {new Date().toLocaleDateString(getLocale(), {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </time>
          <Link
            to={profilePath}
            className="ui-avatar"
            aria-label={loggedInUser ? t("Your profile") : t("Log in")}
          >
            {initials}
          </Link>
        </div>
      </header>
    </>
  );
};
