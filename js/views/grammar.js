// Grammar: curriculum, topic pages (explain → structured input → practice), interleaved
// mixed practice, and two unlimited trainers driven by the word-form engine: verb conjugation
// and noun endings (cases with vowel harmony).
import { h, mount, btn, icon, ring, levelBadge, tabs, shuffle, pick, sample, sayBtn, toast, accentBar, smartAccents, card } from '../core/ui.js';
import { store, logDone, logError } from '../core/store.js';
import { TOPICS, LEVELS, topic as getTopic, topicsByLevel } from '../data/grammar.js';
import { mastery, recordItem, topicState, hashStr, levelIndex, dueTopics, startedTopics } from '../core/learner.js';
import { parseItem, runSession, renderExercise, solution, accentNote } from './exercise.js';
import { conjugate, present, past, PERSONS, PERSONS_EN, TENSES, verbs, verbInfo, nouns, caseForm, CASES, possessive } from '../core/morph.js';
import { harmony, rounded } from '../core/hu.js';
import { checkAnswer } from '../core/text.js';
import { speak } from '../core/speech.js';
import { addCard } from '../core/srs.js';
import { aiAvailable, generateExercises, friendlyError } from '../core/ai.js';

export const strand = 'language';

const CONTRASTS = [
  { id: 'helyek', title: 'Where: in, on, at, to, from', topics: ['hol', 'hova'] },
  { id: 'igek', title: 'Verb forms', topics: ['jelen', 'hatarozott', 'mult', 'lak-lek', 'feltetes'] },
  { id: 'fonevek', title: 'Noun endings', topics: ['tobbes', 'targy', 'birtokos', 'nak-val'] },
  { id: 'alapok', title: 'Basics', topics: ['alapok', 'van', 'harmonia', 'birtok'] },
];
const LANG = { ru: 'If you know Russian', it: 'Se sai l’italiano', en: 'For English speakers' };
const topicNotes = (t) => (store.state.profile.known || ['en']).filter((l) => t.notes?.[l]).map((l) => h('div', { class: 'note' }, h('b', `${LANG[l]}: `), t.notes[l]));

export async function render(root, params, ctx) {
  const [sub] = params;
  if (!sub) return renderIndex(root);
  if (sub === 'mix') return renderMix(root, ctx.params.get('set'));
  if (sub === 'conj') return renderConj(root, ctx.params);
  if (sub === 'ragok') return renderEndings(root);
  const t = getTopic(sub);
  if (!t) { location.hash = '#/grammar'; return; }
  return renderTopic(root, t, ctx.params.get('mode'));
}

// ---- Index ------------------------------------------------------------------------------
function statusLabel(ms) {
  if (ms.status === 'new') return h('span', { class: 'tag' }, 'new');
  if (ms.due) return h('span', { class: 't-due' }, 'review due');
  return h('span', { class: 'tag' }, ms.status);
}
function renderIndex(root) {
  const lvl = store.state.profile.level;
  const due = dueTopics();
  const started = startedTopics().length;
  mount(root,
    h('div', { class: 'page-head' }, h('h1', 'Nyelvtan'),
      h('p', { class: 'lead' }, `${TOPICS.length} topics from the very start to B1. Each one goes explanation → interpret-first activities → practice with instant explanations. Missed items return in your review queue; topics come back for review at expanding intervals.`)),
    h('div', { class: 'grid grid-3', style: { marginBottom: '8px' } },
      h('a', { class: 'tile', href: '#/grammar/mix' }, h('div', { class: 'tile-tag' }, 'Interleaved'), h('h3', 'Mixed practice'),
        h('p', null, started >= 2 ? `Items from your ${started} started topics, weighted toward weak and due ones.` : 'Unlocks after you start two topics.')),
      h('a', { class: 'tile', href: '#/grammar/ragok' }, h('div', { class: 'tile-tag' }, 'Unlimited'), h('h3', 'Endings trainer'),
        h('p', null, `${nouns().length} nouns × the case endings, plural and possessive, built by the engine. Vowel harmony on every item.`)),
      h('a', { class: 'tile', href: '#/grammar/conj' }, h('div', { class: 'tile-tag' }, 'Unlimited'), h('h3', 'Conjugation trainer'),
        h('p', null, `${verbs().length} verbs: present and past, indefinite and definite.`))),
    h('h3', { style: { marginTop: '22px' } }, 'Contrast drills'),
    h('p', { class: 'muted small' }, 'Interleave confusable structures — choosing between them is the hard (and useful) part.'),
    h('div', { class: 'chips', style: { marginBottom: '10px' } }, CONTRASTS.map((c) => h('a', { class: 'chip', href: `#/grammar/mix?set=${c.id}` }, c.title))),
    due.length ? h('div', { class: 'note' }, h('b', 'Due for review: '), due.slice(0, 6).map((d, i) => [i ? ', ' : '', h('a', { href: `#/grammar/${d.t.id}?mode=practice` }, d.t.title)])) : null,
    LEVELS.filter((L) => topicsByLevel(L).length).map((L) => h('div', null,
      h('div', { class: 'level-head' }, levelBadge(L), h('h2', { style: { margin: 0 } }, { A1: 'Kezdő · Beginner', A2: 'Alapfok · Elementary', B1: 'Középfok · Intermediate', B2: 'Upper intermediate', C1: 'Advanced' }[L]),
        lvl === L ? h('span', { class: 'tag' }, 'your level') : null),
      h('div', { class: 'grid grid-2' }, topicsByLevel(L).map((t) => {
        const ms = mastery(t.id);
        return h('a', { class: 'topic', href: `#/grammar/${t.id}` },
          ring(ms.m, { size: 42, label: ms.n ? Math.round(ms.m * 100) : '–' }),
          h('div', { style: { flex: 1, minWidth: 0 } }, h('div', { class: 't-title' }, t.title), h('div', { class: 't-en' }, t.en)),
          statusLabel(ms));
      })))));
}

