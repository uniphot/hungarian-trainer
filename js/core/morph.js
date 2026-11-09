// Hungarian word forms: noun endings (plural, object, cases, possessive) and verb conjugation
// (present and past, indefinite and definite). Listed words use their principal parts from
// data/lexicon.js; anything else falls back to the regular rules.
import { harmony, rounded, pick, letters, isVowel, endsInVowel, lengthenFinal, unlong } from './hu.js';
import { NOUNS, NOUN_OVERRIDES, VERBS, IRREGULAR } from '../data/lexicon.js';

export const PERSONS = ['én', 'te', 'ő', 'mi', 'ti', 'ők'];
export const PERSONS_EN = ['I', 'you', 'he/she', 'we', 'you (pl.)', 'they'];

// ---- Cases --------------------------------------------------------------------------------
// q: the question it answers. ru/it: the nearest thing in Russian and Italian.
export const CASES = {
  acc: { end: ['t'], name: 'tárgyeset', en: 'object', q: 'mit? kit?', ru: 'винительный падеж', it: 'complemento oggetto' },
  ine: { end: ['ban', 'ben'], name: 'inessive', en: 'in', q: 'hol?', ru: 'в (где?)', it: 'in (stato)' },
  ill: { end: ['ba', 'be'], name: 'illative', en: 'into', q: 'hová?', ru: 'в (куда?)', it: 'in (moto a luogo)' },
  ela: { end: ['ból', 'ből'], name: 'elative', en: 'out of', q: 'honnan?', ru: 'из', it: 'da (fuori da)' },
  sup: { end: ['on', 'en', 'ön'], name: 'superessive', en: 'on', q: 'hol?', ru: 'на (где?)', it: 'su (stato)' },
  sub: { end: ['ra', 're'], name: 'sublative', en: 'onto', q: 'hová?', ru: 'на (куда?)', it: 'su (moto)' },
  del: { end: ['ról', 'ről'], name: 'delative', en: 'off; about', q: 'honnan? miről?', ru: 'с; о (ком/чём)', it: 'da sopra; di (argomento)' },
  ade: { end: ['nál', 'nél'], name: 'adessive', en: 'at, by', q: 'hol? kinél?', ru: 'у', it: 'presso, da (qualcuno)' },
  all: { end: ['hoz', 'hez', 'höz'], name: 'allative', en: 'to (up to)', q: 'hová? kihez?', ru: 'к', it: 'da (verso qualcuno)' },
  abl: { end: ['tól', 'től'], name: 'ablative', en: 'from (beside)', q: 'honnan? kitől?', ru: 'от', it: 'da (qualcuno)' },
  dat: { end: ['nak', 'nek'], name: 'dative', en: 'to, for', q: 'kinek?', ru: 'дательный падеж', it: 'a (qualcuno)' },
  ins: { end: ['val', 'vel'], name: 'instrumental', en: 'with', q: 'kivel? mivel?', ru: 'с; творительный падеж', it: 'con' },
  cau: { end: ['ért'], name: 'causal-final', en: 'for (the sake of; a price)', q: 'miért?', ru: 'за', it: 'per' },
  ter: { end: ['ig'], name: 'terminative', en: 'as far as, until', q: 'meddig?', ru: 'до', it: 'fino a' },
  tra: { end: ['vá', 'vé'], name: 'translative', en: 'into (becoming)', q: 'mivé?', ru: 'в (превратиться)', it: 'in (diventare)' },
};

const parseNoun = (row) => {
  const [nom, pl, acc, poss3, en] = row.split('|');
  return { nom, pl, acc, poss3, en, known: true, ...NOUN_OVERRIDES[nom] };
};
const NOUN_MAP = new Map(NOUNS.map((r) => { const n = parseNoun(r); return [n.nom, n]; }));
export const nouns = () => [...NOUN_MAP.values()];

const DIRECT_T = new Set(['j', 'l', 'ly', 'n', 'ny', 'r', 's', 'sz', 'z', 'zs']);
export function nounInfo(word) {
  const w = word.toLowerCase();
  if (NOUN_MAP.has(w)) return NOUN_MAP.get(w);
  const vowel = endsInVowel(w);
  const pl = vowel ? `${lengthenFinal(w)}k` : w + pick(w, ['ok', 'ek', 'ök']);
  const acc = vowel ? `${lengthenFinal(w)}t` : DIRECT_T.has(letters(w).pop()) ? `${w}t` : w + pick(w, ['ot', 'et', 'öt']);
  const poss3 = vowel ? `${lengthenFinal(w)}${pick(w, ['ja', 'je'])}` : w + pick(w, ['a', 'e']);
  return { nom: w, pl, acc, poss3, known: false };
}

