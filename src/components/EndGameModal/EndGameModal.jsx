import styles from "./EndGameModal.module.css";
import { Button } from "../Button/Button";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { postLeaderboard } from "../../api/postLeaderboard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function EndGameModal({
  isWon,
  gameDurationSeconds,
  gameDurationMinutes,
  onClick,
  tries,
  checkedLevel,
  isTopTen,
  leaders,
  setLeaders,
  diffInSecconds,
}) {
  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();
  function goTo() {
    navigate("/Leaderboard");
  }

  function handleClick() {
    postLeaderboard({ userName: inputValue, userTime: diffInSecconds }).then(leaderboard => {
      setLeaders(leaderboard.leaders.sort((a, b) => a.time - b.time).slice(0, 10));
    });
    goTo();
  }

  let imgSrc;
  let imgAlt;

  if (isWon === "STATUS_PAUSED") {
    isWon = "Вы допустили ошибку";
    imgSrc = deadImageUrl;
    imgAlt = "dead emodji";
  }

  // Модалка лидерборда
  if (isTopTen) {
    isWon = "Вы попали на лидерборд!";
    imgSrc = celebrationImageUrl;
    imgAlt = "celebration emodji";
  } else if (isWon === "STATUS_WON") {
    isWon = "Вы победили!";
    imgSrc = celebrationImageUrl;
    imgAlt = "celebration emodji";
  }

  if (isWon === "STATUS_LOST") {
    isWon = "Вы проиграли!";
    imgSrc = deadImageUrl;
    imgAlt = "dead emodji";
  }

  if (tries === 0) {
    isWon = "Вы проиграли!";
    imgSrc = deadImageUrl;
    imgAlt = "dead emodji";
  }

  const title = isWon;

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      <h2 className={styles.title}>{title}</h2>
      {isWon === "Вы допустили ошибку" && <p className={styles.description}>Оставшеся количество попыток:</p>}
      {isWon === "Вы победили!" && <p className={styles.description}>Затраченное время:</p>}
      {isWon === "Вы попали на лидерборд!" && (
        <input
          className={styles.nameInput}
          type="text"
          onChange={e => setInputValue(e.target.value)}
          placeholder="Введите имя"
          maxLength="20"
        />
      )}
      {isWon === "Вы попали на лидерборд!" && <p className={styles.description}>Затраченное время:</p>}
      {isWon === "Вы проиграли!" && <p className={styles.description}>Затраченное время:</p>}
      {isWon === "Вы допустили ошибку" && (
        <div className={styles.time}>
          <p>{tries}</p>
        </div>
      )}
      {isWon === "Вы победили!" && (
        <div className={styles.time}>
          {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
        </div>
      )}

      {/* Модалка лидербборда */}
      {isWon === "Вы попали на лидерборд!" && (
        <div className={styles.time}>
          {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
        </div>
      )}
      {isWon === "Вы проиграли!" && (
        <div className={styles.time}>
          {gameDurationMinutes.toString().padStart("2", "0")}.{gameDurationSeconds.toString().padStart("2", "0")}
        </div>
      )}
      {isWon === "Вы допустили ошибку" && <Button onClick={onClick}>Вернуться к игре</Button>}
      {isWon === "Вы победили!" && <Button onClick={onClick}>Играть снова</Button>}
      {isWon === "Вы попали на лидерборд!" && <Button onClick={onClick}>Улучшить результат</Button>}
      {isWon === "Вы проиграли!" && <Button onClick={onClick}>Игра окончена</Button>}

      {isWon === "Вы попали на лидерборд!" && (
        <button onClick={handleClick} className={styles.gameButtonsLink}>
          Сохранить результат игры
        </button>
      )}
    </div>
  );
}