// ---- Topic page ---------------------------------------------------------------------------
function chooseItems(t, n = 10) {
  const st = topicState(t.id);
  const scored = t.items.map((src) => {
    const it = st.items[hashStr(src)];
    let w;
    if (!it) w = 3 + Math.random();                       // unseen first
    else w = (1 - it.c / it.n) * 2 + (it.lastScore < 1 ? 1.5 : 0) + Math.min(1.5, (Date.now() - it.last) / 864e5 / 7) + Math.random() * 0.5;
    return { src, w };
  });
  return scored.sort((a, b) => b.w - a.w).slice(0, n).map((x) => ({ src: x.src, topic: t.id }));
}

function renderTopic(root, t, mode) {
  const st = topicState(t.id);
  let tab = mode === 'practice' ? 'practice' : !st.intro ? 'learn' : 'practice';
  const head = h('div');
  const body = h('div');
  let cleanupSession = null;

  const drawHead = () => {
    const ms = mastery(t.id);
    head.replaceChildren(
      h('div', { class: 'crumbs' }, h('a', { href: '#/grammar' }, '← Nyelvtan')),
      h('div', { class: 'row between page-head' },
        h('div', null, h('div', { class: 'row' }, levelBadge(t.level), h('span', { class: 'muted small' }, t.en)), h('h1', { style: { marginTop: '6px' } }, t.title), h('p', { class: 'lead' }, t.summary)),
        h('div', { class: 'row' }, ring(ms.m, { size: 64, stroke: 6, label: ms.n ? `${Math.round(ms.m * 100)}%` : '–' }),
          h('div', { class: 'small muted' }, ms.n ? `${ms.n} answers` : 'Not started', h('br'), ms.last ? (ms.due ? h('b', { style: { color: 'var(--accent)' } }, 'Review due') : `Next review in ${Math.max(1, Math.round(ms.interval - ms.days))} d`) : ''))),
      tabs([
        ['learn', '1 · Learn'], ['input', '2 · Interpret'], ['practice', '3 · Practice'],
        ...(t.drill ? [['drill', 'Verb drill']] : []),
        ...(aiAvailable() ? [['ai', '✦ More (AI)']] : []),
      ], tab, (id) => { tab = id; draw(); }));
  };

  const draw = () => {
    cleanupSession?.(); cleanupSession = null;
    drawHead();
    if (tab === 'learn') {
      body.replaceChildren(card(h('div', { class: 'explain', html: t.explain })), ...topicNotes(t), card(
        h('div', { class: 'ex-actions' }, btn(['Next: interpret first ', icon('arrow', 16)], () => { tab = 'input'; draw(); }, 'primary'),
          btn('Skip to practice', () => { st.intro = true; store.save(); tab = 'practice'; draw(); }, 'ghost'))),
        h('p', { class: 'why' }, h('b', 'Why this order? '), 'Processing-instruction research (VanPatten & Cadierno, 1993) found that learners who first had to interpret the form for meaning improved in both comprehension and production — those drilled on production improved only in production.'));
      const tables = body.querySelectorAll('.explain .ex, .explain em');
      tables.forEach((el) => { el.style.cursor = 'pointer'; el.title = 'Click to listen'; el.addEventListener('click', () => speak(el.textContent.replace(/[·]/g, ','))); });
    } else if (tab === 'input') {
      renderInput(body, t, () => { st.intro = true; store.save(); tab = 'practice'; draw(); });
    } else if (tab === 'practice') {
      const entries = chooseItems(t, 10);
      cleanupSession = runSession(body, entries, {
        title: `${t.title} — practice`,
        onItem: (entry, r) => { recordItem(t.id, entry.src, r.score); },
        onFinish: () => {
          st.intro = true; store.save();
          logDone(`g-${t.id}`);
          drawHead();
          return [btn('Another round', () => draw(), 'primary'), btn('Mixed practice', () => { location.hash = '#/grammar/mix'; }), btn('All topics', () => { location.hash = '#/grammar'; }, 'ghost')];
        },
      });
    } else if (tab === 'drill') {
      body.replaceChildren();
      cleanupSession = conjSession(body, { verbsList: t.drill.verbs, tenses: t.drill.tenses, def: t.drill.def, count: 12, topicId: t.id });
    } else if (tab === 'ai') {
      renderAiMore(body, t, (c) => { cleanupSession = c; });
    }
  };
  mount(root, head, body);
  draw();
  return () => cleanupSession?.();
}

