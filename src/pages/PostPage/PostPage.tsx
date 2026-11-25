import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./PostPage.scss";
import { IPostDetail } from "../../types/post";
import axios from "axios";
import { formattedDate } from "../../utils/formattedDate";

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<IPostDetail | null>(null);
  const [isloading, setIsloading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setIsloading(true);
        const response = await axios.get<IPostDetail>(`/api/posts/${id}`);
        setPost(response.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsloading(false);
      }
    };

    fetchPostDetail();
  }, [id]);

  console.log("shan", post);

  if (isloading) return <div className="post-page__status">Загрузка истории...</div>;
  if (error) return <div className="post-page__status">{error}</div>;
  if (!post) return <div className="post-page__status">Пост не найден</div>;

  return (
    <div className="post-page">
      <main className="post-page__container">
        <div className="post-page__image-wrapper">
          <img src={post.photo} alt={post.title} className="post-page__image" />
        </div>

        {/* Заголовок статьи */}
        <h1 className="post-page__title">{post.title}</h1>

        {/* Текст статьи (выводим каждый абзац тегом <p>) */}
        <div className="post-page__content">
          <p className="post-page__paragraph">{post.description}</p>
        </div>

        {/* Блок комментариев */}
        <section className="post-page__comments comments-block">
          {post.comments &&
            post.comments.map((comment, index) => (
              <div key={index} className="comments-block__item">
                <span className="comments-block__author">{comment.author_name}</span>
                <span className="comments-block__date" translate="no">
                  {formattedDate(comment.created_at)}
                </span>
                <p className="comments-block__text">{comment.comment}</p>
              </div>
            ))}
        </section>

        {/* Нижняя панель действий */}
        <div className="post-page__actions">
          <Link to="/" className="post-page__btn-back">
            Назад
          </Link>

          <Link to={`/posts/${id}/review`} className="post-page__btn-review">
            Ваше впечатление об этом месте
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PostPage;
