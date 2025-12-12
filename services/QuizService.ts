import type { MusicalKey, MusicalDegree, QuizQuestion, QuizAnswer, QuizSession, QuizLevel } from '@/types';
import { MUSICAL_DEGREES, QUIZ_LEVELS } from '@/constants/music';
import { QUIZ_QUESTIONS_COUNT } from '@/constants/music';
import { generateId } from '@/utils/id';
import { audioService } from './AudioService';

class QuizService {
  generateQuestions(
    key: MusicalKey,
    level: QuizLevel | 'custom',
    count: number = QUIZ_QUESTIONS_COUNT,
    customDegrees?: MusicalDegree[]
  ): QuizQuestion[] {
    const questions: QuizQuestion[] = [];

    // Determine allowed degrees and options count
    let allowedDegrees: MusicalDegree[];
    let optionsCount: number;

    if (level === 'custom' && customDegrees && customDegrees.length >= 3) {
      allowedDegrees = customDegrees;
      // If exactly 3 degrees, use 3 options; otherwise use 4
      optionsCount = customDegrees.length === 3 ? 3 : 4;
    } else {
      const levelConfig = QUIZ_LEVELS[level as QuizLevel];
      allowedDegrees = levelConfig.allowedDegrees;
      optionsCount = levelConfig.optionsCount;
    }

    let previousDegree: MusicalDegree | null = null;

    for (let i = 0; i < count; i++) {
      // Get available degrees (exclude the previous degree to avoid consecutive repetition)
      let availableDegreesForSelection: MusicalDegree[] = previousDegree
        ? allowedDegrees.filter(d => d !== previousDegree)
        : [...allowedDegrees]; // Create a copy to avoid mutation

      // If we don't have enough degrees (shouldn't happen, but safety check)
      // This can happen if there's only 1 allowed degree, which would be invalid
      if (availableDegreesForSelection.length === 0) {
        // Fallback: use all allowed degrees, but log a warning
        console.warn('No available degrees after filtering previous degree. Using all allowed degrees.');
        availableDegreesForSelection = [...allowedDegrees];
      }

      // Randomly select a degree from available degrees (correct answer)
      const randomIndex = Math.floor(Math.random() * availableDegreesForSelection.length);
      let correctDegree = availableDegreesForSelection[randomIndex];

      // Verify we didn't select the same degree as previous (safety check)
      if (previousDegree && correctDegree === previousDegree) {
        console.error(`Consecutive degree repetition detected: ${correctDegree} after ${previousDegree}`);
        // Try to select a different degree
        const alternativeDegrees: MusicalDegree[] = availableDegreesForSelection.filter(d => d !== correctDegree);
        if (alternativeDegrees.length > 0) {
          const altIndex = Math.floor(Math.random() * alternativeDegrees.length);
          correctDegree = alternativeDegrees[altIndex];
        } else {
          // Last resort: select any degree except previous
          const fallbackDegrees: MusicalDegree[] = allowedDegrees.filter(d => d !== previousDegree);
          if (fallbackDegrees.length > 0) {
            const fallbackIndex = Math.floor(Math.random() * fallbackDegrees.length);
            correctDegree = fallbackDegrees[fallbackIndex];
          }
        }
      }

      // Store as previous for next iteration
      previousDegree = correctDegree;

      // Generate wrong options (different from the correct one, only from allowed degrees)
      const wrongOptions: MusicalDegree[] = [];
      const availableDegrees = allowedDegrees.filter(d => d !== correctDegree);

      // Shuffle and pick wrong options (optionsCount - 1 wrong options)
      const shuffled = [...availableDegrees].sort(() => Math.random() - 0.5);
      wrongOptions.push(...shuffled.slice(0, optionsCount - 1));

      // Combine correct answer with wrong options and shuffle
      const allOptions = [correctDegree, ...wrongOptions];
      const shuffledOptions = [...allOptions].sort(() => Math.random() - 0.5);

      questions.push({
        id: generateId(),
        degree: correctDegree,
        audioUri: audioService.getAudioUri(key, correctDegree),
        options: shuffledOptions, // optionsCount options: 1 correct + (optionsCount - 1) wrong, shuffled
      });
    }

    // Verify no duplicate questions were generated (safety check)
    const questionIds = new Set(questions.map(q => q.id));
    if (questionIds.size !== questions.length) {
      console.error('Duplicate questions detected in generated questions!');
    }

    // Verify no consecutive duplicate degrees (safety check)
    for (let i = 1; i < questions.length; i++) {
      if (questions[i].degree === questions[i - 1].degree) {
        console.error(`Consecutive duplicate degree detected at questions ${i} and ${i + 1}: ${questions[i].degree}`);
      }
    }

    return questions;
  }

  createSession(key: MusicalKey, level: QuizLevel | 'custom', customDegrees?: MusicalDegree[]): QuizSession {
    const questions = this.generateQuestions(key, level, QUIZ_QUESTIONS_COUNT, customDegrees);

    const session: QuizSession = {
      id: generateId(),
      key,
      level,
      questions,
      answers: [],
      currentQuestionIndex: 0,
      startedAt: Date.now(),
    };

    if (level === 'custom' && customDegrees) {
      session.customDegrees = customDegrees;
    }

    return session;
  }

  submitAnswer(
    session: QuizSession,
    selectedDegree: MusicalDegree
  ): QuizAnswer {
    // Use the current question index, but ensure it's within bounds
    const questionIndex = session.currentQuestionIndex;

    if (questionIndex < 0 || questionIndex >= session.questions.length) {
      throw new Error('No current question available');
    }

    const currentQuestion = session.questions[questionIndex];

    if (!currentQuestion) {
      throw new Error('No current question available');
    }

    const isCorrect = currentQuestion.degree === selectedDegree;

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedDegree,
      correctDegree: currentQuestion.degree,
      isCorrect,
    };

    return answer;
  }

  isComplete(session: QuizSession): boolean {
    return session.answers.length === session.questions.length;
  }

  getCurrentQuestion(session: QuizSession): QuizQuestion | null {
    if (session.currentQuestionIndex >= session.questions.length) {
      return null;
    }
    return session.questions[session.currentQuestionIndex];
  }

  getProgress(session: QuizSession): number {
    return session.answers.length;
  }

  getTotalQuestions(session: QuizSession): number {
    return session.questions.length;
  }

  getCorrectAnswersCount(session: QuizSession): number {
    return session.answers.filter((answer) => answer.isCorrect).length;
  }
}

export const quizService = new QuizService();