// Structured input activity: the learner must attend to the form to get the meaning.
function renderInput(body, t, onDone) {
  const inp = t.input;
  if (!inp) { onDone(); return; }
  const items = inp.items.map((s) => {
    const [main, expl = ''] = s.split(' ~ ');
    const qi = main.lastIndexOf(' ? ');
    const sentence = main.slice(0, qi).trim();
    const opts = main.slice(qi + 3).split('|').map((o) => o.trim());
    const correct = opts.find((o) => o.endsWith('*')).replace(/\*$/, '');
    return { sentence, options: opts.map((o) => o.replace(/\*$/, '')), correct, explain: expl };
  });
  let i = 0, right = 0;
  const show = () => {
    if (i >= items.length) {
      body.replaceChildren(h('div', { class: 'ex-card' }, h('h3', `Interpretation: ${right} / ${items.length}`),
        h('p', { class: 'muted' }, 'Now you will produce the form yourself.'),
        h('div', { class: 'ex-actions' }, btn(['Start practice ', icon('arrow', 16)], onDone, 'primary'))));
      return;
    }
    const it = items[i];
    let done = false;
    const fb = h('div');
    const sentenceEl = inp.audio
      ? h('div', { class: 'row' }, sayBtn(it.sentence, { cls: 'big', size: 24 }), h('span', { class: 'muted' }, 'Listen (you can replay)'))
      : h('div', { class: 'ex-prompt tl', style: { marginBottom: '8px' } }, it.sentence, ' ', sayBtn(it.sentence));
    const buttons = it.options.map((o) => h('button', { class: 'opt', type: 'button', onclick: () => {
      if (done) return; done = true;
      const ok = o === it.correct; if (ok) right++;
      buttons.forEach((b) => { b.disabled = true; if (b.dataset.v === it.correct) b.classList.add('ok'); else if (b.dataset.v === o) b.classList.add('bad'); });
      fb.replaceChildren(h('div', { class: `feedback ${ok ? 'ok' : 'bad'}` }, h('div', { class: 'fb-body' },
        inp.audio ? h('div', { class: 'full' }, it.sentence) : null, h('div', { class: 'small' }, it.explain))),
        h('div', { class: 'ex-actions' }, btn(['Next ', icon('arrow', 16)], () => { i++; show(); }, 'primary', { id: 'next-btn' })));
      body.querySelector('#next-btn')?.focus();
    }, 'data-v': o }, o));
    body.replaceChildren(h('div', { class: 'ex-card' },
      h('div', { class: 'ex-meta' }, h('span', { class: 'tag' }, 'Interpret'), `${i + 1} / ${items.length}`),
      h('p', { class: 'muted' }, inp.q), sentenceEl, h('div', { class: 'options', style: { marginTop: '14px' } }, buttons), fb));
    if (inp.audio) setTimeout(() => speak(it.sentence), 200);
  };
  show();
}