// A listed noun's plural shows its harmony even where the rule can't (számítógép → -ek, híd → -ak).
function nounHarm(n) {
  if (!n.known) return harmony(n.nom);
  const vs = [...n.pl].filter(isVowel);
  const last = vs[vs.length - 1];
  if ('aáoóuú'.includes(last)) return 'back';
  if ('eöőüű'.includes(last)) return 'front';
  return harmony(n.nom);
}

// The stem a linking vowel attaches to: ló → lov-, cukor → cukr-; but víz → víz- (vízen, not vizen).
function linkStem(n) {
  const p = n.pl.slice(0, -2);
  if (endsInVowel(n.nom)) return n.pl.startsWith(lengthenFinal(n.nom)) ? null : p;
  return unlong(p) === unlong(n.nom) ? n.nom : p;
}

// -val/-vel and -vá/-vé: after a consonant the v becomes a copy of it (házzal, kulccsal, rizzsel).
function assimilate(stem, two, harm) {
  const end = pick(stem, two, harm);
  if (endsInVowel(stem)) return lengthenFinal(stem) + end;
  const L = letters(stem);
  const last = L[L.length - 1];
  if (L.length > 1 && L[L.length - 2] === last) return stem + end.slice(1); // already long: toll → tollal
  const doubled = last.length === 1 ? last + last : last[0] + last; // z → zz, sz → ssz, cs → ccs
  return stem.slice(0, -last.length) + doubled + end.slice(1);
}

// One ending on one word. caseForm('ház', 'ine') → 'házban'; with plural: 'házakban'.
export function caseForm(word, id, { plural = false } = {}) {
  const n = nounInfo(word);
  const stem = plural ? n.pl : n.nom;
  const harm = plural ? undefined : nounHarm(n);
  if (id === 'nom') return stem;
  if (id === 'acc') return plural ? stem + pick(stem, ['at', 'et']) : n.acc;
  if (id === 'sup') {
    if (!plural && n.sup) return n.sup;
    if (endsInVowel(stem)) {
      const ls = !plural && linkStem(n);
      return ls ? ls + pick(n.nom, CASES.sup.end, harm) : `${lengthenFinal(stem)}n`;
    }
    return (plural ? stem : linkStem(n)) + pick(stem, CASES.sup.end, harm);
  }
  if (id === 'ins' || id === 'tra') return assimilate(stem, CASES[id].end, harm);
  return lengthenFinal(stem) + pick(stem, CASES[id].end, harm);
}
export const plural = (w) => nounInfo(w).pl;

// Possessive: my/your/his… house. person 0–5 as in PERSONS.
export function possessive(word, person) {
  const n = nounInfo(word);
  if (n.poss) return n.poss[person];
  const ps = n.pl.slice(0, -1); // házak → háza-, almák → almá-, lovak → lova-
  const vowelFinal = endsInVowel(n.nom) && !linkStem(n);
  const linkV = ps.slice(-1);
  const harm = nounHarm(n);
  switch (person) {
    case 0: return `${ps}m`;
    case 1: return `${ps}d`;
    case 2: return n.poss3;
    case 3: return vowelFinal ? `${ps}nk` : ps.slice(0, -1) + pick(n.nom, ['unk', 'ünk'], harm);
    case 4: return ps + (vowelFinal ? pick(n.nom, ['tok', 'tek', 'tök'], harm) : { a: 'tok', o: 'tok', e: 'tek', ö: 'tök' }[linkV] || pick(n.nom, ['tok', 'tek', 'tök'], harm));
    default: return n.poss3.slice(0, -1) + pick(n.nom, ['uk', 'ük'], harm);
  }
}

// ---- Verbs --------------------------------------------------------------------------------
const PREFIXES = ['vissza', 'össze', 'tovább', 'végig', 'haza', 'meg', 'szét', 'oda', 'ide', 'fel', 'föl', 'ki', 'be', 'el', 'le', 'át', 'rá'];
const parseVerb = (row) => { const [lemma, en, past3, past1, inf, flags = ''] = row.split('|'); return { lemma, en, past: [past3, past1], inf, flags }; };
const VERB_MAP = new Map(VERBS.map((r) => { const v = parseVerb(r); return [v.lemma, v]; }));
export const verbs = () => [...VERB_MAP.keys(), ...Object.keys(IRREGULAR)];

// Split a prefixed verb: megcsinál → ['meg', 'csinál'] when the base is known.
export function splitPrefix(lemma) {
  for (const p of PREFIXES) {
    const base = lemma.slice(p.length);
    if (lemma.startsWith(p) && base.length > 1 && (VERB_MAP.has(base) || IRREGULAR[base])) return [p, base];
  }
  return ['', lemma];
}

