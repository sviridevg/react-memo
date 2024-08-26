import { Button } from "../../components/Button/Button";
import styles from "../Leaderboard/Leaderboard.module.css";
import { useNavigate } from "react-router-dom";
import { LeaderboardPage } from "./LeaderboardPage";
import { useContext } from "react";
import { EasyContext } from "../../contexte/contexte";

export function Leaderboard() {
  const { leadrs } = useContext(EasyContext);

  const navigate = useNavigate();
  function goTo() {
    navigate("/");
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.titleLeaderBoard}>Лидерборд</p>
        <div className={styles.buttonContainer}>
          <Button onClick={goTo}>Начать игру</Button>
        </div>
      </div>
      <div className={styles.titleBoard}>
        <p className={styles.title}>Позиция</p>
        <p className={styles.title}>Пользователь</p>
        <p className={styles.title}>Время</p>
      </div>
      {leadrs?.length &&
        leadrs.map((leader, index) => (
          <LeaderboardPage key={leader.id} id={index + 1} name={leader.name} time={leader.time} />
        ))}
    </div>
  );
}
