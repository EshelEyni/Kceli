import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import "./Login.scss";
import { AppDispatch } from "../../types/app";
import { Button } from "../../components/App/Button/Button";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [error, setError] = useState<string>("");

  const [user, setUser] = useState({
    username: "eshel2",
    password: "eshel123",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onLogin = async () => {
    try {
      const { username, password } = user;
      await dispatch(login(username, password));
      navigate("/home");
    } catch (err) {
      setError((err as any).stack);
    }
  };

  return (
    <section className="login-page">
      {error && <div className="login-page__error-msg">{error}</div>}
      <div>
        <h1>login</h1>
        <div>username</div>
        <input
          type="text"
          name="username"
          onChange={handleChange}
          autoComplete="off"
          value={user.username}
        />
        <div>password</div>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          autoComplete="off"
          value={user.password}
        />
      </div>

      <Button onClickFn={onLogin}>login</Button>
    </section>
  );
};

export default LoginPage;