export function verbInfo(lemma) {
  const [prefix, base] = splitPrefix(lemma);
  const irr = IRREGULAR[base];
  const lex = VERB_MAP.get(base);
  const ik = /ik$/.test(base);
  const stem = ik ? base.slice(0, -2) : base;
  const L = letters(stem);
  const cons = (x) => x && !isVowel(x);
  return {
    lemma, prefix, base, stem, ik, irr, en: lex?.en || irr?.en,
    back: harmony(ik ? base : stem) === 'back',
    round: rounded(stem),
    sib: ['s', 'sz', 'z', 'dz'].includes(L[L.length - 1]),
    link: !lex?.flags.includes('nolink') && (/ít$/.test(stem) || (cons(L[L.length - 1]) && cons(L[L.length - 2]))),
    known: Boolean(lex || irr),
    transitive: irr ? Boolean(irr.def) : !lex?.flags.includes('intr'),
    lex,
  };
}

// Sibilant + j merge: olvas + ja → olvassa, néz + jük → nézzük, játsz + ja → játssza.
function joinJ(stem, ending) {
  if (!ending.startsWith('j')) return stem + ending;
  const rest = ending.slice(1);
  if (stem.endsWith('sz')) return `${stem.slice(0, -2)}ssz${rest}`;
  if (stem.endsWith('dz')) return `${stem.slice(0, -2)}ddz${rest}`;
  if (stem.endsWith('s') || stem.endsWith('z')) return stem + stem.slice(-1) + rest;
  return stem + ending;
}

const withPrefix = (v, forms) => (v.prefix ? forms.map((f) => v.prefix + f) : forms);

export function present(lemma, { def = false } = {}) {
  const v = verbInfo(lemma);
  if (v.irr) {
    const t = def ? v.irr.def : v.irr.ind;
    return t ? withPrefix(v, t) : null;
  }
  const { stem, back, round, sib, link, ik } = v;
  const b = (backF, frontF, roundF = frontF) => (back ? backF : round ? roundF : frontF);
  if (def) {
    return withPrefix(v, [
      stem + b('om', 'em', 'öm'), stem + b('od', 'ed', 'öd'), joinJ(stem, b('ja', 'i')),
      joinJ(stem, b('juk', 'jük')), joinJ(stem, b('játok', 'itek')), joinJ(stem, b('ják', 'ik')),
    ]);
  }
  return withPrefix(v, [
    stem + (ik ? b('om', 'em', 'öm') : b('ok', 'ek', 'ök')),
    stem + (sib ? b('ol', 'el', 'öl') : link ? b('asz', 'esz') : 'sz'),
    ik ? `${stem}ik` : stem,
    stem + b('unk', 'ünk'),
    stem + (link ? b('otok', 'etek', 'ötök') : b('tok', 'tek', 'tök')),
    stem + (link ? b('anak', 'enek') : b('nak', 'nek')),
  ]);
}

// Past principal parts: from the lexicon, or by the rules for verbs not listed.
function pastParts(v) {
  if (v.irr) return v.irr.past;
  if (v.lex) return v.lex.past;
  const { stem } = v;
  const L = letters(stem);
  const last = L[L.length - 1];
  const ott = pick(stem, ['ott', 'ett', 'ött']);
  const am = v.back ? 'am' : 'em';
  if (/ít$/.test(stem) || last === 't' || (L.length > 1 && L[L.length - 2] === last)) return [stem + ott, stem + ott + am];
  if (['l', 'r', 'n', 'ny', 'j', 'ly'].includes(last) && L.length > 2) return [`${stem}t`, `${stem}t${am}`];
  return [stem + ott, `${stem}t${am}`];
}

export function past(lemma, { def = false } = {}) {
  const v = verbInfo(lemma);
  const [p3, p1] = pastParts(v);
  const P = p1.slice(0, -2);
  const b = (x, y) => (v.back ? x : y);
  const forms = def
    ? [p1, P + b('ad', 'ed'), P + b('a', 'e'), P + b('uk', 'ük'), P + b('átok', 'étek'), P + b('ák', 'ék')]
    : [p1, P + b('ál', 'él'), p3, P + b('unk', 'ünk'), P + b('atok', 'etek'), P + b('ak', 'ek')];
  return withPrefix(v, forms);
}

// I … you: szeretlek, látlak, várlak.
export function lak(lemma) {
  const v = verbInfo(lemma);
  if (v.irr) return null;
  return (v.prefix || '') + v.stem + (v.link ? (v.back ? 'alak' : 'elek') : (v.back ? 'lak' : 'lek'));
}

export function infinitive(lemma) {
  const v = verbInfo(lemma);
  const own = v.irr?.inf || v.lex?.inf;
  if (own) return (v.prefix || '') + own;
  return (v.prefix || '') + v.stem + (v.link ? (v.back ? 'ani' : 'eni') : 'ni');
}

