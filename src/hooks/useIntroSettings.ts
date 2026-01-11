import { useState, useEffect } from "react";

const INTRO_ENABLED_KEY = "chemflare_intro_enabled";

export const useIntroSettings = () => {
  const [introEnabled, setIntroEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(INTRO_ENABLED_KEY);
    return saved === null ? true : saved === "true";
  });

  useEffect(() => {
    localStorage.setItem(INTRO_ENABLED_KEY, String(introEnabled));
  }, [introEnabled]);

  const toggleIntro = () => {
    setIntroEnabled((prev) => !prev);
  };

  return { introEnabled, setIntroEnabled, toggleIntro };
};

export const getIntroEnabled = (): boolean => {
  const saved = localStorage.getItem(INTRO_ENABLED_KEY);
  return saved === null ? true : saved === "true";
};
