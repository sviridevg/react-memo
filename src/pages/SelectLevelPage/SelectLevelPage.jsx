import { Link, useNavigate } from "react-router-dom";
import styles from "./SelectLevelPage.module.css";
import { useContext } from "react";
import { EasyContext } from "../../contexte/contexte";
import { Button } from "../../components/Button/Button";
import { SelectLevelButton } from "./SelectLevelButton";

export function SelectLevelPage() {
  const { isEasyMode, setIsEasyMode, checkedLevel, setCheckedLevel } = useContext(EasyContext);

  const handleClick = id => {
    setCheckedLevel(Number(id));
  };

  const navigate = useNavigate();
  function goTo() {
    if (!checkedLevel) {
      alert("Необходимо выбрать уровень игры");
    } else {
      navigate(`/game/${checkedLevel * 3}`);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>
          Выбери <br /> сложность
        </h1>
        <ul className={styles.levels}>
          <label>
            <input className={styles.radio} id={1} type="radio" name="Level" onClick={e => handleClick(e.target.id)} />
            <SelectLevelButton levelNumber={1} checkedLevel={checkedLevel} />
          </label>
          <label>
            <input className={styles.radio} id={2} type="radio" name="Level" onClick={e => handleClick(e.target.id)} />
            <SelectLevelButton levelNumber={2} checkedLevel={checkedLevel} />
          </label>
          <label>
            <input className={styles.radio} id={3} type="radio" name="Level" onClick={e => handleClick(e.target.id)} />
            <SelectLevelButton levelNumber={3} checkedLevel={checkedLevel} />
          </label>
        </ul>

        <label>
          <input
            className={styles.checkbox}
            type="checkbox"
            checked={isEasyMode}
            onChange={e => setIsEasyMode(e.target.checked)}
          />
          <span className={styles.customCheckbox}></span>
          <span className={styles.isEasyModeTitle}>Легкий режим (3 жизни)</span>
        </label>
        <div className={styles.gameButtonsContainer}>
          <Button onClick={goTo}>Играть</Button>
          <Link to="/leaderboard">
            <p className={styles.gameButtonsLink}>Перейти к лидерборду</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
