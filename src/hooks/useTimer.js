/**
 * Mental Calculations — useTimer Hook
 * Countdown timer para quizzes
 */
import { useState, useEffect, useRef, useCallback } from 'react';

export default function useTimer(initialSeconds, onTimeUp) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const callbackRef = useRef(onTimeUp);

  useEffect(() => { callbackRef.current = onTimeUp; }, [onTimeUp]);

  const start = useCallback(() => { setIsRunning(true); }, []);
  const pause = useCallback(() => { setIsRunning(false); }, []);
  const reset = useCallback((newTime) => {
    setIsRunning(false);
    setTimeLeft(newTime ?? initialSeconds);
  }, [initialSeconds]);
  const addTime = useCallback((seconds) => {
    setTimeLeft((prev) => prev + seconds);
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          if (callbackRef.current) callbackRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const percentage = Math.min(100, (timeLeft / initialSeconds) * 100);
  return { timeLeft, percentage, isRunning, start, pause, reset, addTime };
}
