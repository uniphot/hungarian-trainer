// Text analysis for writing: tokens with offsets, a profile of verb forms and case endings
// (via the engine's reverse lookup, with suffix patterns for words it doesn't know), linking
// words, lexical variety, repetition and task requirements.
import { analyze as analyzeWord } from './morph.js';
import { CONNECTORS, SYNONYMS } from '../data/writing.js';
import { mattr, sentences, wordCount, stripAccents } from './text.js';

export function tokens(text) {
  const out = [];
  const re = /\p{L}+/gu;
  let m;
  while ((m = re.exec(text))) out.push({ w: m[0], lw: m[0].toLowerCase(), start: m.index, end: m.index + m[0].length });
  return out;
}

// Case endings recognised on words the lexicon doesn't list (stem of at least two letters).
const CASE_SUFFIX = [['ine', /..(ban|ben)$/], ['ela', /..(ból|ből)$/], ['sub', /..(ra|re)$/], ['del', /..(ról|ről)$/], ['ade', /..(nál|nél)$/],
  ['all', /..(hoz|hez|höz)$/], ['abl', /..(tól|től)$/], ['dat', /..(nak|nek)$/], ['ins', /..([^aeiouáéíóúöőüű])\1(al|el)$/]];
const PAST_SUFFIX = /..(t|tt)(am|em|ál|él|unk|ünk|atok|etek|ak|ek)$|..(ott|ett|ött)$/;
const NOT_WORD_FORMS = new Set(['egy', 'van', 'nem', 'meg', 'de', 'hogy', 'mert', 'akkor', 'ezek', 'azok', 'nagyon', 'kérek', 'tanár', 'ember', 'reggel', 'este', 'ebben', 'abban']);

export function formProfile(text) {
  const counts = { pres: 0, past: 0, inf: 0, lak: 0 };
  const cases = new Set();
  const verbsSeen = new Set();
  for (const t of tokens(text)) {
    const readings = analyzeWord(t.lw);
    const verb = readings.find((r) => r.pos === 'verb');
    const noun = readings.find((r) => r.pos === 'noun');
    if (verb) { counts[verb.tense] = (counts[verb.tense] || 0) + 1; verbsSeen.add(verb.lemma); }
    else if (!NOT_WORD_FORMS.has(t.lw) && PAST_SUFFIX.test(t.lw)) counts.past++;
    if (noun && noun.case && !['nom', 'acc'].includes(noun.case)) cases.add(noun.case);
    else if (!noun && !verb && !NOT_WORD_FORMS.has(t.lw)) for (const [id, re] of CASE_SUFFIX) if (re.test(t.lw)) { cases.add(id); break; }
  }
  return { counts, cases: [...cases], verbs: verbsSeen.size };
}

export function connectorsUsed(text) {
  const low = ` ${text.toLowerCase().replace(/[.,;:!?()"„”«»]/g, ' ').replace(/\s+/g, ' ')} `;
  const found = [];
  for (const [lvl, list] of Object.entries(CONNECTORS)) {
    for (const c of list) if (low.includes(` ${c} `)) found.push({ c, lvl });
  }
  return found;
}

const FUNCTION_WORDS = new Set('a az egy és is de hogy nem van vagy meg el ki be fel le már még csak mert ha mint ez azt ezt én te ő mi ti ők nekem neked neki nagyon akkor most itt ott'.split(' '));

export function repeatedWords(text) {
  const counts = new Map();
  for (const t of tokens(text)) {
    if (t.lw.length < 3 && !SYNONYMS[t.lw]) continue;
    if (FUNCTION_WORDS.has(t.lw) && !SYNONYMS[t.lw]) continue;
    counts.set(t.lw, (counts.get(t.lw) || 0) + 1);
  }
  const total = wordCount(text);
  const threshold = total > 200 ? 4 : 3;
  return [...counts.entries()].filter(([w, n]) => n >= threshold || (SYNONYMS[w] && n >= 3))
    .sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w, n]) => ({ w, n, alt: SYNONYMS[w] || null }));
}

export function analyze(text, task) {
  const wc = wordCount(text);
  const sents = sentences(text);
  const prof = formProfile(text);
  const conns = connectorsUsed(text);
  const res = {
    words: wc,
    sentences: sents.length,
    avgLen: sents.length ? wc / sents.length : 0,
    mattr: mattr(text),
    tenses: prof.counts,
    cases: prof.cases,
    distinctVerbs: prof.verbs,
    connectors: conns,
    repeated: repeatedWords(text),
    reqs: [],
  };
  if (task) {
    const low = text.toLowerCase();
    const plainLow = stripAccents(low);
    if (task.min) res.reqs.push({ label: `${task.min}–${task.max} words`, met: wc >= task.min && wc <= (task.max || 1e9) * 1.15, detail: `${wc} words` });
    for (const r of task.reqs || []) {
      let met = false, detail = '';
      if (r.t === 'any') met = r.words.some((w) => low.includes(w) || plainLow.includes(stripAccents(w)));
      else if (r.t === 'past') { met = prof.counts.past >= r.min; detail = `${prof.counts.past} found`; }
      else if (r.t === 'cases') { met = prof.cases.length >= r.min; detail = `${prof.cases.length}: ${prof.cases.map((c) => CASE_NAMES[c]).join(', ') || '—'}`; }
      else if (r.t === 'connectors') { met = conns.length >= r.min; detail = `${conns.length}: ${conns.map((c) => c.c).join(', ') || '—'}`; }
      res.reqs.push({ label: r.label, met, detail });
    }
  }
  return res;
}

const CASE_NAMES = { ine: '-ban', ill: '-ba', ela: '-ból', sup: '-on', sub: '-ra', del: '-ról', ade: '-nál', all: '-hoz', abl: '-tól', dat: '-nak', ins: '-val', cau: '-ért', ter: '-ig', tra: '-vá' };
export const TENSE_LABEL = (k) => ({ pres: 'Present', past: 'Past', inf: 'Infinitives', lak: 'I … you' }[k] || k);
export const caseName = (c) => CASE_NAMES[c] || c;
