import { useNavigate } from "react-router-dom";
import "./EditProfilePage.scss";
import { useAuth } from "../../context/AuthContext";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import NewUser from "../../assets/new-user.png";
import axios from "axios";
import Camera from "../../components/Icons/Camera";
import Modal from "../../components/Modal/Modal";

// редактирование профиля
const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();

  // fields
  const [fullName, setFullName] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  //foto
  const [avatar, setAvatar] = useState<File | null>(null);
  // Локальное превью для картинки, чтобы пользователь видел, что выбрал
  const [previewUrl, setPreviewUrl] = useState<string>(NewUser);

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const MAX_SYMBOLS = 600;

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setCity(user.city);
      setBio(user.bio);
      setPreviewUrl(user.photo || NewUser);
      setCountry(user.country);
    }
  }, [user]);

  //выбор фото
  const hendleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // проверяем пароли, заполняем поля и отправляем
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    // проверка совпадения паролей
    if (password !== confirmPassword) {
      setError("пароли не совпадают");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("bio", bio);

      if (avatar) {
        formData.append("photo", avatar);
      }

      const token = localStorage.getItem("token");

      // запрос №1
      await axios.post("/api/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // запрос №2
      if (password) {
        await axios.patch("/api/user/password", { password }, { headers: { Authorization: `Bearer ${token}` } });
      }

      //checkAuth() перезапустит с новыми данными
      await checkAuth();
      setIsModalOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "ошибка сохранения профиля");
      console.error("ошибка сохранения профиля", err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  // закрытие модалки
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    navigate("/profile");
  }, [navigate]);

  if (!user) return <div className="edit-profile__status">Пожалуйста, авторизуйтесь</div>;
  //   if (error) return <div className="edit-profile__statusё">{error}</div>;

  return (
    <div className="edit-profile">
      <main className="edit-profile__container">
        <form onSubmit={handleSubmit} className="edit-profile__form profile-form">
          <div className="profile-form__avatar-section">
            <div className="profile-form__image-wrapper">
              <img src={previewUrl} alt="аватар" className="profile-form__image" />
            </div>

            <label htmlFor="avatar-upload" className="profile-form__change-photo-btn">
              <Camera />
              Изменить фото
            </label>
            <input type="file" id="avatar-upload" accept="image/*" style={{ display: "none" }} onChange={hendleFileChange} disabled={isLoading} />
          </div>

          <div className="profile-form__fields-section">
            {error && <div className="profile-form__error">{error}</div>}

            <div className="profile-form__field">
              <label htmlFor="edit-fullname" className="profile-form__label">
                * ФИО
              </label>
              <input type="text" id="edit-fullname" className="profile-form__input" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} required />
            </div>

            <div className="profile-form__row">
              <div className="profile-form__field">
                <label htmlFor="edit-country" className="profile-form__label">
                  Страна
                </label>
                <input type="text" id="edit-country" className="profile-form__input" value={country} onChange={(e) => setCountry(e.target.value)} disabled={isLoading} />
              </div>

              <div className="profile-form__field">
                <label htmlFor="edit-city" className="profile-form__label">
                  Город
                </label>
                <input type="text" id="edit-city" className="profile-form__input" value={city} onChange={(e) => setCity(e.target.value)} disabled={isLoading} />
              </div>
            </div>

            <div className="profile-form__field">
              <label htmlFor="edit-bio" className="profile-form__label">
                О себе
              </label>
              <textarea id="edit-bio" className="profile-form__textarea" maxLength={MAX_SYMBOLS} value={bio} onChange={(e) => setBio(e.target.value)} disabled={isLoading} />
              <div className="profile-form__counter" translate="no">
                {bio.length}/{MAX_SYMBOLS}
              </div>
            </div>

            {/* Смена пароля */}
            <div className="profile-form__password-section">
              <h3 className="profile-form__subtitle">Смена пароля</h3>
              <div className="profile-form__row">
                <div className="profile-form__field">
                  <label htmlFor="edit-password" className="profile-form__label">
                    Новый пароль
                  </label>
                  <input
                    type="password"
                    id="edit-password"
                    className="profile-form__input"
                    placeholder="Новый пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="profile-form__field">
                  <label htmlFor="edit-confirm" className="profile-form__label">
                    Повторите пароль
                  </label>
                  <input
                    type="password"
                    id="edit-confirm"
                    className="profile-form__input"
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required={password.length > 0}
                  />
                </div>
              </div>
            </div>

            <div className="profile-form__actions">
              <button type="button" className="profile-form__btn-back" onClick={() => navigate(-1)} disabled={isLoading}>
                Назад
              </button>
              <button type="submit" className="profile-form__btn-submit" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Modal isOpen={isModalOpen} text="Профиль успешно сохранён" closePopap={handleCloseModal} />
    </div>
  );
};

export default EditProfilePage;
