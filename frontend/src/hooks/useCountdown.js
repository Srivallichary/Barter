import { useState, useEffect, useCallback } from "react";

function useCountdown(initialSeconds = 30) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;

    const intervalId = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds]);

  const start = useCallback(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  const reset = useCallback(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  return {
    seconds,
    start,
    reset,
    isFinished: seconds === 0,
  };
}

export default useCountdown;