async function renderAiMore(body, t, setCleanup) {
  body.replaceChildren(card(h('p', null, 'Generating 8 fresh items for this topic…'), h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: '40%' } }))));
  try {
    const res = await generateExercises({ topicTitle: `${t.title} (${t.en})`, explanation: t.explain.replace(/<[^>]+>/g, ' '), level: t.level, n: 8, avoid: t.items.map((s) => parseItem(s)).map(solution) });
    const entries = res.items.map((x) => {
      const ans = [x.answer, ...x.alternatives].map((a) => a.replace(/[{}|:]/g, '')).join('|');
      const src = `${x.before}{${ans}${x.hint ? ':' + x.hint.replace(/[{}|:]/g, '') : ''}}${x.after} ~ ${x.explanation}`;
      return { src, topic: t.id };
    });
    setCleanup(runSession(body, entries, {
      title: `${t.title} — AI-generated items`,
      onItem: (entry, r) => recordItem(t.id, entry.src, r.score, { source: 'grammar-ai' }),
      onFinish: () => [btn('Generate more', () => renderAiMore(body, t, setCleanup), 'primary')],
    }));
  } catch (e) {
    body.replaceChildren(card(h('p', null, friendlyError(e))));
  }
}

// ---- Mixed (interleaved) practice ------------------------------------------------------------
function renderMix(root, setId) {
  const set = CONTRASTS.find((c) => c.id === setId);
  let pool;
  if (set) pool = set.topics.map(getTopic).filter(Boolean);
  else {
    const started = startedTopics();
    pool = started.length >= 2 ? started : TOPICS.filter((t) => levelIndex(t.level) <= levelIndex(store.state.profile.level || 'A1'));
  }
  // weight topics: weak and due ones get more items
  const weights = pool.map((t) => { const ms = mastery(t.id); return { t, w: (ms.n ? 1.2 - ms.m : 0.8) + (ms.due ? 0.6 : 0) + 0.2 }; });
  const entries = [];
  const target = 15;
  for (let k = 0; k < target * 3 && entries.length < target; k++) {
    const total = weights.reduce((a, b) => a + b.w, 0);
    let r = Math.random() * total, chosen = weights[0];
    for (const x of weights) { r -= x.w; if (r <= 0) { chosen = x; break; } }
    const cand = chooseItems(chosen.t, 3).find((e) => !entries.some((x) => x.src === e.src));
    if (cand && entries[entries.length - 1]?.topic !== cand.topic) entries.push(cand);
  }
  const head = h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/grammar' }, '← Nyelvtan')),
    h('h1', set ? `Contrast drill: ${set.title}` : 'Mixed practice'),
    h('p', { class: 'lead' }, set ? 'Items from related topics are shuffled together, so each time you must first decide which rule applies.' :
      'Items from different topics, never two in a row from the same one. Weak and due topics appear more often.'));
  const body = h('div');
  mount(root, head, body);
  return runSession(body, entries, {
    metaFor: (e) => [levelBadge(getTopic(e.topic).level), h('span', null, getTopic(e.topic).title)],
    onItem: (entry, r) => recordItem(entry.topic, entry.src, r.score),
    onFinish: () => { logDone('mix'); return [btn('Another mixed round', () => renderMix(root, setId), 'primary'), btn('Back to topics', () => { location.hash = '#/grammar'; }, 'ghost')]; },
  });
}

// ---- Conjugation trainer --------------------------------------------------------------------
const IRREGULAR_VERBS = ['van', 'megy', 'jön', 'eszik', 'iszik', 'alszik', 'tesz', 'vesz', 'visz', 'hisz', 'lesz'];
const CONJ_MODES = [['ind', 'Indefinite'], ['def', 'Definite'], ['mix', 'Both, mixed']];

