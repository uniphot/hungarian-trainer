// Ma: the beginner's roadmap, the daily plan (four strands), weekly balance, weak spots and reflection.
import { h, mount, btn, card, icon, levelBadge, toast } from '../core/ui.js';
import { store, STRANDS, minutesByStrand, streak, today } from '../core/store.js';
import { dailyPlan, errorProfile, mastery, startedTopics } from '../core/learner.js';
import { stats } from '../core/srs.js';
import { TOPICS } from '../data/grammar.js';
import { UNITS } from '../data/reading.js';
import { topUpDeck } from './review.js';

export const strand = null;

const REFLECT = [
  'What did you do in Hungarian this week that went well?',
  'What was hardest, and what will you do differently next week?',
  'Where did you meet (or could you have met) Hungarian outside this app?',
];

export async function render(root) {
  topUpDeck();
  const p = store.state.profile;
  const plan = dailyPlan();
  const s = stats();
  const todayMin = Object.values(store.state.log[today()]?.min || {}).reduce((a, b) => a + b, 0);
  const week = minutesByStrand(7);
  const weekTotal = Object.values(week).reduce((a, b) => a + b, 0);
  const mastered = TOPICS.filter((t) => mastery(t.id).status === 'mastered').length;
  const errs = errorProfile(30).slice(0, 4);
  const lastReflection = store.state.journal.filter((j) => j.kind === 'weekly').slice(-1)[0];
  const needsReflection = weekTotal >= 20 && (!lastReflection || Date.now() - lastReflection.ts > 6 * 864e5);
  const hour = new Date().getHours();
  const greet = hour < 10 ? 'Jó reggelt' : hour < 18 ? 'Jó napot' : 'Jó estét';

  mount(root,
    h('div', { class: 'page-head' },
      h('h1', `${greet}.`),
      h('p', { class: 'lead' }, 'Your level: ', levelBadge(p.level || 'A1'), p.goalLevel ? [' · goal ', levelBadge(p.goalLevel)] : null, '. Here is a balanced session for today.')),

    roadmap(),

    h('div', { class: 'grid home-grid', style: { alignItems: 'start' } },
      card(
        h('div', { class: 'row between' }, h('h2', { style: { margin: 0 } }, 'Today’s plan'),
          h('span', { class: 'muted small' }, `${Math.round(todayMin)} / ${p.dailyMinutes} min today`)),
        h('div', { class: 'bar ok', style: { margin: '10px 0 6px' } }, h('div', { class: 'bar-fill', style: { width: `${Math.min(100, (todayMin / (p.dailyMinutes || 30)) * 100)}%` } })),
        plan.steps.map((st) => h('div', { class: `plan-step ${st.done ? 'done' : ''}` },
          h('span', { class: 'dot', style: { background: STRANDS[st.strand]?.color } }),
          h('div', { class: 'ps-body' }, h('div', { class: 'ps-title' }, st.title), h('div', { class: 'ps-why' }, st.why)),
          h('span', { class: 'small muted' }, `~${st.min}′`),
          st.done ? h('span', { class: 'tag' }, '✓ done') : h('a', { class: 'btn small', href: st.href }, 'Go'))),
        h('p', { class: 'small muted', style: { marginTop: '10px' } }, 'Order matters: retrieval first while you are fresh, then focused study, then using Hungarian for meaning, then fluency.')),
      h('div', null,
        card(h('div', { class: 'row', style: { gap: '22px' } },
          h('div', { class: 'stat' }, h('span', { class: 'v' }, streak()), h('span', { class: 'l' }, 'day streak')),
          h('div', { class: 'stat' }, h('span', { class: 'v' }, s.due), h('span', { class: 'l' }, 'cards due')),
          h('div', { class: 'stat' }, h('span', { class: 'v' }, `${startedTopics().length}`), h('span', { class: 'l' }, `topics started · ${mastered} mastered`)))),
        card(h('h3', 'This week’s balance'),
          weekTotal < 1 ? h('p', { class: 'small muted' }, 'No activity yet this week.') : [
            h('div', { class: 'strands' }, Object.entries(week).map(([k, v]) => h('div', { style: { width: `${(v / weekTotal) * 100}%`, background: STRANDS[k].color }, title: `${STRANDS[k].en}: ${Math.round(v)} min` }))),
            h('div', { class: 'legend' }, Object.entries(STRANDS).map(([k, v]) => h('span', null, h('i', { style: { background: v.color } }), `${v.en} ${Math.round(week[k])}′`))),
            h('p', { class: 'small', style: { marginTop: '10px' } }, h('b', 'Most behind: '), STRANDS[plan.behind].en.toLowerCase(), ' — today’s plan gives it more time.')],
          h('p', { class: 'small muted', style: { marginTop: '8px' } }, 'Nation’s “four strands”: a balanced learner spends roughly equal time on each.')),
        errs.length ? card(h('h3', 'Your recurring errors (30 days)'),
          errs.map((e) => h('div', { class: 'err-row' }, h('span', { class: 'badge soft' }, e.n),
            h('div', { style: { flex: 1 } }, h('div', null, e.topic ? e.topic.title : e.key), h('div', { class: 'small muted' }, e.sources.join(', '))),
            e.topic ? h('a', { class: 'btn small', href: `#/grammar/${e.topic.id}?mode=practice` }, 'Practise') : null)),
          h('a', { href: '#/progress', class: 'small' }, 'Full error log →')) : null)),

    needsReflection ? reflectionCard() : null,
  );
  // simple responsive fallback for the two-column grid
  const grid = root.querySelector('.home-grid');
  const fit = () => { grid.style.gridTemplateColumns = innerWidth < 900 ? '1fr' : 'minmax(0, 1.5fr) minmax(0, 1fr)'; };
  fit(); addEventListener('resize', fit);
  return () => removeEventListener('resize', fit);
}

