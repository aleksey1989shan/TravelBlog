import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterPage.scss";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Состояния для контролируемых инпутов
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Состояния запроса
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      setIsLoading(false);

      await axios.post("/api/register", {
        email,
        password,
      });

      navigate("/profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Произошла ошибка при регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <main className="register-page__container">
        <div className="register-page__card auth-card">
          <h1 className="auth-card__title">Регистрация</h1>

          {error && (
            <div className="auth-card__error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="auth-card__form auth-form">
            <div className="auth-form__field auth-form__field--full">
              <label htmlFor="reg-email" className="auth-form__label">
                <span className="auth-form__required" aria-hidden="true">
                  *
                </span>{" "}
                Email
              </label>
              <input
                type="email"
                id="reg-email"
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

            <div className="auth-form__row">
              {/* Поле Пароль */}
              <div className="auth-form__field">
                <label htmlFor="reg-password" className="auth-form__label">
                  <span className="auth-form__required" aria-hidden="true">
                    *
                  </span>{" "}
                  Пароль
                </label>
                <input
                  type="password"
                  id="reg-password"
                  className="auth-form__input"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  aria-required="true"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="auth-form__field">
                <label htmlFor="reg-confirm-password" className="auth-form__label">
                  <span className="auth-form__required" aria-hidden="true">
                    *
                  </span>{" "}
                  Повторите пароль
                </label>
                <input
                  type="password"
                  id="reg-confirm-password"
                  className="auth-form__input"
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  aria-required="true"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="auth-form__actions">
              <button type="submit" className="auth-form__submit-btn" disabled={isLoading}>
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
