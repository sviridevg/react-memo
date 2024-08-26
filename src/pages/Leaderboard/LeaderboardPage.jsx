import styles from "../Leaderboard/Leaderboard.module.css";

export function LeaderboardPage({ id, name, time }) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className={styles.container}>
      <div className={styles.titleBoard}>
        <p className={styles.titlePage}>#{id}</p>
        <p className={styles.titlePage}>{name.slice(0, 20)}</p>

        <p className={styles.titlePage}>
          {minutes.toString().padStart("2", "0")}.{seconds.toString().padStart("2", "0")}
        </p>
      </div>
    </div>
  );
}