function renderConj(root, query) {
  const saved = store.state.conjPrefs || {};
  const sel = new Set(saved.tenses || ['pres']);
  let pool = saved.pool || 'all';
  let mode = saved.mode || 'ind';
  const body = h('div');
  const controls = h('div');
  const chips = (items, active, set) => h('div', { class: 'chips', style: { marginBottom: '6px' } }, items.map(([id, label]) =>
    h('button', { class: `chip ${active(id) ? 'on' : ''}`, onclick: () => { set(id); drawControls(); } }, label)));
  const drawControls = () => controls.replaceChildren(card(
    h('h3', 'Tense'), chips(Object.entries(TENSES).map(([k, t]) => [k, `${t.name} · ${t.en}`]), (k) => sel.has(k), (k) => { if (sel.has(k) && sel.size > 1) sel.delete(k); else sel.add(k); }),
    h('h3', { style: { marginTop: '14px' } }, 'Conjugation'),
    h('p', { class: 'small muted' }, 'Definite = the form used with a definite object (látom a házat). Mixing both is harder now and better later.'),
    chips(CONJ_MODES, (k) => mode === k, (k) => { mode = k; }),
    h('h3', { style: { marginTop: '14px' } }, 'Verbs'),
    chips([['all', `All ${verbs().length}`], ['irregular', 'Irregular only'], ['mistakes', 'My mistakes']], (k) => pool === k, (k) => { pool = k; }),
    h('div', { class: 'ex-actions' }, btn(['Start 20 ', icon('arrow', 16)], () => {
      store.state.conjPrefs = { tenses: [...sel], pool, mode }; store.save();
      controls.replaceChildren();
      conjSession(body, { tenses: [...sel], pool, def: mode, count: 20, onEnd: () => drawControls() });
    }, 'primary'))));
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/grammar' }, '← Nyelvtan')), h('h1', 'Conjugation trainer'),
    h('p', { class: 'lead' }, 'Type the form. Mistakes show the whole table and become review cards.')), controls, body);
  drawControls();
  const v = query.get('verb');
  if (v) { controls.replaceChildren(); conjSession(body, { verbsList: [v], tenses: [...sel], def: mode, count: 12, onEnd: drawControls }); }
}

function verbPool(pool) {
  if (pool === 'irregular') return IRREGULAR_VERBS;
  if (pool === 'mistakes') {
    const list = Object.values(store.state.cards).filter((c) => c.type === 'conj').map((c) => c.data.verb);
    if (list.length) return [...new Set(list)];
  }
  return verbs();
}

// def: true, false, 'mix' (or the topic's 'mix'/'ind'/'def' setting)
export function makeConjTask(verb, tense, def = false) {
  const info = verbInfo(verb);
  const wantDef = def === 'mix' ? Math.random() < 0.5 : def === true || def === 'def';
  const d = wantDef && info.transitive;
  const person = pick([0, 1, 2, 3, 4, 5]);
  const form = conjugate(verb, tense, person, d);
  if (!form) return null;
  // -ik verbs: én dolgozom, but dolgozok is common too
  const answers = [form];
  if (!d && tense === 'pres' && info.ik && person === 0) answers.push(info.stem + (info.back ? 'ok' : info.round ? 'ök' : 'ek'));
  return { verb, tense, person, def: d, answers };
}

