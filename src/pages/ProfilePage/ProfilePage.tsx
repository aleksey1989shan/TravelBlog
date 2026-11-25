import "./ProfilePage.scss";
import { useAuth } from "../../context/AuthContext";
import newUser from "../../assets/new-user.png";
import Pencil from "../../components/Icons/Pencil";
import { Link } from "react-router-dom";
import Camera from "../../components/Icons/Camera";

export const ProfilePage: React.FC = () => {
  const { user, isLoading } = useAuth();
  console.log(user);

  if (isLoading) return <div className="profile-page__status">Загрузка профиля...</div>;
  if (!user) return <div className="profile-page__status">Пожалуйста, авторизуйтесь</div>;

  return (
    <div className="profile-page">
      <main className="profile-page__container">
        <div className="profile-page__card profile-card">
          <div className="profile-card__avatar-section">
            <div className="profile-card__image-wrapper">
              <img src={user.photo ? user.photo : newUser} alt={user.full_name} className="profile-card__image" />
            </div>
            <button className="profile-card__change-photo-btn">
              <Camera />
              Изменить фото
            </button>
          </div>

          <div className="profile-card__info-section">
            <div className="profile-card__header">
              <h2 className="profile-card__name">{user.full_name ? user.full_name : "новый пользаватель"}</h2>
              <Link to="/profile/edit">
                <Pencil />
              </Link>
            </div>
            <div className="profile-card__field">
              <span className="profile-card__label">Город:</span>
              <p className="profile-card__value">{user.city ? user.city : "Город не указан"}</p>
            </div>
            <div className="profile-card__field">
              <span className="profile-card__label">страна:</span>
              <p className="profile-card__value">{user.country ? user.country : "Страна не указана"}</p>
            </div>
            <div className="profile-card__field">
              <span className="profile-card__label">О себе:</span>
              <p className="profile-card__value profile-card__value--bio">{user.bio ? user.bio : "Биография ещё не заполнена"}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
