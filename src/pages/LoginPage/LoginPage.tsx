import React, { useState } from "react";
import "./LoginPage.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isLoading, setIsloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setIsloading(true);

    try {
      const response = await axios.post("/api/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);

      await checkAuth();
      navigate("/profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Неверный email или пароль");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-page__container">
        <div className="login-page__card auth-card">
          <h1 className="auth-card__title">Вход</h1>

          {error && (
            <div className="auth-card__error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-card__form auth-form">
            {/* Поле Email */}
            <div className="auth-form__field auth-form__field--full">
              <label htmlFor="login-email" className="auth-form__label">
                <span className="auth-form__required" aria-hidden="true">
                  *
                </span>{" "}
                Email
              </label>
              <input
                type="email"
                id="login-email"
                className="auth-form__input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-required="true"
                disabled={isLoading}
                required
              />
            </div>

            {/* Поле Пароль */}
            <div className="auth-form__field auth-form__field--full">
              <label htmlFor="login-password" className="auth-form__label">
                <span className="auth-form__required" aria-hidden="true">
                  *
                </span>{" "}
                Пароль
              </label>
              <input
                type="password"
                id="login-password"
                className="auth-form__input"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                aria-required="true"
                disabled={isLoading}
                required
              />
            </div>

            {/* Кнопка отправки и ссылка на регистрацию */}
            <div className="auth-form__actions">
              <button type="submit" className="auth-form__submit-btn" disabled={isLoading}>
                {isLoading ? "Вход..." : "Войти"}
              </button>

              <Link to="/register" className="auth-form__link">
                Ещё не зарегистрированы?
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
