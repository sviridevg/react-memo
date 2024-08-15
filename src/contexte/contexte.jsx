import { createContext, useState } from "react";

export const EasyContext = createContext(false);

export const EasyProvider = ({ children }) => {
  const [tries, setTries] = useState(3);
  const [isEasyMode, setIsEasyMode] = useState(false);

  return <EasyContext.Provider value={{ tries, setTries, isEasyMode, setIsEasyMode }}>{children}</EasyContext.Provider>;
};
