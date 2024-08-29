import styles from "./SelectLevelPage.module.css";
export function SelectLevelButton({ checkedLevel, levelNumber }) {
  return (
    <>
      {checkedLevel !== levelNumber && (
        <div className={styles.level}>
          <span className={styles.levelLink}>{levelNumber}</span>
        </div>
      )}
      {checkedLevel === levelNumber && (
        <div className={styles.levelChek}>
          <span className={styles.levelLink}>{levelNumber}</span>
        </div>
      )}
    </>
  );
}
