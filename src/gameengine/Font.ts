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

export const textFont: Partial<IFont> = {
  a: [
    'aaaa.',
    '...aa',
    '.aaaa',
    'aa.aa',
    '.aaa.',
  ],
  b: [
    'a....',
    '.a...',
    '.aaa.',
    '.a..a',
    '..aa.',
  ],
  c: [
    '.....',
    '.....',
    '.aaa.',
    'a....',
    '.aaa.',
  ],
  d: [
    '....a',
    '...a.',
    '.aaa.',
    'a..a.',
    '.aa..',
  ],
  e: [
    '.aaa.',
    'a....',
    'aaa..',
    'a...',
    '.aaa.',
  ],
  f: [
    '...aa',
    '..a..',
    '.aaaa',
    '.a...',
    '.a...',
  ],
  g: [
    '.aaa.',
    'a...a',
    '.aaa.',
    '...a.',
    '.aa..',
  ],
  h: [
    '.a...',
    '.a...',
    '.aa..',
    '.a.a.',
    '.a.a.',
  ],
  i: [
    '..a..',
    '.....',
    '..a..',
    '..a..',
    '.aaa.',
  ],
  j: [
    '..a..',
    '.....',
    '..a..',
    'a.a..',
    '.aa..',
  ],
  k: [
    'a....',
    'a.a..',
    'aa...',
    'a.a..',
    'a.aa.',
  ],
  l: [
    '.aa..',
    '..a..',
    '..a..',
    '..a..',
    '.aaa.',
  ],
  m: [
    '.....',
    '.....',
    'aa.a.',
    'a.a.a',
    'a.a.a',
  ],
  n: [
    '.....',
    '.....',
    'aa...',
    'a.a..',
    'a.a..',
  ],
  o: [
    '.....',
    '.aaa.',
    'a...a',
    'a...a',
    '.aaa.',
  ],
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
