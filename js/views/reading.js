// Olvasás: learning to read and pronounce from zero. An alphabet chart to explore, then short
// units of letter–sound pairs, each drilled four ways: hear → pick the spelling, hear → which
// of a pair, hear → write it, see → say it (checked by speech recognition where available).
import { h, mount, btn, card, icon, shuffle, sample, sayBtn, accentBar, smartAccents, toast } from '../core/ui.js';
import { store, logDone } from '../core/store.js';
import { speak, stopSpeaking, hungarianVoices, sttSupported } from '../core/speech.js';
import { checkAnswer, norm, stripAccents } from '../core/text.js';
import { syllables } from '../core/hu.js';
import { addCard } from '../core/srs.js';
import { UNITS, CONFUSIONS } from '../data/reading.js';
import { micWidget } from './speaking.js';

export const strand = 'language';

// [letter, example word, English] for the whole alphabet.
const ALPHABET = [
  ['a', 'alma', 'apple'], ['á', 'ágy', 'bed'], ['b', 'bor', 'wine'], ['c', 'cica', 'kitty'], ['cs', 'csak', 'only'], ['d', 'dal', 'song'], ['dz', 'edz', 'trains'],
  ['dzs', 'dzsem', 'jam'], ['e', 'este', 'evening'], ['é', 'kép', 'picture'], ['f', 'fa', 'tree'], ['g', 'gomba', 'mushroom'], ['gy', 'egy', 'one'], ['h', 'hal', 'fish'],
  ['i', 'itt', 'here'], ['í', 'víz', 'water'], ['j', 'jó', 'good'], ['k', 'kert', 'garden'], ['l', 'láb', 'leg'], ['ly', 'hely', 'place'], ['m', 'ma', 'today'],
  ['n', 'nap', 'sun'], ['ny', 'nyár', 'summer'], ['o', 'ok', 'reason'], ['ó', 'jó', 'good'], ['ö', 'öt', 'five'], ['ő', 'ő', 'he, she'], ['p', 'pad', 'bench'],
  ['r', 'rét', 'meadow'], ['s', 'só', 'salt'], ['sz', 'szó', 'word'], ['t', 'tea', 'tea'], ['ty', 'kutya', 'dog'], ['u', 'utca', 'street'], ['ú', 'út', 'road'],
  ['ü', 'ül', 'sits'], ['ű', 'tű', 'needle'], ['v', 'víz', 'water'], ['z', 'zene', 'music'], ['zs', 'zseb', 'pocket'],
];

const knownNotes = (u) => (store.state.profile.known || ['en']).filter((l) => u.notes[l]).map((l) => ({ l, text: u.notes[l] }));
const LANG = { ru: 'If you know Russian', it: 'Se sai l’italiano', en: 'For English speakers' };

export async function render(root, params) {
  const u = UNITS.find((x) => x.id === params[0]);
  return u ? unitPage(root, u) : hub(root);
}

function voiceNote() {
  if (!('speechSynthesis' in window)) return h('div', { class: 'note warn' }, 'This browser can’t speak, so you won’t hear the sounds. Try Chrome or Safari.');
  return hungarianVoices().length ? null : h('div', { class: 'note' }, 'No Hungarian voice was found on this device, so another voice may read the words. On iPhone and Mac: Settings → Accessibility → Spoken Content → Voices → Hungarian. On Android: Google Text-to-speech → Hungarian.');
}

function hub(root) {
  const done = UNITS.filter((u) => (store.state.reading[u.id]?.best || 0) >= 0.8).length;
  const next = UNITS.find((u) => (store.state.reading[u.id]?.best || 0) < 0.8);
  mount(root,
    h('div', { class: 'page-head' }, h('h1', 'Olvasás'),
      h('p', { class: 'lead' }, 'Hungarian is written almost exactly as it is said. Learn about forty letter–sound pairs and you can read any word aloud, and write any word you hear. Ten short units, then you never need to guess a pronunciation again.')),
    voiceNote(),
    next ? card(h('div', { class: 'row between' }, h('div', null, h('div', { class: 'tile-tag' }, `Next · ${done} of ${UNITS.length} done`), h('h3', { style: { margin: '4px 0' } }, `${next.es}`), h('div', { class: 'small muted' }, next.en)),
      h('a', { class: 'btn primary', href: `#/reading/${next.id}` }, 'Start'))) : card(h('h3', 'All units done'), h('p', null, 'You can read Hungarian aloud. Keep it sharp with dictation in Hallás and the review queue.')),
    h('div', { class: 'grid grid-2' }, UNITS.map((u, i) => {
      const best = store.state.reading[u.id]?.best;
      return h('a', { class: 'topic', href: `#/reading/${u.id}` },
        h('span', { class: 'tag' }, String(i + 1)),
        h('div', { style: { flex: 1 } }, h('div', { class: 't-title' }, u.es), h('div', { class: 't-en' }, u.en)),
        best != null ? h('span', { class: 'tag' }, `${Math.round(best * 100)}%`) : null);
    })),
    card(h('h3', 'Az ábécé: the alphabet'), h('p', { class: 'small muted' }, 'Tap a letter to hear it in a word. Digraphs (cs, gy, sz…) are single letters in Hungarian, with their own place in dictionaries.'),
      h('div', { class: 'abc' }, ALPHABET.map(([l, w, en]) => h('button', { class: 'abc-key', title: `${w} — ${en}`, onclick: () => speak(w, { rate: 0.8 }) },
        h('b', { class: 'tl' }, l), h('span', { class: 'small muted' }, w))))));
  return () => stopSpeaking();
}

