import { shuffle } from "lodash";
import { useContext, useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { EasyContext } from "../../contexte/contexte";
import { useNavigate } from "react-router-dom";

import cheater from "./images/chater.svg";
import eyes from "./images/eyes.svg";

// Игра закончилась
const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
// Пауза игры при допускании ошибки выбора карточки
const STATUS_PAUSED = "STATUS_PAUSED";
// Идет игра: карты закрыты, игрок может их открыть
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
// Начало игры: игрок видит все карты в течении нескольких секунд
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
      diffInSecconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);

  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
    diffInSecconds,
  };
}

/**
 * Основной компонент игры, внутри него находится вся игровая механика и логика.
 * pairsCount - сколько пар будет в игре
 * previewSeconds - сколько секунд пользователь будет видеть все карты открытыми до начала игры
 */
export function Cards({ pairsCount = 3, previewSeconds = 5 }) {
  // Когда игра окончена, переход на главную страницу
  const navigate = useNavigate();
  function goTo() {
    navigate("/");
  }

  // Обработка количества попыток
  const { tries, setTries, isEasyMode, checkedLevel, leadrs, setLeaders } = useContext(EasyContext);

  // В cards лежит игровое поле - массив карт и их состояние открыта\закрыта
  const [cards, setCards] = useState([]);

  // Текущий статус игры
  const [status, setStatus] = useState(STATUS_PREVIEW);

  // Последняя открытая карта
  const [lastOpenedCard, setLastOpenedCard] = useState(null);

  // Закрытие последней карты
  function closeLastOpenedCard(status) {
    if (status === STATUS_IN_PROGRESS && lastOpenedCard) {
      const updatedCards = cards.map(card => (card.id === lastOpenedCard.id ? { ...card, open: false } : card));

      setCards(updatedCards);
      setLastOpenedCard(null); // Сбрасываем последнюю открытую карту
    }
  }

  // Дата начала игры
  const [gameStartDate, setGameStartDate] = useState(null);
  // Дата конца игры
  const [gameEndDate, setGameEndDate] = useState(null);

  // Стейт для таймера, высчитывается в setInteval на основе gameStartDate и gameEndDate
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
    diffInSecconds: 0,
  });

  // стейт для таймера
  const [pausedTime, setPausedTime] = useState(0);

  // Если количество попыток равно 0 устанавливается стату проиграл и игра заканчивается
  useEffect(() => {
    if (tries === 0) {
      finishGame(STATUS_LOST);
    }
  }, [tries]);

  function finishGame(status) {
    setGameEndDate(new Date());
    setStatus(status);
  }

  function pausedGame() {
    setStatus(STATUS_PAUSED);
    setPausedTime(timer.diffInSecconds);
  }

  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);

    // Проверка на включенный режим 3-х попыток
    if (!isEasyMode) {
      setTries(1);
    }
  }
  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setTries(3);
    setIsRandomPairOpened(false);
    setIsEyesActivated(false);
    setIsEyesUsed(false);
  }

  function сontinueGame() {
    setStatus(STATUS_IN_PROGRESS);
    closeLastOpenedCard(STATUS_IN_PROGRESS);
    const newStartDate = new Date();
    setGameStartDate(new Date(newStartDate.getTime() - pausedTime * 1000));
    setGameEndDate(null);
  }

  // Функция запускает разные сценарии для кнопки в модальном окне
  function whatsNext() {
    if (status === STATUS_PAUSED) {
      сontinueGame(STATUS_IN_PROGRESS);
    }
    if (status === STATUS_LOST) {
      goTo();
      setTries(3);
    }
    if (status === STATUS_WON) {
      resetGame();
    }
  }

  /**
   * Обработка основного действия в игре - открытие карты.
   * После открытия карты игра может пепереходит в следующие состояния
   * - "Игрок выиграл", если на поле открыты все карты
   * - "Игрок проиграл", если на поле есть две открытые карты без пары
   * - "Игра продолжается", если не случилось первых двух условий
   */
  const openCard = clickedCard => {
    // Если карта уже открыта, то ничего не делаем
    if (clickedCard.open) {
      return;
    }
    // Игровое поле после открытия кликнутой карты
    const nextCards = cards.map(card => {
      if (card.id === clickedCard.id) {
        setLastOpenedCard({ ...card, open: true });
        return { ...card, open: true };
      }
      return card;
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    // Победа - все карты на поле открыты
    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    // Открытые карты на игровом поле
    const openCards = nextCards.filter(card => card.open);

    // Ищем открытые карты, у которых нет пары среди других открытых
    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);

      if (sameCards.length < 2) {
        return true;
      }

      return false;
    });

    const havMistake = openCardsWithoutPair.length >= 2;

    // Если на поле есть две открытые карты без пары, то игра паузится и уменьшается количество попыток
    function minusTries() {
      setTries(prev => prev - 1);
    }

    // "Игрок допустил ошибку", т.к на поле есть две открытые карты без пары
    if (havMistake) {
      minusTries();
      pausedGame(STATUS_PAUSED);
    }

    // ... игра продолжается
  };

  // Проверка на попадание в топ 10 игроков
  function isTopTen() {
    const isTenPlayers = leadrs.length === 10;
    if (status === STATUS_WON && checkedLevel === 3) {
      if (leadrs.at(-1).time > timer.diffInSecconds || (isTenPlayers && leadrs[9].time > timer.diffInSecconds)) {
        return true;
      }
    }
    return false;
  }

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON || status === STATUS_PAUSED;

  // Игровой цикл
  useEffect(() => {
    // В статусах кроме превью доп логики не требуется
    if (status !== STATUS_PREVIEW) {
      return;
    }

    // В статусе превью мы
    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  // Обновляем значение таймера в интервале
  useEffect(() => {
    if (status === STATUS_PAUSED || status === STATUS_PREVIEW) return;

    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);

    return () => clearInterval(intervalId);
  }, [gameStartDate, gameEndDate, status]);

  const [isRandomPairOpened, setIsRandomPairOpened] = useState(false);
  const [isEyesActivated, setIsEyesActivated] = useState(false);
  const [isEyesUsed, setIsEyesUsed] = useState(false);
  const [achievements, setAchievements] = useState([1, 2]);

  // Рендер картинок читерства
  const renderAchivImage = (src, tooltip, isDisabled) => {
    const hasTooltip = tooltip !== null && !isDisabled;

    return (
      <div className={styles.imgWrapper} style={{ pointerEvents: isDisabled ? "none" : "auto" }}>
        <img className={`${styles.img} ${isDisabled ? styles.disabled : ""}`} src={src} alt="Читерство" />
        {hasTooltip && <div className={styles.tooltip}>{tooltip}</div>}
      </div>
    );
  };

  // Текстовка для подсказки Прозрение
  const eyesText = (
    <div className={styles.eyesTex}>
      <p className={styles.eyesTextTitle}>Прозрение</p>
      <p>На 5 секунд показываются все карты. Таймер длительности игры на это время останавливается.</p>
    </div>
  );

  // Текстовка для подсказки Алохомора
  const cheaterText = (
    <div className={styles.eyesTex}>
      <p className={styles.eyesTextTitle}>Алохомора</p>
      <p>Открывается случайная пара карт.</p>
    </div>
  );

  // Определение картинок
  const firstImagesElement = renderAchivImage(eyes, eyesText, isEyesUsed);
  const secondImagesElement = renderAchivImage(cheater, cheaterText, isRandomPairOpened);

  // Читерство - открываем все карты на 5 секунд
  const activateEyesEffect = () => {
    if (isEyesUsed || isEyesActivated) return;

    const savedCards = [...cards];

    // Открываем все карты
    const openedCards = cards.map(card => ({ ...card, open: true }));
    setCards(openedCards);

    // Останавливаем таймер
    const savedGameEndDate = gameEndDate;

    setGameEndDate(new Date());

    setIsEyesActivated(true);
    setIsEyesUsed(true);

    // Возвращаем состояние через 5 секунд
    setTimeout(() => {
      setCards(savedCards);
      setGameEndDate(savedGameEndDate);
      setIsEyesActivated(false);
    }, 5000);
  };

  // Читерство - открываем две случайные карты
  const openRandomPair = () => {
    // Проверяем, была ли уже вызвана функция
    if (isRandomPairOpened) return;

    const closedCards = cards.filter(card => !card.open);
    if (closedCards.length < 2) return;

    const shuffledClosedCards = shuffle(closedCards);
    const [firstCard, secondCard] = shuffledClosedCards.slice(0, 2);

    const updatedCards = cards.map(card => {
      if (card.id === firstCard.id || card.id === secondCard.id) {
        return { ...card, open: true };
      }
      return card;
    });

    setCards(updatedCards);
    setIsRandomPairOpened(true);
  };

  // Записываем данные про использование легкого режима и использовании читерства
  useEffect(() => {
    let currentGameAchievements = [...achievements];

    // Проверяем, использовались ли легкий режим
    if (isEasyMode) {
      currentGameAchievements = currentGameAchievements.filter(ach => ach !== 1);
    }

    // Проверяем, использовались ли суперсилы
    if (isEyesUsed || isRandomPairOpened) {
      currentGameAchievements = currentGameAchievements.filter(ach => ach !== 2);
    }

    // Обновляем состояния с учетом новых достижений
    setAchievements(currentGameAchievements);
  }, [isEyesUsed, isRandomPairOpened, isEasyMode]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS ? (
          <div className={styles.cheaterContainer}>
            <div onClick={activateEyesEffect}>{firstImagesElement}</div>
            <div onClick={openRandomPair}>{secondImagesElement}</div>
          </div>
        ) : null}
        <div className={styles.buttonContainer}>
          {isEasyMode && status === STATUS_IN_PROGRESS && (
            <span className={styles.attempt}>Осталось {tries} попытки!</span>
          )}
          {status === STATUS_IN_PROGRESS ? <Button onClick={resetGame}>Начать заново</Button> : null}
        </div>
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status === STATUS_IN_PROGRESS || status === STATUS_PAUSED ? card.open : true}
            suit={card.suit}
            rank={card.rank}
            status={STATUS_IN_PROGRESS}
          />
        ))}
      </div>

      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={whatsNext}
            tries={tries}
            checkedLevel={checkedLevel}
            isTopTen={isTopTen()}
            leadrs={leadrs}
            setLeaders={setLeaders}
            diffInSecconds={timer.diffInSecconds}
            achievements={achievements}
          />
        </div>
      ) : null}
    </div>
  );
}
