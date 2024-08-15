import { Link } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useContext } from "react";
import { EasyContext } from "../../contexte/contexte";

export function SelectLevelPage() {
  const { isEasyMode, setIsEasyMode } = useContext(EasyContext);

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/3">
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/6">
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to="/game/9">
              3
            </Link>
          </li>
        </ul>
        <div className={styles.isEasyMode}>
          <label className={styles.isEasyModeTitle}>Добавить 3 попытки</label>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={isEasyMode}
            onChange={e => setIsEasyMode(e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
}
