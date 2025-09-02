import { useEffect, useState } from 'preact/hooks';
import { formatTime, getElapsedTime } from '../../utils/timer';
import styles from './Timer.module.scss';

interface TimerProps {
  startTime: number | null;
  isRunning: boolean;
}

export const Timer = ({ startTime, isRunning }: TimerProps) => {
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (!startTime || !isRunning) {
      setCurrentTime(0);
      return;
    }

    // Update immediately
    setCurrentTime(getElapsedTime(startTime));

    // Set up interval to update every second
    const interval = setInterval(() => {
      setCurrentTime(getElapsedTime(startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isRunning]);

  return (
    <div className={styles.timer}>
      <span className={styles.timerValue}>{formatTime(currentTime)}</span>
    </div>
  );
};
