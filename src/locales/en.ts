export const en = {
  // Start Screen
  'Mate Buf': 'Mate Buf',
  'Gems Collected': 'Gems Collected',
  'Best Time': 'Best Time',
  'Start Game': 'Start Game',
  
  // Game Screen
  'Question': 'Question',
  'of': 'of',
  'Submit Answer': 'Submit Answer',
  'Answer': 'Answer',
  'Correct!': 'Correct!',
  'Try again!': 'Try again!',
  'Not quite!': 'Not quite!',
  'Next Question': 'Next Question',
  'Finish Game': 'Finish Game',
  'Try Again': 'Try Again',
  'Are you sure you want to quit?': 'Are you sure you want to quit?',
  
  // End Screen
  'Congratulations!': 'Congratulations!',
  'You completed the game!': 'You completed the game!',
  'Your Time': 'Your Time',
  'New Best Time!': 'New Best Time!',
  'Congratulations on your new record!': 'Congratulations on your new record!',
  'Click the chest to get your reward!': 'Click the chest to get your reward!',
  'You found a ': 'You found a ',
  'Grab Gem': 'Grab Gem',
  
  // Gem names
  'Ruby': 'Ruby',
  'Topaz': 'Topaz',
  'Sapphire': 'Sapphire',
  
  // Common
  'Loading...': 'Loading...',
  'Close': 'Close',
} as const;

export type TranslationKeys = keyof typeof en;
