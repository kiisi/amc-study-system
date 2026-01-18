import { useEffect, useRef, useState } from "react";

export function useCountdown(totalMinutes: number) {
  const totalSeconds = Math.max(0, Math.floor(totalMinutes * 60));

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (totalSeconds <= 0) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [totalSeconds]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return {
    hours,
    minutes,
    seconds,
    secondsLeft,
    isFinished: secondsLeft === 0,
  };
}
