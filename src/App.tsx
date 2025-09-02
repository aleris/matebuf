import { useState, useEffect } from 'preact/hooks';
import type { GameState } from './types';
import { getStoredGems, addGem, getStoredGameState, saveGameState, clearGameState, getStoredBestTime, saveBestTime } from './utils/storage';
import { getRandomGem, generateQuestion } from './utils/game';
import { isNewBestTime, getCurrentTime, getElapsedTime } from './utils/timer';
import { StartScreen } from './components/StartScreen/StartScreen';
import { GameScreen } from './components/GameScreen/GameScreen';
import { EndScreen } from './components/EndScreen/EndScreen';
import styles from './App.module.scss'
import {useTranslation} from './hooks/useTranslation.ts'

const getInitialGameState = (): GameState => {
  const storedGameState = getStoredGameState();
  const persistentBestTime = getStoredBestTime();
  const defaultState: GameState = {
    currentScreen: 'start',
    currentQuestion: 1,
    totalQuestions: 10,
    gems: getStoredGems(),
    currentAnswer: '',
    lastAnswerCorrect: null,
    chestOpen: false,
    rewardGem: null,
    currentQuestionData: null,
    startTime: null,
    currentTime: 0,
    bestTime: persistentBestTime,
    isNewBestTime: false,
  };

  // If there's a saved game state, restore it
  if (storedGameState) {
    if (storedGameState.currentScreen === 'game' && storedGameState.currentQuestion) {
      // Restore in-progress game
      return {
        ...defaultState,
        ...storedGameState,
        gems: getStoredGems(), // Always use the latest gems
      };
    } else if (storedGameState.currentScreen === 'end' && storedGameState.currentTime !== undefined) {
      // Restore end screen with saved time and reward gem
      return {
        ...defaultState,
        ...storedGameState,
        gems: getStoredGems(), // Always use the latest gems
      };
    }
  }

  return defaultState;
};

export function App() {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<GameState>(getInitialGameState);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    // Save if we're in the middle of a game or on the end screen
    if (gameState.currentScreen === 'game') {
      saveGameState({
        currentScreen: gameState.currentScreen,
        currentQuestion: gameState.currentQuestion,
        totalQuestions: gameState.totalQuestions,
        currentQuestionData: gameState.currentQuestionData,
        startTime: gameState.startTime,
      });
    } else if (gameState.currentScreen === 'end') {
      // Save end screen state including current time and reward gem
      saveGameState({
        currentScreen: gameState.currentScreen,
        currentTime: gameState.currentTime,
        bestTime: gameState.bestTime,
        startTime: gameState.startTime,
        chestOpen: gameState.chestOpen,
        rewardGem: gameState.rewardGem,
        isNewBestTime: gameState.isNewBestTime,
      });
    } else if (gameState.currentScreen === 'start') {
      // Clear saved game state when returning to start screen
      clearGameState();
    }
  }, [gameState.currentScreen, gameState.currentQuestion, gameState.totalQuestions, gameState.currentQuestionData, gameState.currentTime, gameState.bestTime, gameState.startTime, gameState.chestOpen, gameState.rewardGem, gameState.isNewBestTime]);

  const handleStartGame = () => {
    const firstQuestion = generateQuestion();
    const startTime = getCurrentTime();
    setGameState(prev => ({
      ...prev,
      currentScreen: 'game',
      currentQuestion: 1,
      currentAnswer: '',
      lastAnswerCorrect: null,
      currentQuestionData: firstQuestion,
      startTime,
      currentTime: 0,
    }));
  };

  const handleAnswerSubmit = (correct: boolean) => {
    setGameState(prev => ({
      ...prev,
      lastAnswerCorrect: correct,
    }));
  };

  const handleNextQuestion = () => {
    const nextQuestion = generateQuestion();
    setGameState(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      currentAnswer: '',
      lastAnswerCorrect: null,
      currentQuestionData: nextQuestion,
    }));
  };

  const handleGameComplete = () => {
    const currentTime = gameState.startTime ? getElapsedTime(gameState.startTime) : 0;
    const isNewBest = isNewBestTime(currentTime, gameState.bestTime);
    
    // Save new best time to persistent storage if it's a new record
    if (isNewBest) {
      saveBestTime(currentTime);
    }
    
    setGameState(prev => ({
      ...prev,
      currentScreen: 'end',
      currentTime,
      bestTime: isNewBest ? currentTime : prev.bestTime,
      isNewBestTime: isNewBest,
      chestOpen: false,
      rewardGem: null,
    }));
  };

  const handleChestClick = () => {
    const rewardGem = getRandomGem();
    setGameState(prev => ({
      ...prev,
      chestOpen: true,
      rewardGem,
    }));
  };

  const handleGrabGem = () => {
    if (gameState.rewardGem) {
      const newGems = addGem(gameState.rewardGem, gameState.gems);
      setGameState(prev => ({
        ...prev,
        gems: newGems,
        currentScreen: 'start',
        currentQuestion: 1,
        currentAnswer: '',
        lastAnswerCorrect: null,
        chestOpen: false,
        rewardGem: null,
        currentQuestionData: null,
        startTime: null,
        currentTime: 0,
        bestTime: null,
        isNewBestTime: false,
      }));
    }
  };

  const handleCloseGame = () => {
    if (confirm(t('Are you sure you want to quit?'))) {
      setGameState(prev => ({
        ...prev,
        currentScreen: 'start',
        currentQuestion: 1,
        currentAnswer: '',
        lastAnswerCorrect: null,
        chestOpen: false,
        rewardGem: null,
        currentQuestionData: null,
        startTime: null,
        currentTime: 0,
        bestTime: null,
        isNewBestTime: false,
      }));
    }
  };

  return (
    <div class={styles.App}>
      {gameState.currentScreen === 'game' && (
        <button
          className={styles.closeButton}
          onClick={handleCloseGame}
          title={t('Close')}
          aria-label={t('Close')}
        />
      )}

      {gameState.currentScreen === 'start' && (
        <StartScreen 
          gems={gameState.gems} 
          bestTime={getStoredBestTime()}
          onStart={handleStartGame} 
        />
      )}
      
      {gameState.currentScreen === 'game' && (
        <GameScreen
          currentQuestion={gameState.currentQuestion}
          totalQuestions={gameState.totalQuestions}
          currentQuestionData={gameState.currentQuestionData}
          startTime={gameState.startTime}
          onAnswerSubmit={handleAnswerSubmit}
          onNextQuestion={handleNextQuestion}
          onGameComplete={handleGameComplete}
        />
      )}
      
      {gameState.currentScreen === 'end' && (
        <EndScreen
          chestOpen={gameState.chestOpen}
          rewardGem={gameState.rewardGem}
          currentTime={gameState.currentTime}
          isNewBestTime={gameState.isNewBestTime}
          onChestClick={handleChestClick}
          onGrabGem={handleGrabGem}
        />
      )}
    </div>
  );
}
