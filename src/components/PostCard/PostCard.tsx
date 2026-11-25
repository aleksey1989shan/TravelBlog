import React from "react";
import { IPostCard } from "../../types/post";
import "./PostCard.scss";
import { Link } from "react-router-dom";

const PostCard: React.FC<IPostCard> = ({ city, county, excerpt, id, photo, title }) => {
  return (
    <article className="post-card">
      <div className="post-card__image-wrapper">
        <img src={photo} alt={title} className="post-card__image" />
      </div>
      <div className="post-card__content">
        <h3 className="post-card__title">{title}</h3>
        <p className="post-card__description">{excerpt}</p>
        <div className="post-card__meta">
          <span className="post-card__location">
            {county}, {city}
          </span>
        </div>
        <Link to={`/posts/${id}`} className="post-card__link">
          Подробнее
        </Link>
      </div>
    </article>
  );
};

export default PostCard;