function conjSession(root, { verbsList, tenses, pool, def = 'ind', count = 20, topicId, onEnd }) {
  const list = verbsList || verbPool(pool);
  const tasks = [];
  for (let k = 0; k < count * 3 && tasks.length < count; k++) {
    const t = makeConjTask(pick(list), pick(tenses), def);
    if (t) tasks.push(t);
  }
  let i = 0, score = 0;
  const wrap = h('div');
  root.replaceChildren(wrap);
  let onKey = null;
  const show = () => {
    if (onKey) document.removeEventListener('keydown', onKey);
    if (i >= tasks.length) {
      wrap.replaceChildren(h('div', { class: 'ex-card' }, h('div', { class: 'summary-big' }, `${Math.round((score / tasks.length) * 100)}%`),
        h('p', { class: 'muted' }, `${tasks.length} forms. Wrong ones were added to your review queue.`),
        h('div', { class: 'ex-actions' }, btn('Again', () => conjSession(root, { verbsList, tenses, pool, def, count, topicId, onEnd }), 'primary'), onEnd ? btn('Change settings', () => { wrap.remove(); onEnd(); }) : null)));
      logDone('conj');
      return;
    }
    const task = tasks[i];
    const info = verbInfo(task.verb);
    const inp = h('input', { type: 'text', class: 'blank', style: { width: '16ch', fontSize: '1.4rem' }, autocomplete: 'off', autocapitalize: 'off', spellcheck: false });
    smartAccents(inp);
    const fb = h('div');
    let answered = false;
    const label = `${TENSES[task.tense].name}${task.def ? ' · határozott' : ''}`;
    const check = (giveUp = false) => {
      if (answered) return;
      if (!giveUp && !inp.value.trim()) return;
      answered = true;
      const r = giveUp ? { verdict: 'wrong' } : checkAnswer(inp.value, task.answers);
      const accentOnly = r.verdict === 'accent' && !store.state.settings.strictAccents;
      const s = r.verdict === 'exact' || accentOnly ? 1 : 0;
      score += s;
      inp.disabled = true;
      inp.classList.add(s ? 'ok' : 'bad');
      const key = `conj:${task.tense}${task.def ? ':def' : ''}`;
      const ts = topicState(key); ts.hist.push([Date.now(), s]); if (ts.hist.length > 80) ts.hist.shift();
      if (topicId) recordItem(topicId, `${task.verb}|${task.tense}|${task.person}|${task.def}`, s, { source: 'conjugation', card: false });
      if (s < 1) {
        addCard(`c:${task.verb}:${task.tense}:${task.person}:${task.def ? 'd' : 'i'}`, 'conj', { verb: task.verb, tense: task.tense, person: task.person, def: task.def }, { source: 'conjugation', priority: true });
        if (s === 0) logError({ source: 'conjugation', cat: task.def ? 'definite' : 'conjugation', topic: task.tense === 'past' ? 'mult' : task.def ? 'hatarozott' : 'jelen', text: `${task.verb} · ${label} · ${PERSONS[task.person]}`, fix: task.answers[0] });
      }
      const forms = (task.tense === 'past' ? past : present)(task.verb, { def: task.def }) || [];
      const table = h('table', { class: 'conj-table' }, forms.map((f, p) => h('tr', { class: p === task.person ? 'target' : '' }, h('td', PERSONS[p]), h('td', { class: 'tl' }, f))));
      fb.replaceChildren(h('div', { class: `feedback ${s ? 'ok' : 'bad'}` },
        h('div', { class: 'fb-body' }, h('div', { class: 'fb-title' }, s ? 'Igen!' : `Answer: ${task.answers[0]}`),
          accentOnly ? accentNote([r.match]) : null,
          h('div', { style: { marginTop: '8px' } }, table)), sayBtn(task.answers[0])),
        h('div', { class: 'ex-actions' }, btn(['Next ', icon('arrow', 16)], () => { i++; show(); }, 'primary', { id: 'next-btn' })));
      setTimeout(() => wrap.querySelector('#next-btn')?.focus(), 20);
    };
    onKey = (e) => {
      if (e.key !== 'Enter' || ['BUTTON', 'A'].includes(document.activeElement?.tagName)) return;
      e.preventDefault();
      if (answered) { i++; show(); } else check();
    };
    document.addEventListener('keydown', onKey);
    wrap.replaceChildren(
      h('div', { class: 'progress-top' }, h('span', { class: 'small muted' }, `${i + 1} / ${tasks.length}`), h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: `${(i / tasks.length) * 100}%` } }))),
      h('div', { class: 'ex-card' },
        h('div', { class: 'ex-meta' }, h('span', { class: 'tag' }, label), h('span', null, `${TENSES[task.tense].en}${task.def ? ', with a definite object' : ''}`)),
        h('div', { class: 'ex-prompt' }, h('b', { class: 'tl' }, task.verb), info.en ? h('span', { class: 'hint' }, `(${info.en})`) : null, h('br'),
          h('span', { class: 'muted', style: { fontSize: '1rem' } }, `${PERSONS[task.person]} (${PERSONS_EN[task.person]}) → `), inp,
          task.def ? h('span', { class: 'muted', style: { fontSize: '1rem' } }, ' … a …-t') : null),
        accentBar(inp),
        h('div', { class: 'ex-actions' }, btn('Check', () => check(), 'primary'), btn('Show', () => check(true), 'ghost')),
        fb));
    setTimeout(() => inp.focus(), 20);
  };
  show();
  return () => onKey && document.removeEventListener('keydown', onKey);
}

