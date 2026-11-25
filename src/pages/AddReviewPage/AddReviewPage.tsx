import { FC, useState, useCallback, useEffect } from "react";
import "./AddReviewPage.scss";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/Modal/Modal";
import { useAuth } from "../../context/AuthContext";

// добавление поста
const AddReviewPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { user } = useAuth();

  const MAX_SYMBOLS = 600;

  // useEffect надёжнее чем просто писать имя сразу в стейт
  useEffect(() => {
    if (user?.full_name) {
      setName(user.full_name);
    }
  }, [user]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!name.trim() || !text.trim()) {
      setSubmitError("заполните обязательные поля");
      return;
    }

    try {
      setIsSubmiting(true);
      setSubmitError(null);
      const token = localStorage.getItem("token");
      await axios.post(`/api/posts/${id}/comments`, { full_name: name, comment: text }, { headers: { Authorization: `Bearer ${token}` } });

      setIsModalOpen(true);
    } catch (err: any) {
      if (err.response?.status == 401) {
        setSubmitError("Вам необходимо зарегистрироваться или войти в аккаунт");
      } else {
        setSubmitError(err.response?.data?.message || "не удалось сохранить");
      }
    } finally {
      setIsSubmiting(false);
    }
  };

  // закрытие модалки
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    navigate(`/posts/${id}`);
  }, [navigate, id]);

  return (
    <div className="add-review">
      <main className="add-review__container">
        <h1 className="add-review__title">Добавление отзыва</h1>

        {submitError && <div className="add-review__error">{submitError}</div>}

        <form onSubmit={handleSubmit} className="add-review__form review-form">
          {/* Поле: Ваше имя */}
          <div className="review-form__field">
            <label className="review-form__label" htmlFor="authorName">
              <span className="review-form__required">*</span> Ваше имя
            </label>
            <input type="text" id="authorName" className="review-form__input" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmiting} required />
          </div>

          {/* Поле: Отзыв */}
          <div className="review-form__field">
            <label className="review-form__label" htmlFor="commentText">
              <span className="review-form__required">*</span> Отзыв
            </label>
            <textarea
              id="commentText"
              className="review-form__textarea"
              placeholder="Добавьте текст отзыва"
              maxLength={MAX_SYMBOLS}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isSubmiting}
              required
            />
            {/* Счетчик символов */}
            <div className="review-form__counter" translate="no">
              {text.length}/{MAX_SYMBOLS}
            </div>
          </div>

          {/* Кнопки управления */}
          <div className="review-form__actions">
            <button type="button" className="review-form__btn-back" onClick={() => navigate(-1)} disabled={isSubmiting}>
              ← Назад
            </button>

            <button type="submit" className="review-form__btn-submit" disabled={isSubmiting}>
              {isSubmiting ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </main>
      <Modal isOpen={isModalOpen} text="Ваш отзыв успешно добавлен" closePopap={handleCloseModal} />
    </div>
  );
};

export default AddReviewPage;
