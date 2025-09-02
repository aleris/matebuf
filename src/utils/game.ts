import type { MultiplicationQuestion, GemType } from '../types';

export const generateQuestion = (): MultiplicationQuestion => {
  const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
  const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
  return {
    num1,
    num2,
    answer: num1 * num2,
  };
};

export const getRandomGem = (): GemType => {
  const gems: GemType[] = ['ruby_small', 'topaz_small', 'sapphire_small'];
  return gems[Math.floor(Math.random() * gems.length)];
};