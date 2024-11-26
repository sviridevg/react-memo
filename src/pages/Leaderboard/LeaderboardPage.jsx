import styles from "../Leaderboard/Leaderboard.module.css";
import achivStart1 from "./images/achiv_start_1.svg";
import achivStart2 from "./images/achiv_start_2.svg";
import achivActive1 from "./images/achiv_active_1.svg";
import achivActive2 from "./images/achiv_active_2.svg";

export function LeaderboardPage({ id, name, time, achievements }) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // Логика отображения достижений
  const renderAchivImage = (src, tooltip) => {
    const hasTooltip = tooltip !== null;

    return (
      <div className={styles.imgWrapper}>
        <img src={src} alt="Достижение" />
        {hasTooltip && <div className={styles.tooltip}>{tooltip}</div>}
      </div>
    );
  };

  const firstImagesElement = achievements.includes(1)
    ? renderAchivImage(achivActive1, "Игра пройдена в сложном режиме")
    : renderAchivImage(achivStart1, null);

  const secondImagesElement = achievements.includes(2)
    ? renderAchivImage(achivActive2, "Игра пройдена без супер-сил")
    : renderAchivImage(achivStart2, null);

  return (
    <div className={styles.container}>
      <div className={styles.titleBoard}>
        <p className={styles.titlePage}>#{id}</p>
        <p className={styles.titlePage}>{name.slice(0, 20)}</p>
        <div className={styles.imgContainer}>
          {firstImagesElement}
          {secondImagesElement}
        </div>
        <p className={styles.titlePage}>
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
