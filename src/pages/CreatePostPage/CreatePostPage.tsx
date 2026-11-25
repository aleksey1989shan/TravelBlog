import { useNavigate } from "react-router-dom";
import "./CreatePostPage.scss";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import Modal from "../../components/Modal/Modal";

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();

  // поля
  const [title, setTitle] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);

  // модалка
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const MAX_SYMBOLS = 2000;

  // photo
  const hendleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    //чтобы небыло критов, сначала проверим e.target.files если null то остановка
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    if (!photo) {
      setError("У поста должно быть фото");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", title);
      formData.append("country", country);
      formData.append("city", city);
      formData.append("description", description);
      formData.append("photo", photo);

      await axios.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setIsModalOpen(true);
    } catch (err: any) {
      const serverError = err.response?.data?.message || err.response?.data?.error;
      setError(serverError || "неизвестная ошибка. Фото не более 1MB");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  return (
    <div className="create-post">
      <main className="create-post__container">
        <div className="create-post__card">
          <h1 className="create-post__title">Добавление истории о путешествии</h1>

          {error && (
            <div className="create-post__error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-post__form post-form">
            {/* Кнопка загрузки файла */}
            <div className="post-form__upload-box">
              <label htmlFor="post-photo" className="post-form__upload-btn">
                {/* Иконка загрузки из макета */}
                <svg className="post-form__upload-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://w3.org">
                  <path
                    d="M2 11V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V11M8 2V10M8 2L5 5M8 2L11 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{photo ? photo.name : "Загрузите ваше фото"}</span>
              </label>
              <input type="file" id="post-photo" accept="image/*" style={{ display: "none" }} onChange={hendleFileChange} disabled={isLoading} />
            </div>

            {/* Поле: Заголовок */}
            <div className="post-form__field">
              <label htmlFor="post-title" className="post-form__label">
                <span className="post-form__required" aria-hidden="true">
                  *
                </span>{" "}
                Заголовок
              </label>
              <input
                type="text"
                id="post-title"
                className="post-form__input"
                placeholder="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-required="true"
                disabled={isLoading}
                required
              />
            </div>

            {/* Строка с двумя полями: Страна и Город */}
            <div className="post-form__row">
              <div className="post-form__field">
                <label htmlFor="post-country" className="post-form__label">
                  <span className="post-form__required" aria-hidden="true">
                    *
                  </span>{" "}
                  Страна
                </label>
                <input
                  type="text"
                  id="post-country"
                  className="post-form__input"
                  placeholder="Страна"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  aria-required="true"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="post-form__field">
                <label htmlFor="post-city" className="post-form__label">
                  <span className="post-form__required" aria-hidden="true">
                    *
                  </span>{" "}
                  Город
                </label>
                <input
                  type="text"
                  id="post-city"
                  className="post-form__input"
                  placeholder="Город"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  aria-required="true"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Поле: Описание */}
            <div className="post-form__field">
              <label htmlFor="post-description" className="post-form__label">
                <span className="post-form__required" aria-hidden="true">
                  *
                </span>{" "}
                Описание
              </label>
              <textarea
                id="post-description"
                className="post-form__textarea"
                placeholder="Добавьте описание вашей истории"
                maxLength={MAX_SYMBOLS}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                aria-required="true"
                disabled={isLoading}
                required
              />
              {/* Счетчик символов */}
              <div className="post-form__counter">
                {description.length} / {MAX_SYMBOLS.toLocaleString("ru-RU")}
              </div>
            </div>

            {/* Нижние кнопки */}
            <div className="post-form__actions">
              <button type="button" className="post-form__btn-back" onClick={() => navigate(-1)} disabled={isLoading}>
                ← Назад
              </button>

              <button type="submit" className="post-form__btn-submit" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Попап успешного добавления */}
      <Modal isOpen={isModalOpen} text="Ваша история успешно добавлена" closePopap={handleCloseModal} />
    </div>
  );
};

export default CreatePostPage;
