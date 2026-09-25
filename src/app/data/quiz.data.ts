// The bestie quiz. Edit questions here — nothing else hard-codes question text.

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3; // index of the correct option
}

export const QUIZ: readonly QuizQuestion[] = [
  { id: 'color', question: "What's my favourite colour?", options: ['Yellow', 'Pink', 'Purple', 'Green'], answer: 2 },
  { id: 'coffee', question: 'My go-to coffee order?', options: ['Iced mocha', 'Espresso, black', 'Latte', 'Cold brew'], answer: 2 },
  {
    id: 'place',
    question: 'My idea of a perfect weekend?',
    options: ['Mall hopping', 'A Netflix marathon', 'Camping, a road trip, the beach or a hike', 'A fancy rooftop bar'],
    answer: 2,
  },
  {
    id: 'movie',
    question: 'My comfort show?',
    options: ['Fantasy C-dramas', 'Marvel movies', 'Supernatural', 'Big Bang Theory & Modern Family'],
    answer: 3,
  },
  {
    id: 'song',
    question: 'My favourite song?',
    options: ['Ocean (Josh Derek)', 'White Horse', 'Goo Goo Dolls', 'Birds of a Feather'],
    answer: 2,
  },
];

export const UNLOCK_SCORE = 4;

// Indexed by score (0..QUIZ.length).
export const RESULT_TITLES = [
  'Who even are you?! 😳',
  'Who even are you?! 😳',
  'Acquaintance energy 😅',
  'Solid friend 🤝',
  'Basically family 💛',
  'Certified bestie 👯',
];

export const CHEERS = ['✓ nailed it!', '✓ bestie behaviour', '✓ u really know me', '✓ correct!!', '✓ ding ding ding'];
