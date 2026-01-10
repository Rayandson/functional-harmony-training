import type { MusicalDegree, MusicalKey, QuizLevel } from '@/types';

export const MUSICAL_DEGREES: MusicalDegree[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export const MUSICAL_KEYS: MusicalKey[] = ['C', 'G'];

export const DEGREE_NAMES: Record<MusicalDegree, string> = {
  I: '(1° grau)',
  II: '(2° grau)',
  III: '(3° grau)',
  IV: '(4° grau)',
  V: '(5° grau)',
  VI: '(6° grau)',
  VII: '(7° grau)',
};

export const ROMAN_TO_NATURAL: Record<string, string> = {
  'I': '1',
  'II': '2',
  'III': '3',
  'IV': '4',
  'V': '5',
  'VI': '6',
  'VII': '7',
};

export const KEY_NAMES: Record<MusicalKey, string> = {
  C: 'Dó Maior',
  'C#': 'Dó# Maior',
  D: 'Ré Maior',
  'D#': 'Ré# Maior',
  E: 'Mi Maior',
  F: 'Fá Maior',
  'F#': 'Fá# Maior',
  G: 'Sol Maior',
  'G#': 'Sol# Maior',
  A: 'Lá Maior',
  'A#': 'Lá# Maior',
  B: 'Si Maior',
};

export const KEY_CHORDS: Record<string, Record<MusicalDegree, string>> = {
  'C': {
    'I': 'C',
    'II': 'Dm',
    'III': 'Em',
    'IV': 'F',
    'V': 'G',
    'VI': 'Am',
    'VII': 'Bø',
  },
  'G': {
    'I': 'G',
    'II': 'Am',
    'III': 'Bm',
    'IV': 'C',
    'V': 'D',
    'VI': 'Em',
    'VII': 'F#ø',
  }
};

export const QUIZ_QUESTIONS_COUNT = 10;

export interface LevelConfig {
  allowedDegrees: MusicalDegree[];
  optionsCount: number;
  name: string;
  description: string;
}

export const QUIZ_LEVELS: Record<QuizLevel, LevelConfig> = {
  1: {
    allowedDegrees: ['I', 'IV', 'V'],
    optionsCount: 3,
    name: 'Nível 1 - Básico',
    description: 'Graus I, IV e V',
  },
  2: {
    allowedDegrees: ['I', 'IV', 'V', 'VI'],
    optionsCount: 4,
    name: 'Nível 2 - Iniciante',
    description: 'Graus I, IV, V e VI',
  },
  3: {
    allowedDegrees: ['I', 'II', 'IV', 'V', 'VI'],
    optionsCount: 4,
    name: 'Nível 3 - Intermediário',
    description: 'Graus I, II, IV, V e VI',
  },
  4: {
    allowedDegrees: ['I', 'II', 'III', 'IV', 'V', 'VI'],
    optionsCount: 4,
    name: 'Nível 4 - Avançado',
    description: 'Graus I, II, III, IV, V e VI',
  },
  5: {
    allowedDegrees: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'],
    optionsCount: 4,
    name: 'Nível 5 - Expert',
    description: 'Todos os 7 graus',
  },
};

export const LIST_PROGRESSIONS = [
  'I-II-VI-IV',
  'I-II-VI-V',
  'I-III-II-V',
  'I-III-IV-I',
  'I-IV-I-IV',
  'I-IV-I-V',
  'I-IV-V-I',
  'I-IV-V-IV',
  'I-IV-VI-V',
  'I-IV-VII-I',
  'I-V-I-V',
  'I-V-II-IV',
  'I-V-II-V',
  'I-V-IV-V',
  'I-V-VI-IV',
  'I-VI-III-IV',
  'I-VI-IV-V',
  'I-VI-V-IV',
  'IV-I-V-I',
  'IV-I-V-IV',
  'IV-I-VI-V',
  'IV-V-III-VI',
  'VI-V-IV-I',
  'VI-V-IV-V',
];


