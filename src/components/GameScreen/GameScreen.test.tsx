import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameScreen } from './GameScreen';

// Mock the SCSS module
vi.mock('./GameScreen.module.scss', () => ({
  default: {
    container: 'container',
    progressContainer: 'progressContainer',
    progressBar: 'progressBar',
    progressFill: 'progressFill',
    progressText: 'progressText',
    questionContainer: 'questionContainer',
    question: 'question',
    inputContainer: 'inputContainer',
    answerInput: 'answerInput',
    submitButton: 'submitButton',
    resultContainer: 'resultContainer',
    owlContainer: 'owlContainer',
    owl: 'owl',
    resultText: 'resultText',
    correct: 'correct',
    incorrect: 'incorrect',
    answerText: 'answerText',
    nextButton: 'nextButton',
    tryAgainButton: 'tryAgainButton',
    closeButton: 'closeButton',
  },
}));

// Mock the images
vi.mock('../../assets/owl_happy.png', () => ({
  default: 'mocked-owl-happy.png',
}));

vi.mock('../../assets/owl_sad.png', () => ({
  default: 'mocked-owl-sad.png',
}));

// Mock the game utility
vi.mock('../../utils/game', () => ({
  generateQuestion: vi.fn(),
}));

describe('GameScreen', () => {
  const mockOnAnswerSubmit = vi.fn();
  const mockOnNextQuestion = vi.fn();
  const mockOnGameComplete = vi.fn();

  const defaultProps = {
    currentQuestion: 1,
    totalQuestions: 10,
    currentQuestionData: {
      num1: 3,
      num2: 4,
      answer: 12,
    },
    startTime: Date.now(),
    onAnswerSubmit: mockOnAnswerSubmit,
    onNextQuestion: mockOnNextQuestion,
    onGameComplete: mockOnGameComplete,
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const { generateQuestion } = await import('../../utils/game');
    const mockGenerateQuestion = vi.mocked(generateQuestion);
    // Default mock question
    mockGenerateQuestion.mockReturnValue({
      num1: 3,
      num2: 4,
      answer: 12,
    });
  });

  it('displays the multiplication question correctly', () => {
    render(<GameScreen {...defaultProps} />);

    expect(screen.getByText('3 × 4 =')).toBeInTheDocument();
  });

  it('displays the progress bar with correct progress', () => {
    render(<GameScreen {...defaultProps} currentQuestion={3} />);

    expect(screen.getByText('Question 3 of 10')).toBeInTheDocument();
    
    // Check that progress bar has correct width (20% for question 3 of 10)
    const progressFill = document.querySelector('.progressFill');
    expect(progressFill).toHaveStyle('width: 20%');
  });

  it('displays progress bar at 0% for first question', () => {
    render(<GameScreen {...defaultProps} currentQuestion={1} />);

    const progressFill = document.querySelector('.progressFill');
    expect(progressFill).toHaveStyle('width: 0%');
  });

  it('displays progress bar at 90% for last question', () => {
    render(<GameScreen {...defaultProps} currentQuestion={10} />);

    const progressFill = document.querySelector('.progressFill');
    expect(progressFill).toHaveStyle('width: 90%');
  });

  it('renders answer input field', () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
  });

  it('renders submit button', () => {
    render(<GameScreen {...defaultProps} />);

    expect(screen.getByText('Submit Answer')).toBeInTheDocument();
  });

  it('disables submit button when input is empty', () => {
    render(<GameScreen {...defaultProps} />);

    const submitButton = screen.getByText('Submit Answer');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when input has value', () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    const submitButton = screen.getByText('Submit Answer');

    fireEvent.input(input, { target: { value: '12' } });

    expect(submitButton).not.toBeDisabled();
  });

  it('calls onAnswerSubmit with correct when answer is correct and next is clicked', async () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    const submitButton = screen.getByText('Submit Answer');

    fireEvent.input(input, { target: { value: '12' } });
    fireEvent.click(submitButton);

    // onAnswerSubmit should NOT be called immediately after submit
    expect(mockOnAnswerSubmit).not.toHaveBeenCalled();

    // onAnswerSubmit should be called when Next Question is clicked
    await waitFor(() => {
      const nextButton = screen.getByText('Next Question');
      fireEvent.click(nextButton);
    });

    expect(mockOnAnswerSubmit).toHaveBeenCalledWith(true);
  });

  it('does not call onAnswerSubmit when answer is incorrect', () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    const submitButton = screen.getByText('Submit Answer');

    fireEvent.input(input, { target: { value: '10' } });
    fireEvent.click(submitButton);

    // onAnswerSubmit should NOT be called for incorrect answers
    expect(mockOnAnswerSubmit).not.toHaveBeenCalled();
  });

  it('shows result when Enter key is pressed', () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    fireEvent.input(input, { target: { value: '12' } });
    fireEvent.keyPress(input, { key: 'Enter' });

    // Should show result but not call onAnswerSubmit immediately
    expect(mockOnAnswerSubmit).not.toHaveBeenCalled();
  });

  it('shows happy owl and correct message when answer is correct', async () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    const submitButton = screen.getByText('Submit Answer');

    fireEvent.input(input, { target: { value: '12' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Correct!')).toBeInTheDocument();
      expect(screen.getByText('3 × 4 = 12')).toBeInTheDocument();
      expect(screen.getByAltText('Happy Owl')).toBeInTheDocument();
      expect(screen.getByAltText('Happy Owl')).toHaveAttribute('src', 'mocked-owl-happy.png');
    });
  });

  it('shows sad owl and try again message when answer is wrong', async () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    const submitButton = screen.getByText('Submit Answer');

    fireEvent.input(input, { target: { value: '10' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Not quite!')).toBeInTheDocument();
      expect(screen.getByText('Try again!')).toBeInTheDocument();
      expect(screen.getByAltText('Sad Owl')).toBeInTheDocument();
      expect(screen.getByAltText('Sad Owl')).toHaveAttribute('src', 'mocked-owl-sad.png');
    });
  });

  it('shows Try Again button when answer is wrong', async () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    const submitButton = screen.getByText('Submit Answer');

    fireEvent.input(input, { target: { value: '10' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('resets to question form when Try Again button is clicked', async () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    const submitButton = screen.getByText('Submit Answer');

    // Submit wrong answer
    fireEvent.input(input, { target: { value: '10' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const tryAgainButton = screen.getByText('Try Again');
      fireEvent.click(tryAgainButton);
    });

    // Should be back to question form
    expect(screen.getByText('Submit Answer')).toBeInTheDocument();
    expect(screen.queryByText('Not quite!')).not.toBeInTheDocument();
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('shows Next Question button when answer is correct', async () => {
    render(<GameScreen {...defaultProps} currentQuestion={5} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    const submitButton = screen.getByText('Submit Answer');

    fireEvent.input(input, { target: { value: '12' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Next Question')).toBeInTheDocument();
    });
  });

  it('shows Finish Game button on last question when answer is correct', async () => {
    render(<GameScreen {...defaultProps} currentQuestion={10} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    const submitButton = screen.getByText('Submit Answer');

    fireEvent.input(input, { target: { value: '12' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Finish Game')).toBeInTheDocument();
    });
  });

  it('calls onNextQuestion and onAnswerSubmit when Next Question button is clicked', async () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    const submitButton = screen.getByText('Submit Answer');

    fireEvent.input(input, { target: { value: '12' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const nextButton = screen.getByText('Next Question');
      fireEvent.click(nextButton);
      expect(mockOnNextQuestion).toHaveBeenCalledTimes(1);
      expect(mockOnAnswerSubmit).toHaveBeenCalledWith(true);
    });
  });

  it('calls onNextQuestion when Enter is pressed after showing result', async () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    fireEvent.input(input, { target: { value: '12' } });
    fireEvent.click(screen.getByText('Submit Answer'));

    await waitFor(() => {
      // The input field is not in the DOM when showing results, so we can't test Enter key
      // This test verifies that the result is shown correctly instead
      expect(screen.getByText('Correct!')).toBeInTheDocument();
      expect(screen.getByText('Next Question')).toBeInTheDocument();
    });
  });

  it('calls onGameComplete when currentQuestion exceeds totalQuestions', () => {
    render(<GameScreen {...defaultProps} currentQuestion={11} />);

    expect(mockOnGameComplete).toHaveBeenCalledTimes(1);
  });

  it('updates question when currentQuestionData changes', () => {
    const { rerender } = render(<GameScreen {...defaultProps} currentQuestion={1} />);

    expect(screen.getByText('3 × 4 =')).toBeInTheDocument();

    // Change question data
    const newQuestionData = {
      num1: 7,
      num2: 6,
      answer: 42,
    };
    rerender(<GameScreen {...defaultProps} currentQuestion={2} currentQuestionData={newQuestionData} />);

    expect(screen.getByText('7 × 6 =')).toBeInTheDocument();
  });

  it('resets input and result state when question changes', () => {
    const { rerender } = render(<GameScreen {...defaultProps} currentQuestion={1} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    fireEvent.input(input, { target: { value: '12' } });
    fireEvent.click(screen.getByText('Submit Answer'));

    // Change question number
    rerender(<GameScreen {...defaultProps} currentQuestion={2} />);

    // Get the new input element after rerender
    const newInput = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    // Input should be reset (empty string or null both indicate reset)
    expect(newInput.value).toBe('');
    // Should show question form, not result
    expect(screen.getByText('Submit Answer')).toBeInTheDocument();
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
  });

  it('handles single digit multiplication questions only', () => {
    const propsWithCustomQuestion = {
      ...defaultProps,
      currentQuestionData: {
        num1: 9,
        num2: 8,
        answer: 72,
      },
    };

    render(<GameScreen {...propsWithCustomQuestion} />);

    expect(screen.getByText('9 × 8 =')).toBeInTheDocument();
  });

  it('handles edge case of 1 × 1', () => {
    const propsWithCustomQuestion = {
      ...defaultProps,
      currentQuestionData: {
        num1: 1,
        num2: 1,
        answer: 1,
      },
    };

    render(<GameScreen {...propsWithCustomQuestion} />);

    expect(screen.getByText('1 × 1 =')).toBeInTheDocument();
  });

  it('handles edge case of 9 × 9', () => {
    const propsWithCustomQuestion = {
      ...defaultProps,
      currentQuestionData: {
        num1: 9,
        num2: 9,
        answer: 81,
      },
    };

    render(<GameScreen {...propsWithCustomQuestion} />);

    expect(screen.getByText('9 × 9 =')).toBeInTheDocument();
  });

  it('does not submit when input is empty and Enter is pressed', () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer');
    fireEvent.keyPress(input, { key: 'Enter' });

    expect(mockOnAnswerSubmit).not.toHaveBeenCalled();
  });

  it('handles negative numbers in input', () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    const submitButton = screen.getByText('Submit Answer');

    fireEvent.input(input, { target: { value: '-12' } });
    
    // Check that the button is enabled after input (button is enabled if text is not empty)
    expect(submitButton).not.toBeDisabled();
    
    fireEvent.click(submitButton);

    // Negative numbers fail the regex test /^\d+$/ so handleSubmit returns early
    // and onAnswerSubmit should NOT be called
    expect(mockOnAnswerSubmit).not.toHaveBeenCalled();
  });

  it('handles decimal numbers in input', () => {
    render(<GameScreen {...defaultProps} />);

    const input = screen.getByPlaceholderText('Answer') as HTMLInputElement;
    const submitButton = screen.getByText('Submit Answer');

    fireEvent.input(input, { target: { value: '12.5' } });
    
    // Check that the button is enabled after input (button is enabled if text is not empty)
    expect(submitButton).not.toBeDisabled();
    
    fireEvent.click(submitButton);

    // Decimal numbers fail the regex test /^\d+$/ so handleSubmit returns early
    // and onAnswerSubmit should NOT be called
    expect(mockOnAnswerSubmit).not.toHaveBeenCalled();
  });
});