function unitPage(root, u) {
  const idx = UNITS.indexOf(u);
  const nextU = UNITS[idx + 1];
  const syl = (w) => syllables(w).map((s, i) => (i === 0 ? h('b', null, s) : s)).reduce((a, s, i) => (i ? [...a, '·', s] : [s]), []);
  mount(root,
    h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/reading' }, '← Olvasás')),
      h('div', { class: 'small muted' }, `Unit ${idx + 1} of ${UNITS.length}`), h('h1', u.es), h('p', { class: 'lead' }, u.en)),
    voiceNote(),
    card(h('table', { class: 'conj-table' }, u.sounds.map(([letter, how, ex]) => h('tr', null,
      h('td', null, h('b', { class: 'tl', style: { fontSize: '1.2rem' } }, letter)), h('td', null, how),
      h('td', null, h('span', { class: 'row' }, sayBtn(ex, { rate: 0.8 }), h('span', { class: 'tl' }, ex))))))),
    knownNotes(u).map(({ l, text }) => h('div', { class: 'note' }, h('b', `${LANG[l]}: `), text)),
    card(h('h3', 'Words'), h('p', { class: 'small muted' }, 'Listen, then say each word. The bold syllable is the stressed one, always the first.'),
      h('div', { class: 'stack' }, u.words.map(([w, en]) => h('div', { class: 'row' }, sayBtn(w, { rate: 0.85 }),
        h('span', { class: 'tl', style: { fontSize: '1.15rem' } }, syl(w)), h('span', { class: 'small muted' }, en))))),
    u.pairs.length ? card(h('h3', 'Hear the difference'), h('p', { class: 'small muted' }, 'Each pair differs in one sound only.'),
      h('div', { class: 'stack' }, u.pairs.map(([a, b]) => h('div', { class: 'row' }, sayBtn(a, { rate: 0.85 }), h('b', { class: 'tl' }, a), h('span', { class: 'muted' }, '·'), sayBtn(b, { rate: 0.85 }), h('b', { class: 'tl' }, b))))) : null,
    card(h('h3', 'Read this'), h('p', { class: 'tl', style: { fontSize: '1.25rem' } }, u.line, ' ', sayBtn(u.line))),
    card(h('h3', 'Practice'), h('p', { class: 'small muted' }, '12 quick items: pick the spelling, tell pairs apart, write what you hear, and read aloud.'),
      h('div', { class: 'ex-actions' }, btn('Start practice', () => drill(root, u, nextU), 'primary'))));
  return () => stopSpeaking();
}

// Wrong spellings that a listener could plausibly write: s ↔ sz, short ↔ long, single ↔ double.
function distractors(word, pool, n = 3) {
  const out = new Set();
  const lw = word.toLowerCase();
  for (const [from, to] of shuffle(CONFUSIONS)) {
    const i = lw.indexOf(from);
    if (i < 0) continue;
    // don't turn sz into ssz-like nonsense twice in a row
    const cand = word.slice(0, i) + to + word.slice(i + from.length);
    if (cand.toLowerCase() !== lw && !/(.)\1\1/.test(cand)) out.add(cand);
    if (out.size >= n) break;
  }
  for (const w of shuffle(pool)) { if (out.size >= n) break; if (w.toLowerCase() !== lw) out.add(w); }
  return [...out].slice(0, n);
}

