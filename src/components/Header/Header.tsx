import React, { useEffect, useRef, useState } from "react";
import "./Header.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Icons/Logo";
import { useAuth } from "../../context/AuthContext";
import newUser from "../../assets/new-user.png";
import Arrow from "../Icons/Arrow";

const Header: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  // console.log(user);

  // замена текста в h1 в зависимости от страниц
  const getTitle = (path: string): string => {
    if (path === "/") {
      return "Там, где мир начинается с путешествий";
    }
    if (path === "/game") {
      return "время чтобы отдохнуть";
    } else {
      return "Истории ваших путешествий";
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      //когда я создаю  menuRef  React создаёт обычный объект { current: null } это единственное встроенное свойство этого объекта, где хранится ссылка на сам тег.
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const hendleLogout = () => {
    localStorage.removeItem("token");
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="hero">
      <div className="hero__container">
        <div className="hero__navbar">
          <div className="hero__logo">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <nav className="hero-profile">
            {isLoading ? (
              <span className="hero-profile__loading">...</span>
            ) : user ? (
              <div className="hero-profile__menu" ref={menuRef}>
                <button type="button" className="hero-profile__menu-trigger" onClick={() => setIsMenuOpen((prev) => !prev)} aria-expanded={isMenuOpen} aria-haspopup="true">
                  <img src={user.photo ? user.photo : newUser} alt={user?.full_name} className="hero-profile__avatar" />
                  <span className="hero-profile__name">{user.full_name ? user.full_name : "новый пользаватель"}</span>
                  <span className={`hero-profile__arrow ${isMenuOpen ? "hero-profile__arrow--open" : ""}`}>
                    <Arrow />
                  </span>
                </button>

                {isMenuOpen && (
                  <div className="hero-profile__menu-dropdown" role="menu">
                    <Link to="/profile" className="hero-profile__menu-item" onClick={() => setIsMenuOpen(false)} role="menuitem">
                      Профиль
                    </Link>
                    <button type="button" onClick={hendleLogout} className="hero-profile__menu-item hero-profile__menu-item--logout">
                      Выйти
                    </button>
                    <Link to="/game" className="hero-profile__menu-item" onClick={() => setIsMenuOpen(false)} role="menuitem">
                      Поиграть в игру
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hero__login-btn">
                Войти
              </Link>
            )}
          </nav>
        </div>

        <hr className="hero__divider" />
        <div className="hero__content">
          <h1 className="hero__title">{getTitle(location.pathname)}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
