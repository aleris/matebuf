import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { App } from './App';

// Mock the components
vi.mock('./components/StartScreen/StartScreen', () => ({
  StartScreen: ({ gems, onStart }: any) => (
    <div data-testid="start-screen">
      <div>Gems: {gems.ruby_small}, {gems.topaz_small}, {gems.sapphire_small}</div>
      <button onClick={onStart}>Start Game</button>
    </div>
  ),
}));

vi.mock('./components/GameScreen/GameScreen', () => ({
  GameScreen: ({ currentQuestion, totalQuestions }: any) => (
    <div data-testid="game-screen">
      <div>Question {currentQuestion} of {totalQuestions}</div>
    </div>
  ),
}));

vi.mock('./components/EndScreen/EndScreen', () => ({
  EndScreen: ({ chestOpen, rewardGem, onChestClick, onGrabGem }: any) => (
    <div data-testid="end-screen">
      <div>Chest Open: {chestOpen ? 'Yes' : 'No'}</div>
      <div>Reward Gem: {rewardGem || 'None'}</div>
      <button onClick={onChestClick}>Open Chest</button>
      <button onClick={onGrabGem}>Grab Gem</button>
    </div>
  ),
}));

// Mock the storage utilities
vi.mock('./utils/storage', () => ({
  getStoredGems: vi.fn(() => ({ ruby_small: 0, topaz_small: 0, sapphire_small: 0 })),
  addGem: vi.fn((gemType, gems) => ({ ...gems, [gemType]: gems[gemType] + 1 })),
  getStoredGameState: vi.fn(() => null),
  saveGameState: vi.fn(),
  clearGameState: vi.fn(),
  getStoredBestTime: vi.fn(() => null),
  saveBestTime: vi.fn(),
}));

// Mock the game utilities
vi.mock('./utils/game', () => ({
  getRandomGem: vi.fn(() => 'ruby_small'),
  generateQuestion: vi.fn(() => ({ num1: 3, num2: 4, answer: 12 })),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm to always return true
    window.confirm = vi.fn(() => true);
  });

  it('renders start screen initially', () => {
    render(<App />);
    
    expect(screen.getByTestId('start-screen')).toBeInTheDocument();
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  it('shows game screen when start game is clicked', async () => {
    render(<App />);
    
    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('game-screen')).toBeInTheDocument();
      expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
    });
  });

  it('shows close button on game screen', async () => {
    render(<App />);
    
    // Start the game
    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('game-screen')).toBeInTheDocument();
    });
    
    // Check that close button is present (it's in the App component, not GameScreen)
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('returns to start screen when close button is clicked', async () => {
    render(<App />);
    
    // Start the game
    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('game-screen')).toBeInTheDocument();
    });
    
    // Click close button (it's in the App component)
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Should return to start screen
    await waitFor(() => {
      expect(screen.getByTestId('start-screen')).toBeInTheDocument();
      expect(screen.queryByTestId('game-screen')).not.toBeInTheDocument();
    });
  });

  it('preserves gems when closing game', async () => {
    render(<App />);
    
    // Start the game
    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('game-screen')).toBeInTheDocument();
    });
    
    // Click close button (it's in the App component)
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Should return to start screen with gems preserved
    await waitFor(() => {
      expect(screen.getByTestId('start-screen')).toBeInTheDocument();
      expect(screen.getByText('Gems: 0, 0, 0')).toBeInTheDocument();
    });
  });

  it('resets game state when closing game', async () => {
    render(<App />);
    
    // Start the game
    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('game-screen')).toBeInTheDocument();
      expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
    });
    
    // Click close button (it's in the App component)
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Start game again - should be back to question 1
    await waitFor(() => {
      expect(screen.getByTestId('start-screen')).toBeInTheDocument();
    });
    
    const startButtonAgain = screen.getByText('Start Game');
    fireEvent.click(startButtonAgain);
    
    await waitFor(() => {
      expect(screen.getByTestId('game-screen')).toBeInTheDocument();
      expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
    });
  });

  it('calls clearGameState when returning to start screen', async () => {
    const { clearGameState } = await import('./utils/storage');
    
    render(<App />);
    
    // Start the game
    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('game-screen')).toBeInTheDocument();
    });
    
    // Click close button (it's in the App component)
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Should call clearGameState
    await waitFor(() => {
      expect(clearGameState).toHaveBeenCalled();
    });
  });
});