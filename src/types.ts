/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AlphabetItem {
  letter: string;
  isVowel: boolean;
  word: string;
  wordTranslation: string;
  phonetic: string;
  exampleSentence: string;
  sentenceTranslation: string;
  emoji: string;
}

export interface GrammarLesson {
  id: 'present-simple' | 'past-simple' | 'present-continuous' | 'master-mix';
  title: string;
  titleUz: string;
  shortDescUz: string;
  explanationUz: string; // Markdown or structured bullets
  formula: string;
  examples: {
    english: string;
    uzbek: string;
    description?: string;
  }[];
  commonTimeExpressionsUz: string[];
}

export interface QuizQuestion {
  id: string;
  question: string; // with gaps e.g. "She ___ to school every day."
  options: string[];
  correctAnswer: string;
  explanation: string; // Explanation in Uzbek
}

export interface WordGameLevel {
  id: number;
  correct: string;
  clueUz: string;
  category: string;
}

export interface SentenceGameLevel {
  id: number;
  correct: string;
  translationUz: string;
  tense: string;
}
