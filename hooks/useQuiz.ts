import { useState, useCallback } from 'react';
import { quizService } from '@/services/QuizService';
import type { MusicalKey, MusicalDegree, QuizSession, QuizAnswer, QuizLevel } from '@/types';

interface UseQuizReturn {
  session: QuizSession | null;
  currentQuestion: ReturnType<typeof quizService.getCurrentQuestion>;
  progress: number;
  totalQuestions: number;
  correctAnswers: number;
  isComplete: boolean;
  startQuiz: (key: MusicalKey, level: QuizLevel | 'custom' | 'progressions', customDegrees?: MusicalDegree[]) => void;
  submitAnswer: (degree: MusicalDegree | string) => QuizAnswer;
  resetQuiz: () => void;
}

export function useQuiz(): UseQuizReturn {
  const [session, setSession] = useState<QuizSession | null>(null);

  const startQuiz = useCallback((key: MusicalKey, level: QuizLevel | 'custom' | 'progressions', customDegrees?: MusicalDegree[]) => {
    const newSession = quizService.createSession(key, level, customDegrees);
    setSession(newSession);
  }, []);

  const submitAnswer = useCallback((degree: MusicalDegree | string): QuizAnswer => {
    if (!session) {
      throw new Error('No active quiz session');
    }

    // Check if we're already at the end or have answered all questions
    if (session.currentQuestionIndex >= session.questions.length || session.answers.length >= session.questions.length) {
      throw new Error('No current question available');
    }

    const answer = quizService.submitAnswer(session, degree);
    const updatedSession: QuizSession = {
      ...session,
      answers: [...session.answers, answer],
      currentQuestionIndex: session.currentQuestionIndex + 1,
    };
    setSession(updatedSession);

    return answer;
  }, [session]);

  const resetQuiz = useCallback(() => {
    setSession(null);
  }, []);

  const currentQuestion = session ? quizService.getCurrentQuestion(session) : null;
  const progress = session ? quizService.getProgress(session) : 0;
  const totalQuestions = session ? quizService.getTotalQuestions(session) : 0;
  const correctAnswers = session ? quizService.getCorrectAnswersCount(session) : 0;
  const isComplete = session ? quizService.isComplete(session) : false;

  return {
    session,
    currentQuestion,
    progress,
    totalQuestions,
    correctAnswers,
    isComplete,
    startQuiz,
    submitAnswer,
    resetQuiz,
  };
}


