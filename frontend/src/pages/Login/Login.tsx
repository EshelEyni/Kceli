import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import "./Login.scss";
import { AppDispatch } from "../../types/app";
import { Button } from "../../components/App/Button/Button";
import toast from "react-hot-toast";
import { usePageLoaded } from "../../hooks/usePageLoaded";

const LoginPage = () => {
  usePageLoaded({ title: "Login / Kceli" });
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [user, setUser] = useState({
    username: "demoUser",
    password: "eshel123",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  async function onLogin() {
    try {
      const { username, password } = user;
      await dispatch(login(username, password));
      navigate("/home");
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An unknown error occurred");
    }
  }

  return (
    <main className="page">
      <form className="login-form">
        <h1 className="login-form__title">login</h1>
        <div className="login-form__input-container">
          <label htmlFor="username" className="login-form__label">
            username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            onChange={handleChange}
            autoComplete="off"
            value={user.username}
            className="login-form__input"
          />
        </div>

        <div className="login-form__input-container">
          <label htmlFor="password" className="login-form__label">
            password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            onChange={handleChange}
            autoComplete="off"
            value={user.password}
            className="login-form__input"
          />
        </div>

        <Button onClickFn={onLogin}>login</Button>
      </form>
    </main>
  );
};

export default LoginPage;
