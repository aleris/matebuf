import {useState, useEffect, useRef} from 'preact/hooks'
import type { MultiplicationQuestion } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { Timer } from '../Timer/Timer';
import owlHappy from '../../assets/owl_happy.png';
import owlSad from '../../assets/owl_sad.png';
import styles from './GameScreen.module.scss';

interface GameScreenProps {
  currentQuestion: number;
  totalQuestions: number;
  currentQuestionData: MultiplicationQuestion | null;
  startTime: number | null;
  onAnswerSubmit: (correct: boolean) => void;
  onNextQuestion: () => void;
  onGameComplete: () => void;
}

export const GameScreen = ({ 
  currentQuestion, 
  totalQuestions, 
  currentQuestionData,
  startTime,
  onAnswerSubmit, 
  onNextQuestion,
  onGameComplete,
}: GameScreenProps) => {
  const { t } = useTranslation();
  const [question, setQuestion] = useState<MultiplicationQuestion | null>(currentQuestionData);
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const tryAgainButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (currentQuestion <= totalQuestions) {
      setQuestion(currentQuestionData);
      setAnswer('');
      setShowResult(false);
      setIsCorrect(null);
    } else {
      onGameComplete();
    }
  }, [currentQuestion, totalQuestions, currentQuestionData, onGameComplete]);

  useEffect(() => {
    setTimeout(() => {
      const buttonRef = isCorrect ? nextButtonRef : tryAgainButtonRef;
      buttonRef?.current?.focus();
    }, 10)
  }, [showResult, isCorrect])

  const handleSubmit = () => {
    if (!question || !answer.trim()) return;
    if (!/^\d+$/.test(answer.trim())) return;
    
    const userAnswer = parseInt(answer.trim());
    const correct = userAnswer === question.answer;
    
    setIsCorrect(correct);
    setShowResult(true);
    // Don't call onAnswerSubmit here - only call it when user proceeds to next question
  };

  const handleNext = () => {
    // Only call onAnswerSubmit when user actually proceeds to next question
    if (isCorrect !== null) {
      onAnswerSubmit(isCorrect);
    }
    onNextQuestion();
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 10)
  };

  const handleTryAgain = () => {
    setAnswer('');
    setShowResult(false);
    setIsCorrect(null);
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 10)
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showResult) {
        handleNext();
      } else {
        handleSubmit();
      }
    }
  };

  if (!question) return null;

  const progress = ((currentQuestion - 1) / totalQuestions) * 100;

  const isAnswerFilled = answer.trim() !== '';

  return (
    <div className={styles.container}>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className={styles.progressInfo}>
          <div className={styles.progressText}>
            {t('Question')} {currentQuestion} {t('of')} {totalQuestions}
          </div>
          <Timer startTime={startTime} isRunning={true} />
        </div>
      </div>

      {!showResult ? (
        <div className={styles.questionContainer}>
          <h2 className={styles.question}>
            {question.num1} × {question.num2} =
          </h2>
          
          <div className={styles.inputContainer}>
            <input
              ref={inputRef}
              type="number"
              value={answer}
              onInput={(e) => setAnswer((e.target as HTMLInputElement).value)}
              onKeyPress={handleKeyPress}
              className={styles.answerInput}
              placeholder={t('Answer')}
              autoFocus
            />
          </div>
          
          <button 
            className={styles.submitButton} 
            onClick={handleSubmit}
            disabled={!isAnswerFilled}
          >
{t('Submit Answer')}
          </button>
        </div>
      ) : (
        <div className={styles.resultContainer}>
          <div className={styles.owlContainer}>
            <img 
              src={isCorrect ? owlHappy : owlSad} 
              alt={isCorrect ? "Happy Owl" : "Sad Owl"} 
              className={styles.owl}
            />
          </div>
          
          <div className={styles.resultText}>
            {isCorrect ? (
              <div>
                <h2 className={styles.correct}>{t('Correct!')}</h2>
                <p className={styles.answerText}>
                  {question.num1} × {question.num2} = {question.answer}
                </p>
              </div>
            ) : (
              <div>
                <h2 className={styles.incorrect}>{t('Not quite!')}</h2>
                <p className={styles.answerText}>
                  {t('Try again!')}
                </p>
              </div>
            )}
          </div>
          
          {isCorrect ? (
            <button ref={nextButtonRef} className={styles.nextButton} onClick={handleNext}>
{currentQuestion < totalQuestions ? t('Next Question') : t('Finish Game')}
            </button>
          ) : (
            <button ref={tryAgainButtonRef} className={styles.tryAgainButton} onClick={handleTryAgain}>
{t('Try Again')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
