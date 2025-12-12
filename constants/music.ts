import type { MusicalDegree, MusicalKey, QuizLevel } from '@/types';

export const MUSICAL_DEGREES: MusicalDegree[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

export const MUSICAL_KEYS: MusicalKey[] = ['C'];

export const DEGREE_NAMES: Record<MusicalDegree, string> = {
  I: '(1° grau)',
  II: '(2° grau)',
  III: '(3° grau)',
  IV: '(4° grau)',
  V: '(5° grau)',
  VI: '(6° grau)',
  VII: '(7° grau)',
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


