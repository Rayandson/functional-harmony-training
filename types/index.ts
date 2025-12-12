export type MusicalDegree = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII';

export type MusicalKey = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export interface User {
  id: string;
  name: string;
  createdAt: number;
}

export type QuizLevel = 1 | 2 | 3 | 4 | 5;

export interface QuizQuestion {
  id: string;
  degree: MusicalDegree;
  audioUri: string;
  options: MusicalDegree[];
}

export interface QuizAnswer {
  questionId: string;
  selectedDegree: MusicalDegree;
  correctDegree: MusicalDegree;
  isCorrect: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  answers: QuizAnswer[];
  completedAt: number;
}

export interface QuizSession {
  id: string;
  key: MusicalKey;
  level: QuizLevel | 'custom';
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  currentQuestionIndex: number;
  startedAt: number;
  customDegrees?: MusicalDegree[]; // Only set when level is 'custom'
}

export type QuizMode = 'train-degrees';
