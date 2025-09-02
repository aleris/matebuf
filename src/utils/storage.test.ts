import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getStoredGameState, 
  saveGameState, 
  clearGameState,
  getStoredGems,
  saveGems,
  addGem,
  getStoredBestTime,
  saveBestTime
} from './storage';
import type { GameState, GemCount } from '../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Storage Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Game State Persistence', () => {
    it('should save and retrieve game state', () => {
      const gameState: Partial<GameState> = {
        currentScreen: 'game',
        currentQuestion: 3,
        totalQuestions: 10,
      };

      saveGameState(gameState);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'matebuf_game_state',
        JSON.stringify(gameState)
      );

      localStorageMock.getItem.mockReturnValue(JSON.stringify(gameState));
      const retrieved = getStoredGameState();
      expect(retrieved).toEqual(gameState);
    });

    it('should save and retrieve game state with question data', () => {
      const gameState: Partial<GameState> = {
        currentScreen: 'game',
        currentQuestion: 3,
        totalQuestions: 10,
        currentQuestionData: {
          num1: 7,
          num2: 8,
          answer: 56,
        },
      };

      saveGameState(gameState);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'matebuf_game_state',
        JSON.stringify(gameState)
      );

      localStorageMock.getItem.mockReturnValue(JSON.stringify(gameState));
      const retrieved = getStoredGameState();
      expect(retrieved).toEqual(gameState);
      expect(retrieved?.currentQuestionData).toEqual({
        num1: 7,
        num2: 8,
        answer: 56,
      });
    });

    it('should return null when no game state is stored', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const result = getStoredGameState();
      expect(result).toBeNull();
    });

    it('should clear game state', () => {
      clearGameState();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('matebuf_game_state');
    });

    it('should handle JSON parse errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      const result = getStoredGameState();
      expect(result).toBeNull();
    });

    it('should save and restore end screen state with timer and reward gem', () => {
      const endGameState = {
        currentScreen: 'end' as const,
        currentTime: 45000, // 45 seconds
        bestTime: 30000, // 30 seconds
        startTime: Date.now() - 45000,
        chestOpen: true,
        rewardGem: 'ruby_small' as const,
        isNewBestTime: false,
      };

      saveGameState(endGameState);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'matebuf_game_state',
        JSON.stringify(endGameState)
      );

      localStorageMock.getItem.mockReturnValue(JSON.stringify(endGameState));
      const restored = getStoredGameState();
      expect(restored).toEqual(endGameState);
    });
  });

  describe('Gems Persistence', () => {
    it('should save and retrieve gems', () => {
      const gems: GemCount = {
        ruby_small: 2,
        topaz_small: 1,
        sapphire_small: 3,
      };

      saveGems(gems);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'matebuf_gems',
        JSON.stringify(gems)
      );

      localStorageMock.getItem.mockReturnValue(JSON.stringify(gems));
      const retrieved = getStoredGems();
      expect(retrieved).toEqual(gems);
    });

    it('should return default gems when none are stored', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const result = getStoredGems();
      expect(result).toEqual({
        ruby_small: 0,
        topaz_small: 0,
        sapphire_small: 0,
      });
    });

    it('should add a gem and save it', () => {
      const initialGems: GemCount = {
        ruby_small: 1,
        topaz_small: 0,
        sapphire_small: 0,
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(initialGems));
      
      const newGems = addGem('ruby_small', initialGems);
      expect(newGems.ruby_small).toBe(2);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'matebuf_gems',
        JSON.stringify(newGems)
      );
    });
  });

  describe('Best Time Persistence', () => {
    it('should save and retrieve best time', () => {
      const bestTime = 25000; // 25 seconds

      saveBestTime(bestTime);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'matebuf_best_time',
        JSON.stringify(bestTime)
      );

      localStorageMock.getItem.mockReturnValue(JSON.stringify(bestTime));
      const retrieved = getStoredBestTime();
      expect(retrieved).toBe(bestTime);
    });

    it('should return null when no best time is stored', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const result = getStoredBestTime();
      expect(result).toBeNull();
    });

    it('should handle invalid stored data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('"invalid"');
      const result = getStoredBestTime();
      expect(result).toBeNull();
    });

    it('should handle JSON parse errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      const result = getStoredBestTime();
      expect(result).toBeNull();
    });
  });
});