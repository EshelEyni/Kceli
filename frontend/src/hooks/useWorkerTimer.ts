import { useEffect, useRef } from "react";
import Worker from "../workers/timerWorker?worker";

type UseWorkerTimerProps = {
  sound: HTMLAudioElement;
  isRunning: boolean;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  onEndTime: () => boolean;
};

export function useWorkerTimer({
  sound,
  isRunning,
  time,
  setTime,
  onEndTime,
}: UseWorkerTimerProps) {
  const workerRef = useRef<Worker>();
  const timeRef = useRef(time);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    workerRef.current = new Worker();
    sound.load();
    if (!workerRef.current) return;

    workerRef.current.onmessage = e => {
      if (e.data === "tick" && timeRef.current >= 0.01) return setTime(prevTime => prevTime - 0.01);
      const shouldStopTimer = onEndTime();
      if (!workerRef.current || !shouldStopTimer) return;
      workerRef.current.postMessage({ action: "stop" });
    };

    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!workerRef.current) return;
    if (isRunning) workerRef.current.postMessage({ action: "start", interval: 10 });
    else workerRef.current.postMessage({ action: "stop" });
  }, [isRunning]);
}
