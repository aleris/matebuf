/**
 * Formats time in milliseconds to MM:SS format
 */
export const formatTime = (timeMs: number): string => {
  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Gets the current time in milliseconds
 */
export const getCurrentTime = (): number => {
  return Date.now();
};

/**
 * Calculates elapsed time from start time to current time
 */
export const getElapsedTime = (startTime: number): number => {
  return getCurrentTime() - startTime;
};



/**
 * Checks if the current time is better than the best time
 */
export const isNewBestTime = (currentTime: number, bestTime: number | null): boolean => {
  return bestTime === null || currentTime < bestTime;
};