function drill(root, u, nextU) {
  const words = u.words.map(([w]) => w).filter((w) => w.split(' ').length === 1);
  const items = [];
  for (const w of sample(words, 4)) items.push({ kind: 'pick', word: w });
  for (const [a, b] of sample(u.pairs, Math.min(3, u.pairs.length))) items.push({ kind: 'pair', a, b, word: Math.random() < 0.5 ? a : b });
  for (const w of sample(words, 3)) items.push({ kind: 'write', word: w });
  if (sttSupported()) for (const w of sample(words, 2)) items.push({ kind: 'say', word: w });
  while (items.length < 12) items.push({ kind: 'pick', word: sample(words, 1)[0] });
  const run = shuffle(items).slice(0, 12);
  let i = 0, score = 0;
  const wrap = h('div');
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: `#/reading/${u.id}` }, `← ${u.es}`)), h('h1', u.es)), wrap);

  const summary = () => {
    const s = score / run.length;
    const prev = store.state.reading[u.id];
    store.state.reading[u.id] = { best: Math.max(s, prev?.best || 0), ts: Date.now() };
    store.save();
    logDone(`r-${u.id}`);
    wrap.replaceChildren(card(h('div', { class: 'summary-big' }, `${Math.round(s * 100)}%`),
      h('p', null, s >= 0.8 ? 'Solid. These sounds are yours now.' : 'Do another round now or tomorrow: getting these automatic is what makes everything else easier.'),
      h('div', { class: 'ex-actions' }, btn('Again', () => drill(root, u, nextU), s >= 0.8 ? '' : 'primary'),
        nextU ? h('a', { class: `btn ${s >= 0.8 ? 'primary' : ''}`, href: `#/reading/${nextU.id}` }, `Next: ${nextU.es}`) : h('a', { class: 'btn primary', href: '#/grammar' }, 'On to grammar'),
        h('a', { class: 'btn ghost', href: '#/reading' }, 'All units'))));
  };

  const next = () => { i++; show(); };
  const feedback = (ok, word, extra) => h('div', { class: `feedback ${ok ? 'ok' : 'bad'}` }, h('div', { class: 'fb-body' },
    h('div', { class: 'fb-title' }, ok ? 'Igen!' : 'Not quite'), h('div', { class: 'full tl' }, word), extra || null), sayBtn(word, { rate: 0.85 }));
  const nextBtn = () => h('div', { class: 'ex-actions' }, btn([i + 1 < run.length ? 'Next ' : 'Finish ', icon('arrow', 16)], next, 'primary', { id: 'next-btn' }));

  const show = () => {
    if (i >= run.length) return summary();
    const it = run[i];
    const fb = h('div');
    const play = (rate = 0.85) => speak(it.word, { rate });
    const head = h('div', { class: 'row', style: { marginBottom: '12px' } },
      h('button', { class: 'say big', onclick: () => play(), 'aria-label': 'Listen' }, icon('play', 24)),
      btn('Slower', () => play(0.6), 'small'),
      h('span', { class: 'small muted' }, { pick: 'Which spelling did you hear?', pair: 'Which one did you hear?', write: 'Write what you hear.', say: 'Read this word aloud.' }[it.kind]));
    let body;
    if (it.kind === 'pick' || it.kind === 'pair') {
      const options = it.kind === 'pair' ? shuffle([it.a, it.b]) : shuffle([it.word, ...distractors(it.word, words)]);
      let answered = false;
      const opts = options.map((o) => h('button', { class: 'opt tl', onclick: (e) => {
        if (answered) return;
        answered = true;
        const ok = o === it.word;
        if (ok) score++;
        opts.forEach((b) => { b.disabled = true; if (b.textContent === it.word) b.classList.add('ok'); });
        if (!ok) e.currentTarget.classList.add('bad');
        fb.replaceChildren(feedback(ok, it.word), nextBtn());
      } }, o));
      body = h('div', { class: 'stack' }, opts);
    } else if (it.kind === 'write') {
      const inp = h('input', { type: 'text', autocapitalize: 'off', autocomplete: 'off', spellcheck: false, placeholder: 'Type the word…' });
      smartAccents(inp);
      let answered = false;
      const check = () => {
        if (answered || !inp.value.trim()) return;
        answered = true; inp.disabled = true;
        const r = checkAnswer(inp.value, [it.word]);
        const ok = r.verdict === 'exact' || (r.verdict === 'accent' && !u.strict);
        if (ok) score++;
        else addCard(`s:${it.word}`, 'sentence', { text: it.word }, { source: 'dictation', priority: true });
        fb.replaceChildren(feedback(ok, it.word, r.verdict === 'accent' ? h('div', { class: 'small' }, u.strict ? 'Only the vowel length is off, and in this unit length is the point: listen for how long the vowel is held.' : 'Only the vowel length differs: noted, not counted.') : null), nextBtn());
      };
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
      body = h('div', null, inp, accentBar(inp), h('div', { class: 'ex-actions' }, btn('Check', check, 'primary')));
      setTimeout(() => inp.focus(), 50);
    } else {
      head.replaceChildren(h('span', { class: 'tl', style: { fontSize: '1.8rem', fontWeight: 600 } }, it.word), h('span', { class: 'small muted' }, 'Read it aloud, then listen to check.'));
      let answered = false;
      const mark = (ok, heard) => {
        if (answered) return;
        answered = true;
        if (ok) score++;
        fb.replaceChildren(feedback(ok, it.word, heard ? h('div', { class: 'small muted' }, `The recogniser heard: “${heard}”`) : null), nextBtn());
      };
      body = h('div', null, micWidget({ label: 'Read it', autoStopMs: 4000, onDone: ({ transcript, alternatives = [] }) => {
        const said = [transcript, ...alternatives].map((x) => stripAccents(norm(x || '')));
        const target = stripAccents(norm(it.word));
        mark(said.some((x) => x === target || x.split(' ').includes(target)), transcript);
      } }), h('div', { class: 'ex-actions' }, btn('Skip (no microphone)', () => mark(false), 'ghost')));
    }
    wrap.replaceChildren(h('div', { class: 'small muted', style: { marginBottom: '8px' } }, `${i + 1} / ${run.length}`), h('div', { class: 'ex-card' }, head, body, fb));
    if (it.kind !== 'say') play();
  };
  show();
}
