import { useState } from "react";

export function useScore() {
  const [score, setScore] = useState(0);
  const addPoint = () => setScore(prev => prev + 1);
  const resetScore = () => setScore(0);
  return { score, addPoint, resetScore };
}