// ---- Endings trainer: cases, plural, possessive -------------------------------------------------
const PHRASE = { acc: 'X (as the object)', ine: 'in the X', ill: 'into the X', ela: 'out of the X', sup: 'on the X', sub: 'onto the X', del: 'off / about the X',
  ade: 'at, by the X', all: 'to the X (up to it)', abl: 'from the X (from beside it)', dat: 'to / for the X', ins: 'with the X', ter: 'as far as the X', cau: 'for the X' };
const ENDING_SETS = [
  ['hol', 'Where? -ban, -on, -nál', ['ine', 'sup', 'ade']],
  ['grid', 'All 9 place endings', ['ine', 'ill', 'ela', 'sup', 'sub', 'del', 'ade', 'all', 'abl']],
  ['core', 'Object, to/for, with', ['acc', 'dat', 'ins']],
  ['poss', 'Possessive: my, your…', ['poss']],
];

function harmonyWhy(word) {
  const hm = harmony(word);
  return hm === 'back' ? `${word} has back vowels → back ending` : rounded(word) ? `${word} ends in a rounded front vowel → -ö- version` : `${word} has front vowels → front ending`;
}

function renderEndings(root) {
  let set = store.state.endingPrefs?.set || 'hol';
  let plural = store.state.endingPrefs?.plural || false;
  const body = h('div');
  const controls = h('div');
  const drawControls = () => controls.replaceChildren(card(
    h('h3', 'What to practise'),
    h('div', { class: 'chips', style: { marginBottom: '8px' } }, ENDING_SETS.map(([id, label]) => h('button', { class: `chip ${set === id ? 'on' : ''}`, onclick: () => { set = id; drawControls(); } }, label))),
    set !== 'poss' ? h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: plural, onchange: (e) => { plural = e.target.checked; } }), 'Mix in plurals (házakban, kertekből)') : null,
    h('div', { class: 'ex-actions' }, btn(['Start 15 ', icon('arrow', 16)], () => {
      store.state.endingPrefs = { set, plural }; store.save();
      controls.replaceChildren();
      endingSession(body, { set, plural, onEnd: drawControls });
    }, 'primary'))));
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/grammar' }, '← Nyelvtan')), h('h1', 'Endings trainer'),
    h('p', { class: 'lead' }, 'Build the word: noun + meaning → the right ending, with vowel harmony and the stem changes (ház → házat, víz → vizet, ló → lovon). Every form comes from the engine, checked against Wiktionary.')),
    controls, body);
  drawControls();
}

