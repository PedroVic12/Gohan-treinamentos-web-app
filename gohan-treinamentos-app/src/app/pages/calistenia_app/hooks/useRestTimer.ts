import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_SECONDS = 60;

function playBeep() {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    osc.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch {
    /* ignore */
  }
}

export function useRestTimer(onComplete: () => void) {
  const [timerTime, setTimerTime] = useState(DEFAULT_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!timerActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimerTime((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          playBeep();
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          onComplete();
          return DEFAULT_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerActive, onComplete]);

  const toggle = useCallback(() => setTimerActive((a) => !a), []);
  const reset = useCallback(() => {
    setTimerActive(false);
    setTimerTime(DEFAULT_SECONDS);
  }, []);
  const startRest = useCallback(() => {
    setTimerTime(DEFAULT_SECONDS);
    setTimerActive(true);
  }, []);

  return { timerTime, timerActive, toggle, reset, startRest };
}
