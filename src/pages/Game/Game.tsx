import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Game.scss";
import Fang from "../../assets/Fang-Basic.png";

interface Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
  type: number; // Для разного цвета "мушек"
}

export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "win">("playing");
  const [restartTrigger, setRestartTrigger] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // игрок
    const playerImg = new Image();
    playerImg.src = Fang;

    // Размеры игрового поля
    const WIDTH = 600;
    const HEIGHT = 500;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // Игрок (корабль)
    const player = {
      x: WIDTH / 2 - 20,
      y: HEIGHT - 50,
      width: 40,
      height: 24,
      speed: 5,
    };

    let bullets: Bullet[] = [];
    let enemyBullets: Bullet[] = [];
    const keys: { [key: string]: boolean } = {};
    let animationFrameId: number;
    let isGameActive = true;

    // Создаем строй "мушек" (4 ряда по 8 штук)
    const enemies: Enemy[] = [];
    const rows = 4;
    const cols = 8;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        enemies.push({
          x: 70 + c * 60,
          y: 50 + r * 45,
          width: 32,
          height: 24,
          alive: true,
          type: r,
        });
      }
    }

    let enemyDirection = 1; // 1 - вправо, -1 - влево
    let enemySpeed = 1.2;
    let lastShotTime = 0;

    // Управление с клавиатуры
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
      // Предотвращаем прокрутку страницы пробелом и стрелками
      if (["Space", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Отрисовка пиксельного корабля игрока
    const drawPlayer = () => {
      // Рисуем картинку только когда она полностью загрузилась в память
      if (playerImg.complete) {
        // Отключаем сглаживание, чтобы пиксели оставались четкими и не мылились!
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
      }
    };

    // Отрисовка пиксельной "мушки"
    const drawEnemy = (enemy: Enemy) => {
      const colors = ["#ff4d4f", "#ffb703", "#00bbf9", "#00f5d4"];
      ctx.fillStyle = colors[enemy.type % colors.length];

      // Пиксельный силуэт жука
      ctx.fillRect(enemy.x + 8, enemy.y, 16, 6);
      ctx.fillRect(enemy.x + 4, enemy.y + 6, 24, 10);
      ctx.fillRect(enemy.x, enemy.y + 10, 4, 8);
      ctx.fillRect(enemy.x + 28, enemy.y + 10, 4, 8);
      ctx.fillRect(enemy.x + 8, enemy.y + 16, 4, 6);
      ctx.fillRect(enemy.x + 20, enemy.y + 16, 4, 6);
    };

    // Главный игровой цикл (60 FPS)
    const update = (timestamp: number) => {
      if (!isGameActive) return;

      // Очистка экрана (космос)
      ctx.fillStyle = "#0b0c10";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Звезды на фоне
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      for (let i = 0; i < 20; i++) {
        const starX = (i * 97) % WIDTH;
        const starY = (i * 53 + timestamp * 0.05) % HEIGHT;
        ctx.fillRect(starX, starY, 2, 2);
      }

      // Движение игрока
      if ((keys["ArrowLeft"] || keys["KeyA"]) && player.x > 10) {
        player.x -= player.speed;
      }
      if ((keys["ArrowRight"] || keys["KeyD"]) && player.x < WIDTH - player.width - 10) {
        player.x += player.speed;
      }

      // Выстрел игрока (с перезарядкой 300мс)
      if (keys["Space"] && timestamp - lastShotTime > 300) {
        bullets.push({
          x: player.x + player.width / 2 - 2,
          y: player.y - 10,
          width: 4,
          height: 12,
          speed: 7,
        });
        lastShotTime = timestamp;
      }

      // Обновление пуль игрока
      ctx.fillStyle = "#ffb703";
      bullets = bullets.filter((b) => b.y > -20);
      bullets.forEach((b) => {
        b.y -= b.speed;
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      // Движение строя врагов
      let hitEdge = false;
      const aliveEnemies = enemies.filter((e) => e.alive);

      if (aliveEnemies.length === 0) {
        isGameActive = false;
        setGameState("win");
        return;
      }

      aliveEnemies.forEach((e) => {
        e.x += enemySpeed * enemyDirection;
        if (e.x <= 15 || e.x + e.width >= WIDTH - 15) {
          hitEdge = true;
        }
      });

      if (hitEdge) {
        enemyDirection *= -1;
      }

      // Случайные выстрелы "мушек"
      if (Math.random() < 0.02 && aliveEnemies.length > 0) {
        const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
        enemyBullets.push({
          x: shooter.x + shooter.width / 2 - 2,
          y: shooter.y + shooter.height,
          width: 4,
          height: 10,
          speed: 4,
        });
      }

      // Обновление пуль врагов и проверка попадания в игрока
      ctx.fillStyle = "#ff4d4f";
      enemyBullets = enemyBullets.filter((eb) => eb.y < HEIGHT + 20);
      enemyBullets.forEach((eb) => {
        eb.y += eb.speed;
        ctx.fillRect(eb.x, eb.y, eb.width, eb.height);

        if (eb.x < player.x + player.width && eb.x + eb.width > player.x && eb.y < player.y + player.height && eb.y + eb.height > player.y) {
          isGameActive = false;
          setGameState("gameover");
        }
      });

      // Проверка попаданий пуль игрока по врагам
      bullets.forEach((b) => {
        aliveEnemies.forEach((e) => {
          if (e.alive && b.x < e.x + e.width && b.x + b.width > e.x && b.y < e.y + e.height && b.y + b.height > e.y) {
            e.alive = false;
            b.y = -100; // Убираем пулю за экран
            setScore((prev) => prev + 100);
          }
        });
      });

      // Отрисовка живых врагов и игрока
      aliveEnemies.forEach(drawEnemy);
      drawPlayer();

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      isGameActive = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [restartTrigger]);

  const handleRestart = () => {
    setScore(0);
    setGameState("playing");
    setRestartTrigger((prev) => prev + 1);
  };

  return (
    <div className="game-page">
      <div className="game-page__container">
        <div className="game-page__header">
          <h1 className="game-page__title">(игра в разработке, что-то может не работать!)</h1>
          <div className="game-page__score">
            Очки: <span>{score}</span>
          </div>
        </div>

        <div className="game-page__board">
          <canvas ref={canvasRef} className="game-page__canvas" />

          {gameState !== "playing" && (
            <div className="game-page__overlay">
              <h2 className="game-page__result">{gameState === "win" ? "ПОБЕДА! Но это только начало!" : "GAME OVER"}</h2>
              <p className="game-page__final-score">Ваш счет: {score}</p>
              <button type="button" className="game-page__btn" onClick={handleRestart}>
                Играть снова
              </button>
            </div>
          )}
        </div>

        <div className="game-page__controls">
          <p>
            Управление: <strong>← →</strong> (или <strong>A / D</strong>) — движение, <strong>Пробел</strong> — огонь, <strong>G</strong> — суперудар
          </p>
          <Link to="/" className="game-page__back-link">
            ← Вернуться в блог
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Game;
