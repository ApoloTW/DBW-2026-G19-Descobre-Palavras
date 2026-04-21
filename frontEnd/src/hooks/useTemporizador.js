import { useState, useEffect } from "react";

export function useTemporizador(initialTime = 10) {
  const [time, setTime] = useState(initialTime);
  const [active, setActive] = useState(true);
  const isExpired = time === 0 && !active;

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          setActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active]);

  const addTime = seconds => setTime(prev => prev + seconds);
  const resetTime = () => setTime(initialTime);

   return { time, active, addTime, resetTime, setActive, isExpired };
}