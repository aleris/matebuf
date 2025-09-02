export type GemType = 'ruby_small' | 'topaz_small' | 'sapphire_small';

export interface GemCount {
  ruby_small: number;
  topaz_small: number;
  sapphire_small: number;
}

export interface GameState {
  currentScreen: 'start' | 'game' | 'end';
  currentQuestion: number;
  totalQuestions: number;
  gems: GemCount;
  currentAnswer: string;
  lastAnswerCorrect: boolean | null;
  chestOpen: boolean;
  rewardGem: GemType | null;
  currentQuestionData: MultiplicationQuestion | null;
  startTime: number | null;
  currentTime: number;
  bestTime: number | null;
  isNewBestTime: boolean;
}

export interface MultiplicationQuestion {
  num1: number;
  num2: number;
  answer: number;
}