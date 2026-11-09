// Hungarian sounds and spelling: letters (with the digraphs), vowel classes, vowel harmony,
// vowel length, and the a ↔ az article.

export const VOWELS = 'aáeéiíoóöőuúüű';
const BACK = new Set('aáoóuú');
const FRONT_ROUNDED = new Set('öőüű');
const NEUTRAL = new Set('iíé'); // e is a full front vowel; i, í and é go with either class
const LONG = { a: 'á', e: 'é', i: 'í', o: 'ó', ö: 'ő', u: 'ú', ü: 'ű' };
const SHORT = Object.fromEntries(Object.entries(LONG).map(([s, l]) => [l, s]));
export const isVowel = (c) => VOWELS.includes(c);

// Letters, longest first. A doubled digraph is written with its first letter doubled: ssz, ggy, nny…
const MULTI = ['dzs', 'cs', 'dz', 'gy', 'ly', 'ny', 'sz', 'ty', 'zs'];
export function letters(word) {
  const w = word.toLowerCase();
  const out = [];
  for (let i = 0; i < w.length;) {
    if (w.startsWith('ddzs', i)) { out.push('dzs', 'dzs'); i += 4; continue; }
    const two = MULTI.find((d) => d.length === 2 && w.startsWith(d, i + 1));
    if (w[i] === w[i + 1] && two && two[0] === w[i]) { out.push(two, two); i += 3; continue; }
    const m = MULTI.find((d) => w.startsWith(d, i));
    if (m) { out.push(m); i += m.length; continue; }
    out.push(w[i]); i++;
  }
  return out;
}

// Stems that break the rule: only i/í/é in them, but they take back-vowel endings.
const BACK_EXCEPTIONS = new Set(['híd', 'cél', 'díj', 'zsír', 'nyíl', 'szíj', 'íj', 'gyík', 'csík', 'sík', 'kín', 'ír', 'sír', 'nyit', 'hív', 'szív', 'nyír', 'vív', 'isz', 'iszik', 'derék', 'férfi']);

// 'back' or 'front' for choosing -ban/-ben; rounded tells -hoz/-hez/-höz apart.
export function harmony(word) {
  const w = word.toLowerCase().trim().split(/[\s-]/).pop();
  if (BACK_EXCEPTIONS.has(w)) return 'back';
  const vs = [...w].filter(isVowel);
  for (let k = vs.length - 1; k >= 0; k--) {
    if (BACK.has(vs[k])) return 'back';
    if (!NEUTRAL.has(vs[k])) return 'front';
  }
  return 'front';
}
const lastRounded = (word) => { const vs = [...word.toLowerCase()].filter(isVowel); return FRONT_ROUNDED.has(vs[vs.length - 1]); };
export const rounded = (word) => harmony(word) === 'front' && lastRounded(word);
// Pick the variant of a two- or three-way ending: pick('ház', ['hoz', 'hez', 'höz']).
// harm overrides the rule when the class is known (a compound like számítógép is front).
export function pick(word, [back, front, frontRounded], harm = harmony(word)) {
  if (harm === 'back') return back;
  return frontRounded && lastRounded(word) ? frontRounded : front;
}

export const lengthen = (v) => LONG[v] || v;
export const shorten = (v) => SHORT[v] || v;
// Words that differ only in vowel length (kor/kór): Hungarian length marks, nothing else.
export const unlong = (s) => [...s].map((c) => {
  const lower = c.toLowerCase();
  const sh = SHORT[lower];
  return sh ? (c === lower ? sh : sh.toUpperCase()) : c;
}).join('');

export const endsInVowel = (w) => isVowel(w.slice(-1).toLowerCase());
// Final -a/-e become long before most endings: alma → almát, almában.
export const lengthenFinal = (w) => (/[ae]$/.test(w) ? w.slice(0, -1) + LONG[w.slice(-1)] : w);

// The definite article: a before consonants, az before vowels (and before numbers read with one).
export const article = (next) => (isVowel(next.trim()[0]?.toLowerCase() || '') ? 'az' : 'a');

// Stress is always on the first syllable; this splits into syllables for display and drills.
export function syllables(word) {
  const L = letters(word);
  const out = [];
  let cur = [];
  for (let i = 0; i < L.length; i++) {
    cur.push(L[i]);
    if (!isVowel(L[i])) continue;
    // consonants up to the next vowel: one goes with the next syllable, any others stay here
    let j = i + 1;
    while (j < L.length && !isVowel(L[j])) j++;
    if (j >= L.length) { cur.push(...L.slice(i + 1)); i = L.length; break; }
    const cons = L.slice(i + 1, j);
    cur.push(...cons.slice(0, Math.max(0, cons.length - 1)));
    out.push(cur.join(''));
    cur = cons.length ? [cons[cons.length - 1]] : [];
    i = j - 1;
  }
  if (cur.length) out.push(cur.join(''));
  // back to the original capitalisation
  let at = 0;
  return out.map((s) => { const piece = word.slice(at, at + s.length); at += s.length; return piece; });
}