function endingSession(root, { set, plural, onEnd, count = 15 }) {
  const cases = ENDING_SETS.find((x) => x[0] === set)[2];
  const pool = nouns();
  const tasks = [];
  for (let k = 0; k < count; k++) {
    const n = pick(pool);
    if (set === 'poss') {
      const person = pick([0, 1, 2, 3, 4, 5]);
      tasks.push({ n, kind: 'poss', person, answer: possessive(n.nom, person), prompt: `${['my', 'your', 'his/her', 'our', 'your (pl.)', 'their'][person]} ${n.en.split(/[;,]/)[0]}` });
    } else {
      const c = pick(cases);
      const pl = plural && Math.random() < 0.4;
      tasks.push({ n, kind: c, plural: pl, answer: caseForm(n.nom, c, { plural: pl }), prompt: PHRASE[c].replace('X', `${n.en.split(/[;,]/)[0]}${pl ? 's' : ''}`) });
    }
  }
  let i = 0, score = 0;
  const wrap = h('div');
  root.replaceChildren(wrap);
  let onKey = null;
  const show = () => {
    if (onKey) document.removeEventListener('keydown', onKey);
    if (i >= tasks.length) {
      logDone('endings');
      wrap.replaceChildren(h('div', { class: 'ex-card' }, h('div', { class: 'summary-big' }, `${Math.round((score / tasks.length) * 100)}%`),
        h('p', { class: 'muted' }, 'Wrong ones were added to your review queue.'),
        h('div', { class: 'ex-actions' }, btn('Again', () => endingSession(root, { set, plural, onEnd }), 'primary'), btn('Change settings', () => { wrap.remove(); onEnd(); }))));
      return;
    }
    const t = tasks[i];
    const inp = h('input', { type: 'text', class: 'blank', style: { width: '18ch', fontSize: '1.4rem' }, autocomplete: 'off', autocapitalize: 'off', spellcheck: false });
    smartAccents(inp);
    const fb = h('div');
    let answered = false;
    const check = (giveUp = false) => {
      if (answered || (!giveUp && !inp.value.trim())) return;
      answered = true;
      const r = giveUp ? { verdict: 'wrong' } : checkAnswer(inp.value.replace(/^(a|az)\s+/i, ''), [t.answer]);
      const accentOnly = r.verdict === 'accent' && !store.state.settings.strictAccents;
      const s = r.verdict === 'exact' || accentOnly ? 1 : 0;
      score += s;
      inp.disabled = true; inp.classList.add(s ? 'ok' : 'bad');
      const topicId = t.kind === 'poss' ? 'birtokos' : ['ine', 'sup', 'ade'].includes(t.kind) ? 'hol' : ['acc'].includes(t.kind) ? 'targy' : ['dat', 'ins'].includes(t.kind) ? 'nak-val' : 'hova';
      recordItem(topicId, `ending|${t.n.nom}|${t.kind}|${t.plural || t.person}`, s, { source: 'endings', card: false });
      if (!s) {
        addCard(`e:${t.n.nom}:${t.kind}:${t.plural ? 'pl' : t.person ?? ''}`, 'custom', { front: `${t.n.nom} → ${t.prompt}`, back: t.answer }, { source: 'endings', priority: true });
        logError({ source: 'endings', cat: t.kind === 'poss' ? 'possessive' : 'case', topic: topicId, text: `${t.n.nom} → ${t.prompt}`, fix: t.answer });
      }
      const changed = t.kind !== 'poss' && !t.plural && !t.answer.startsWith(t.n.nom.replace(/[ae]$/, ''));
      fb.replaceChildren(h('div', { class: `feedback ${s ? 'ok' : 'bad'}` },
        h('div', { class: 'fb-body' }, h('div', { class: 'fb-title' }, s ? 'Igen!' : `Answer: ${t.answer}`),
          accentOnly ? accentNote([r.match]) : null,
          t.kind !== 'poss' && CASES[t.kind]?.end.length > 1 ? h('div', { class: 'small' }, harmonyWhy(t.plural ? t.n.pl : t.n.nom), t.kind === 'ins' ? '; the v of -val/-vel copies a final consonant' : '', '.') : null,
          changed ? h('div', { class: 'small muted' }, `The stem changes: ${t.n.nom} → ${t.n.pl} (plural), ${t.n.acc} (object).`) : null,
          t.kind === 'poss' ? h('div', { class: 'small muted' }, `${t.n.nom}: ${[0, 1, 2, 3, 4, 5].map((p) => possessive(t.n.nom, p)).join(', ')}`) : null), sayBtn(t.answer)),
        h('div', { class: 'ex-actions' }, btn(['Next ', icon('arrow', 16)], () => { i++; show(); }, 'primary', { id: 'next-btn' })));
      setTimeout(() => wrap.querySelector('#next-btn')?.focus(), 20);
    };
    onKey = (e) => {
      if (e.key !== 'Enter' || ['BUTTON', 'A'].includes(document.activeElement?.tagName)) return;
      e.preventDefault();
      if (answered) { i++; show(); } else check();
    };
    document.addEventListener('keydown', onKey);
    wrap.replaceChildren(
      h('div', { class: 'progress-top' }, h('span', { class: 'small muted' }, `${i + 1} / ${tasks.length}`), h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: `${(i / tasks.length) * 100}%` } }))),
      h('div', { class: 'ex-card' },
        h('div', { class: 'ex-meta' }, h('span', { class: 'tag' }, t.kind === 'poss' ? 'possessive' : `-${CASES[t.kind].end.join('/-')}`)),
        h('div', { class: 'ex-prompt' }, h('b', { class: 'tl' }, t.n.nom), h('span', { class: 'hint' }, `(${t.n.en})`), h('br'),
          h('span', { class: 'muted', style: { fontSize: '1rem' } }, `${t.prompt} → `), inp),
        accentBar(inp),
        h('div', { class: 'ex-actions' }, btn('Check', () => check(), 'primary'), btn('Show', () => check(true), 'ghost')),
        fb));
    setTimeout(() => inp.focus(), 20);
  };
  show();
  return () => onKey && document.removeEventListener('keydown', onKey);
}