// From zero to a working A1: five milestones, each with its own measure of progress.
const BASICS = ['alapok', 'van', 'harmonia', 'tobbes', 'jelen', 'targy', 'hol'];
function roadmap() {
  const reading = UNITS.filter((u) => (store.state.reading[u.id]?.best || 0) >= 0.8).length;
  const numbers = Object.values(store.state.numbers).reduce((a, x) => a + (x.right || 0), 0);
  const words = Object.values(store.state.cards).filter((c) => c.type === 'vocab' && c.state && c.state !== 'new').length;
  const grammar = BASICS.filter((id) => (store.state.topics[id]?.hist?.length || 0) >= 8).length;
  const listened = Object.values(store.state.real.minutes).reduce((a, b) => a + b, 0);
  const steps = [
    ['Read and pronounce anything', `${reading} / ${UNITS.length} units`, reading / UNITS.length, '#/reading'],
    ['Count, pay and tell the time', `${Math.min(numbers, 150)} / 150 answers`, Math.min(1, numbers / 150), '#/numbers'],
    ['Your first 100 words', `${Math.min(words, 100)} / 100`, Math.min(1, words / 100), '#/review'],
    ['The core grammar', `${grammar} / ${BASICS.length} topics`, grammar / BASICS.length, `#/grammar/${BASICS.find((id) => (store.state.topics[id]?.hist?.length || 0) < 8) || 'mix'}`],
    ['An hour of real Hungarian', `${Math.round(Math.min(listened, 60))} / 60 min`, Math.min(1, listened / 60), '#/listening/real'],
  ];
  if (steps.every(([, , f]) => f >= 1)) return null;
  const current = steps.findIndex(([, , f]) => f < 1);
  return card(h('h3', 'Kezdő út · The beginner’s road'),
    h('p', { class: 'small muted' }, 'Five milestones from zero to a working A1. Work on the first unfinished one most days; the daily plan below mixes in the rest.'),
    steps.map(([title, detail, f, href], i) => h('a', { class: `plan-step ${f >= 1 ? 'done' : ''}`, href, style: { textDecoration: 'none', color: 'inherit' } },
      h('span', { class: 'tag' }, f >= 1 ? '✓' : String(i + 1)),
      h('div', { class: 'ps-body' }, h('div', { class: 'ps-title' }, title, i === current ? h('span', { class: 'tag', style: { marginLeft: '8px' } }, 'now') : null), h('div', { class: 'bar', style: { marginTop: '6px' } }, h('div', { class: 'bar-fill', style: { width: `${Math.round(f * 100)}%` } }))),
      h('span', { class: 'small muted' }, detail))));
}

function reflectionCard() {
  const areas = REFLECT.map((q) => ({ q, el: h('textarea', { rows: 2, style: { minHeight: '60px' } }) }));
  return card(h('h3', 'Weekly reflection'),
    h('p', { class: 'small muted' }, 'Self-regulated learners plan, monitor and reflect. Two minutes of honest reflection helps you steer the next week. (English or Hungarian — Hungarian counts as writing practice!)'),
    areas.map(({ q, el }) => h('label', { class: 'field' }, h('span', q), el)),
    h('div', { class: 'ex-actions' }, btn('Save reflection', () => {
      const text = areas.map(({ q, el }) => `${q}\n${el.value.trim()}`).join('\n\n');
      if (areas.every(({ el }) => !el.value.trim())) return toast('Write at least one answer.');
      store.state.journal.push({ ts: Date.now(), kind: 'weekly', text });
      store.save(); toast('Saved — see Progress → Journal', 'ok');
      location.reload();
    }, 'primary')));
}
