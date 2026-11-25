import { useState, useEffect, FC } from "react";
import axios from "axios";
import PostCard from "../../components/PostCard/PostCard";
import { IPost } from "../../types/post";
import { Link } from "react-router-dom";
import "./MainPage.scss";

const MainPage: FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isloading, setIsloading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // стэйт пагинации
  const [currentPage, setCurrentPage] = useState<number>(1);
  const quantityPosts = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsloading(true);
        const response = await axios.get<IPost[]>("/api/posts");

        if (!response) {
          throw new Error("Не удалось загрузить посты");
        }

        const sorteredPosts = [...response.data].sort((a, b) => b.id - a.id);

        setPosts(sorteredPosts);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsloading(false);
      }
    };
    fetchPosts();
  }, []);
  console.log("shan", posts);

  const indexLastPost = currentPage * quantityPosts;
  const indexFirstPost = indexLastPost - quantityPosts;
  const currentPosts = posts.slice(indexFirstPost, indexLastPost);
  const totalPages = Math.ceil(posts.length / quantityPosts);

  // Функции для переключения страниц
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <main className="main-page">
      {isloading && <div className="main-page__status">Загрузка путешествий...</div>}
      {error && <div className="main-page__error">{error}</div>}

      {!isloading && !error && (
        <>
          <div className="main-page__grid">
            {currentPosts.map((post) => (
              <PostCard key={post.id} title={post.title} excerpt={post.excerpt} photo={post.photo} id={post.id} city={post.city} county={post.county} />
            ))}
          </div>

          {/* Пагинация */}
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1} className="pagination-btn">
              Назад
            </button>
            <span className="pagination-info">
              Страница <strong>{currentPage}</strong> из {totalPages}
            </span>
            <button onClick={nextPage} disabled={currentPage === totalPages} className="pagination-btn">
              Вперед
            </button>
          </div>

          {/* Кнопка */}
          <div className="main-page-actions">
            <Link to="/create-post" className="main-page-add-btn">
              Добавить мое путешествие
            </Link>
          </div>
        </>
      )}
    </main>
  );
};

export default MainPage;
