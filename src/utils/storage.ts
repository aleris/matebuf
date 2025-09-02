import type { GemCount, GameState } from '../types';

const GEMS_STORAGE_KEY = 'matebuf_gems';
const GAME_STATE_STORAGE_KEY = 'matebuf_game_state';
const BEST_TIME_STORAGE_KEY = 'matebuf_best_time';

export const getStoredGems = (): GemCount => {
  try {
    const stored = localStorage.getItem(GEMS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading gems from storage:', error);
  }
  
  return {
    ruby_small: 0,
    topaz_small: 0,
    sapphire_small: 0,
  };
};

export const saveGems = (gems: GemCount): void => {
  try {
    localStorage.setItem(GEMS_STORAGE_KEY, JSON.stringify(gems));
  } catch (error) {
    console.error('Error saving gems to storage:', error);
  }
};

export const addGem = (gemType: keyof GemCount, gems: GemCount): GemCount => {
  const newGems = { ...gems, [gemType]: gems[gemType] + 1 };
  saveGems(newGems);
  return newGems;
};

export const getStoredGameState = (): Partial<GameState> | null => {
  try {
    const stored = localStorage.getItem(GAME_STATE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading game state from storage:', error);
  }
  return null;
};

export const saveGameState = (gameState: Partial<GameState>): void => {
  try {
    localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.error('Error saving game state to storage:', error);
  }
};

export const clearGameState = (): void => {
  try {
    localStorage.removeItem(GAME_STATE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing game state from storage:', error);
  }
};

export const getStoredBestTime = (): number | null => {
  try {
    const stored = localStorage.getItem(BEST_TIME_STORAGE_KEY);
    if (stored) {
      const time = JSON.parse(stored);
      return typeof time === 'number' ? time : null;
    }
  } catch (error) {
    console.error('Error loading best time from storage:', error);
  }
  return null;
};

export const saveBestTime = (bestTime: number): void => {
  try {
    localStorage.setItem(BEST_TIME_STORAGE_KEY, JSON.stringify(bestTime));
  } catch (error) {
    console.error('Error saving best time to storage:', error);
  }
};