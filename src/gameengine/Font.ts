type FontLetter = string[];

interface IFont {
  a: FontLetter;
  b: FontLetter;
  c: FontLetter;
  d: FontLetter;
  e: FontLetter;
  f: FontLetter;
  g: FontLetter;
  h: FontLetter;
  i: FontLetter;
  j: FontLetter;
  k: FontLetter;
  l: FontLetter;
  m: FontLetter;
  n: FontLetter;
  o: FontLetter;
  q: FontLetter;
  r: FontLetter;
  s: FontLetter;
  t: FontLetter;
  u: FontLetter;
  v: FontLetter;
  w: FontLetter;
  x: FontLetter;
  y: FontLetter;
  z: FontLetter;
}

export const textFont: {[key: string]: FontLetter} = {
  a: [
    '.....',
    '.....',
    '.aaaa.', // upper line
    'a...a',
    'a..aa',
    '.aa.a', // lower line
    '.....',
    '.....',
  ],
  b: [
    '.a...',
    '.a...',
    '.aaa.', // upper line
    '.a..a',
    '.a..a',
    '.aaa.', // lower line
    '.....',
    '.....',
  ],
  c: [
    '.....',
    '.....',
    '.aaa.', // upper line
    'a....',
    'a....',
    '.aaa.', // lower line
    '.....',
    '.....',
  ],
  d: [
    '..aa.',
    '...a.',
    '.aaa.', // upper line
    'a..a.',
    'a..a.',
    '.aa..', // lower line
    '.....',
    '.....',
  ],
  e: [
    '.....',
    '.....',
    '.aaa.',
    'a...a', // upper line
    'aaaaa',
    'a....',
    '.aaa.', // lower line
    '.....',
  ],
  f: [
    '...aa',
    '..a..',
    '.a...', // upper line
    '.aaa.',
    '.a...',
    '.a...', // lower line
    'a....',
    '.....',
  ],
  g: [
    '.....',
    '.....',
    '.aaa.', // upper line
    'a...a',
    'a...a',
    '.aaaa', // lower line
    '...a.',
    '.aa..',
  ],
  h: [
    'aa...',
    '.a...',
    '.a...', // upper line
    '.aaa.',
    '.a..a',
    '.a..a', // lower line
    '.....',
    '.....',
  ],
  i: [
    '.a...',
    '.....',
    '.a...', // upper line
    '.a...',
    '.a...',
    'aaa..', // lower line
    '.....',
    '.....',
  ],
  j: [
    '..a..',
    '.....',
    '..a..', // upper line
    '..a..',
    '..a..',
    '..a..', // lower line
    '..a..',
    'aa...',
  ],
  k: [
    'a....',
    'a....',
    'a.aa.', // upper line
    'aa...',
    'a.a..',
    'a..a.', // lower line
    '.....',
    '.....',
  ],
  l: [
    'aa...',
    '.a...',
    '.a...', // upper line
    '.a...',
    '.a...',
    'aaa..', // lower line
    '.....',
    '.....',
  ],
  m: [
    '.....',
    '.....',
    'aa.a.', // upper line
    'a.a.a',
    'a.a.a',
    'a.a.a', // lower line
    '.....',
    '.....',
  ],
  n: [
    '.....',
    '.....',
    'aa...', // upper line
    'a.a...',
    'a.a..',
    'a.a..', // lower line
    '.....',
    '.....',
  ],
  o: [
    '.....',
    '.....',
    '.aaa.', // upper line
    'a...a',
    'a...a',
    '.aaa.', // lower line
    '.....',
    '.....',
  ],
  p: [
    '.....',
    '.....',
    'aaaa.', // upper line
    '.a..a',
    '.a..a',
    '.aaa.', // lower line
    '.a...',
    'aaa..',
  ],
  q: [
    '.....',
    '.....',
    '.aaaa', // upper line
    'a..a.',
    'a..a.',
    '.aaa.', // lower line
    '...a.',
    '..aaa',
  ],
  r: [
    '.....',
    '.....',
    '.a.aa', // upper line
    '..a..',
    '..a..',
    '.aaa.', // lower line
    '.....',
    '.....',
  ],
  s: [
    '.....',
    '.aaa.',
    'a....', // upper line
    '.aa..',
    '...a.',
    'aaa..', // lower line
    '.....',
    '.....',
  ],
  t: [
    '.....',
    '.a...',
    'aaa..', // upper line
    '.a...',
    '.a...',
    '..a..', // lower line
    '.....',
    '.....',
  ],
  u: [
    '.....',
    '.....',
    'a..a.', // upper line
    'a..a.',
    'a..a.',
    '.aaa.', // lower line
    '.....',
    '.....',
  ],
  v: [
    '.....',
    '.....',
    'a...a', // upper line
    '.a.a.',
    '.a.a.',
    '..a..', // lower line
    '.....',
    '.....',
  ],
  w: [
    '.....',
    '.....',
    'a.a.a', // upper line
    'a.a.a',
    'a.a.a',
    '.a.aa', // lower line
    '.....',
    '.....',
  ],
  x: [
    '.....',
    '.....',
    'a..aa', // upper line
    '.aa..',
    '..aa.',
    'aa..a', // lower line
    '.....',
    '.....',
  ],
  y: [
    '.....',
    '.....',
    'a-..a', // upper line
    '.a..a',
    '..aa.',
    '...a.', // lower line
    '..a..',
    'aa...',
  ],
  z: [
    '.....',
    '.....',
    'aaaa.', // upper line
    '..a..',
    '.a...',
    'aaaa.', // lower line
    '.....',
    '.....',
  ]
};

export const headFont: Partial<IFont> = {
  a: [
    '.bbbbbbbb',
    'bbaaaaaab',
    'baabbaabb',
    'baabbaabb',
    'baabbaabb',
    'bbaaaaaab',
    '.bbbbbbbb'
  ],
  b: [
    'bbbbb....',
    '.baaab...',
    '.baaab...',
    '.bbaab...',
    '.baabbbb.',
    '.baaaaab.',
    '.baabbaab',
    '.baabbaab',
    'baaaaaab.',
    'bbbbbbbb.'
  ],
};
