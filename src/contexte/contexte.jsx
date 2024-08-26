import { createContext, useState, useEffect } from "react";
import { getLeaderboard } from "../api/getLeaderboard";

export const EasyContext = createContext(false);

export const EasyProvider = ({ children }) => {
  const [tries, setTries] = useState(3);
  const [isEasyMode, setIsEasyMode] = useState(false);
  const [leadrs, setLeaders] = useState([]);
  const [checkedLevel, setCheckedLevel] = useState();

  useEffect(() => {
    if (leadrs.length === 0) {
      getData();
    }
  }, []);

  async function getData() {
    const data = await getLeaderboard();
    const leaders = data.leaders.sort((a, b) => a.time - b.time).slice(0, 10);
    setLeaders(leaders);
  }

  return (
    <EasyContext.Provider
      value={{ tries, setTries, isEasyMode, setIsEasyMode, leadrs, setLeaders, checkedLevel, setCheckedLevel }}
    >
      {children}
    </EasyContext.Provider>
  );
};
