import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { usePageLoaded } from "../../hooks/usePageLoaded";
import "./Home.scss";

const Homepage = () => {
  usePageLoaded({ title: "Home / Chirper" });

  return (
    <main className="home" data-testid="home-page">
      <div className="title-container">
        <h1>Home</h1>
      </div>

      <Suspense fallback={<SpinnerLoader />}>
        <Outlet />
      </Suspense>
    </main>
  );
};

export default Homepage;

// Path: src/pages/MainPages/Home/Home.tsx