export const TENSES = {
  pres: { name: 'jelen idő', en: 'present' },
  past: { name: 'múlt idő', en: 'past' },
};
export function conjugate(lemma, tense, person, def = false) {
  const f = tense === 'past' ? past(lemma, { def }) : present(lemma, { def });
  return f ? f[person] : null;
}

// ---- Reading words backwards ---------------------------------------------------------------
// analyze('házban') → [{ lemma: 'ház', en: 'house', parts: ['ház', '-ban'], gloss: 'in the house' }].
// Every form of every listed word is generated once and looked up.
const CASE_LABEL = { acc: 'object (-t)', ...Object.fromEntries(Object.entries(CASES).filter(([k]) => k !== 'acc').map(([k, c]) => [k, `${c.en} (-${c.end.join('/-')})`])) };
let reverse = null;
const POSS_EN = ['my', 'your', 'his/her', 'our', 'your (pl.)', 'their'];
function buildReverse() {
  reverse = new Map();
  const add = (form, entry) => {
    const k = form.toLowerCase();
    if (!reverse.has(k)) reverse.set(k, []);
    const list = reverse.get(k);
    if (!list.some((e) => e.desc === entry.desc && e.lemma === entry.lemma)) list.push(entry);
  };
  for (const n of nouns()) {
    const base = { lemma: n.nom, en: n.en, pos: 'noun' };
    add(n.nom, { ...base, desc: 'noun', case: 'nom', plural: false });
    add(n.pl, { ...base, desc: 'plural', case: 'nom', plural: true });
    for (const id of Object.keys(CASES)) {
      add(caseForm(n.nom, id), { ...base, desc: CASE_LABEL[id], case: id, plural: false });
      add(caseForm(n.nom, id, { plural: true }), { ...base, desc: `plural · ${CASE_LABEL[id]}`, case: id, plural: true });
    }
    PERSONS.forEach((p, i) => add(possessive(n.nom, i), { ...base, desc: `${POSS_EN[i]} ${n.en.split(/[;,]/)[0]}`, case: 'nom', plural: false, owner: i }));
  }
  for (const lemma of verbs()) {
    const v = verbInfo(lemma);
    const base = { lemma, en: v.en, pos: 'verb' };
    const tag = (tense, def, i) => `${tense} · ${PERSONS[i]} (${PERSONS_EN[i]})${def ? ' · definite' : ''}`;
    for (const def of v.transitive ? [false, true] : [false]) {
      present(lemma, { def })?.forEach((f, i) => add(f, { ...base, desc: tag('present', def, i), tense: 'pres', person: i, def }));
      past(lemma, { def }).forEach((f, i) => add(f, { ...base, desc: tag('past', def, i), tense: 'past', person: i, def }));
    }
    add(infinitive(lemma), { ...base, desc: 'infinitive (to …)', tense: 'inf' });
    const l = lak(lemma);
    if (l) add(l, { ...base, desc: 'I … you (-lak/-lek)', tense: 'lak', person: 0 });
  }
}
export function analyze(word) {
  if (!reverse) buildReverse();
  const w = word.toLowerCase();
  const direct = reverse.get(w);
  if (direct) return direct;
  // a verb with a separable prefix: megcsináltam → meg + csináltam
  for (const p of PREFIXES) {
    if (w.startsWith(p) && reverse.has(w.slice(p.length))) {
      return reverse.get(w.slice(p.length)).filter((e) => e.pos === 'verb').map((e) => ({ ...e, lemma: p + e.lemma, prefix: p, desc: `${e.desc} · prefix ${p}-` }));
    }
  }
  return [];
}

// For a word the lexicon doesn't know, a likely stem + case ending: sarokban → sarok + -ban (in).
// Only the endings that can't easily be part of a stem, and only if the vowels agree.
const GUESS_ENDINGS = Object.entries(CASES).filter(([id]) => !['acc', 'sup', 'ter'].includes(id))
  .flatMap(([id, c]) => c.end.map((e) => ({ id, e }))).sort((a, b) => b.e.length - a.e.length);
export function guessParts(word) {
  const w = word.toLowerCase();
  for (const { id, e } of GUESS_ENDINGS) {
    const tail = id === 'ins' || id === 'tra' ? e.slice(1) : e;
    if (!w.endsWith(tail) || w.length - tail.length < 3) continue;
    let stem = w.slice(0, -tail.length);
    if (id === 'ins' || id === 'tra') {
      if (/(.)\1$/.test(stem)) stem = stem.slice(0, -1); // házz-al → ház
      else if (!isVowel(stem.slice(-1))) continue;
    }
    if (pick(stem, CASES[id].end) !== e) continue; // the vowels must agree with the ending
    stem = stem.replace(/á$/, 'a').replace(/é$/, 'e');
    return { stem, ending: `-${CASES[id].end.join('/-')}`, en: CASES[id].en };
  }
  return null;
}
