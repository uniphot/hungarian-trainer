// Számok: numbers, prices, clock times and dates. How they are built, then unlimited generated
// drills in both directions (hear → digits, digits → words), since numbers are among the
// hardest things to catch by ear.
import { h, mount, btn, card, icon, shuffle, pick, sayBtn, accentBar, smartAccents } from '../core/ui.js';
import { store, logDone } from '../core/store.js';
import { speak, stopSpeaking } from '../core/speech.js';
import { checkAnswer } from '../core/text.js';
import { numHu, ordinalHu, timeHu, priceHu, fmtNum, MONTHS, dayOfMonth } from '../core/numbers.js';
import { addCard } from '../core/srs.js';

export const strand = 'language';

const RANGES = { small: [0, 20, '0–20'], tens: [0, 100, '0–100'], hundreds: [100, 999, '100–999'], big: [1000, 99999, '1000+'] };
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const clock = (hh, mm) => `${hh}:${String(mm).padStart(2, '0')}`;

// Each kind makes one item: say (what is spoken), prompt, and either answers (typed) or options.
const KINDS = {
  hear: { title: 'Hear it → type the digits', en: 'Listening', make: (r) => { const n = rand(...RANGES[r].slice(0, 2)); return { say: numHu(n), answers: [String(n), fmtNum(n)], show: null, reveal: `${fmtNum(n)} = ${numHu(n)}` }; } },
  write: { title: 'See it → write it in Hungarian', en: 'Spelling', make: (r) => { const n = rand(...RANGES[r].slice(0, 2)); const w = numHu(n); return { say: w, answers: [w, w.replace(/-/g, '')], show: fmtNum(n), reveal: w, typedHu: true }; } },
  price: { title: 'Prices in forints', en: 'Shopping', make: () => { const n = pick([rand(1, 99) * 10, rand(1, 60) * 50, rand(2, 30) * 100, rand(1, 19) * 1000 + pick([0, 250, 490, 500, 990])]); return { say: priceHu(n), answers: [String(n), fmtNum(n), `${n} ft`, `${fmtNum(n)} ft`], show: null, reveal: `${fmtNum(n)} Ft = ${priceHu(n)}` }; } },
  time: { title: 'What time is it?', en: 'Clock times', make: () => {
    const hh = rand(1, 12), mm = pick([0, 15, 30, 45, 0, 15, 30, 45, 10, 20, 50]);
    const right = clock(hh, mm);
    const wrong = new Set([clock(((hh + 10) % 12) + 1, mm), clock(hh, (mm + 15) % 60), clock(((hh + 10) % 12) + 1, (mm + 30) % 60)]);
    wrong.delete(right);
    return { say: timeHu(hh, mm), options: shuffle([right, ...[...wrong].slice(0, 3)]), correct: right, reveal: `${right} = ${timeHu(hh, mm)}` };
  } },
  date: { title: 'Dates', en: 'Calendar', make: () => {
    const m = rand(1, 12), d = rand(1, 28);
    const right = `${MONTHS_EN[m - 1]} ${d}`;
    const opts = new Set([right, `${MONTHS_EN[m - 1]} ${d === 28 ? 18 : d + 10 > 28 ? d - 10 : d + 10}`, `${MONTHS_EN[m % 12]} ${d}`, `${MONTHS_EN[(m + 5) % 12]} ${Math.max(1, d - 1)}`]);
    return { say: `${MONTHS[m - 1]} ${dayOfMonth(d)}`, options: shuffle([...opts]), correct: right, reveal: `${right} = ${MONTHS[m - 1]} ${dayOfMonth(d)}` };
  } },
};

export async function render(root, params, ctx) {
  const kind = params[0];
  if (KINDS[kind]) return session(root, kind, ctx.params.get('range') || 'tens');
  return hub(root);
}

function row(n) { return h('tr', null, h('td', null, h('b', null, fmtNum(n))), h('td', { class: 'tl' }, numHu(n), ' ', sayBtn(numHu(n), { rate: 0.85 }))); }

function hub(root) {
  const S = store.state.numbers;
  const stat = (k) => (S[k]?.total ? `${S[k].right}/${S[k].total}` : 'not started');
  mount(root,
    h('div', { class: 'page-head' }, h('h1', 'Számok'),
      h('p', { class: 'lead' }, 'Numbers are needed everywhere, from prices to platforms, and they are hard to catch at speed. Learn how they are built, then drill them until they are automatic.')),
    h('div', { class: 'grid grid-2' }, Object.entries(KINDS).map(([k, x]) => h('a', { class: 'tile', href: `#/numbers/${k}` },
      h('div', { class: 'tile-tag' }, `${x.en} · ${stat(k)}`), h('h3', x.title)))),
    card(h('h3', '0–10'), h('table', { class: 'conj-table' }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(row)),
      h('p', { class: 'small' }, h('b', 'két or kettő? '), 'Before a noun, 2 is ', h('em', 'két'), ': ', h('em', 'két kávé'), ', ', h('em', 'tizenkét forint'), '. On its own it is ', h('em', 'kettő'), ': “Hány? — Kettő.”')),
    card(h('h3', '11–99: tizen-, huszon-'), h('table', { class: 'conj-table' }, [11, 12, 15, 20, 21, 25, 30, 42, 57, 68, 79, 83, 99].map(row)),
      h('p', { class: 'small' }, '10 is tíz but 11–19 use ', h('em', 'tizen-'), '; 20 is húsz but 21–29 use ', h('em', 'huszon-'), '. From 30 the tens just join the ones: ', h('em', 'harmincegy, negyvenkettő'), '.')),
    card(h('h3', '100 and up'), h('table', { class: 'conj-table' }, [100, 101, 200, 345, 1000, 1956, 2000, 2026, 15000, 1000000].map(row)),
      h('p', { class: 'small' }, 'A number is written as one word up to 2000. Above 2000, groups of three digits are joined with a hyphen: ', h('em', 'kétezer-huszonhat'), '. Thousands are separated with a space: 12 500 Ft.')),
    card(h('h3', 'After a number: singular'), h('p', null, h('em', 'két alma, öt ember, száz forint'), ' — never *két almák. The number already says how many.'),
      h('h3', { style: { marginTop: '16px' } }, 'Ordinals'), h('table', { class: 'conj-table' }, [1, 2, 3, 4, 5, 10, 11, 12, 20, 21, 100].map((n) => h('tr', null, h('td', null, h('b', null, `${n}.`)), h('td', { class: 'tl' }, ordinalHu(n), ' ', sayBtn(ordinalHu(n), { rate: 0.85 }))))),
      h('p', { class: 'small' }, 'Written with a full stop: 3. = harmadik. 1st and 2nd are irregular (első, második) but inside bigger numbers they are regular: tizenegyedik, huszonkettedik.')),
    card(h('h3', 'Telling the time'), h('table', { class: 'conj-table' }, [[3, 0], [3, 15], [3, 30], [3, 45], [12, 30], [14, 20]].map(([hh, mm]) => h('tr', null, h('td', null, h('b', null, clock(hh, mm))), h('td', { class: 'tl' }, timeHu(hh, mm), ' ', sayBtn(timeHu(hh, mm), { rate: 0.85 }))))),
      h('p', { class: 'small' }, 'Quarters count towards the ', h('b', 'next'), ' hour: ', h('em', 'negyed négy'), ' (3:15) is “a quarter of four”, ', h('em', 'fél négy'), ' (3:30) “half four”, ', h('em', 'háromnegyed négy'), ' (3:45). At a time: ', h('em', 'háromkor, fél négykor'), '.'),
      (store.state.profile.known || []).includes('ru') ? h('div', { class: 'note' }, h('b', 'If you know Russian: '), 'this is exactly “четверть четвёртого”, “половина четвёртого”. But careful with German or English “half four”, which means 4:30.') : null),
    card(h('h3', 'Dates'), h('p', null, 'Year, month, day, like a sorted list: ', h('em', '2026. november 9.'), ', said ', h('em', 'kétezer-huszonhat november kilencedike'), '. The day takes -a/-e after the ordinal: ', h('em', 'elseje, másodika, harmadika'), '. Months and days are lower case.')));
  return () => stopSpeaking();
}

function session(root, kind, range) {
  const K = KINDS[kind];
  const N = 10;
  let i = 0, right = 0;
  const wrap = h('div');
  const rangeChips = ['hear', 'write'].includes(kind) ? h('div', { class: 'chips' }, Object.entries(RANGES).map(([k, [, , label]]) =>
    h('a', { class: `chip ${k === range ? 'on' : ''}`, href: `#/numbers/${kind}?range=${k}` }, label))) : null;
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/numbers' }, '← Számok')), h('h1', K.title), rangeChips), wrap);

  const record = (ok) => {
    const s = (store.state.numbers[kind] ||= { right: 0, total: 0 });
    s.total++; if (ok) { s.right++; right++; }
    store.save();
  };
  const finish = () => {
    logDone('numbers');
    wrap.replaceChildren(card(h('div', { class: 'summary-big' }, `${right} / ${N}`), h('p', null, right >= 9 ? 'Automatic. Try the next range up.' : 'Again tomorrow: a little every day beats a lot once.'),
      h('div', { class: 'ex-actions' }, btn('Again', () => session(root, kind, range), 'primary'), h('a', { class: 'btn ghost', href: '#/numbers' }, 'All drills'))));
  };
  const show = () => {
    if (i >= N) return finish();
    const it = K.make(range);
    const play = (rate = 1) => speak(it.say, { rate });
    const fb = h('div');
    let answered = false;
    const done = (ok, given) => {
      if (answered) return;
      answered = true;
      record(ok);
      if (!ok && it.say.length < 60) addCard(`s:${it.say}`, 'sentence', { text: it.say, en: it.reveal }, { source: 'dictation', priority: true });
      fb.replaceChildren(h('div', { class: `feedback ${ok ? 'ok' : 'bad'}` }, h('div', { class: 'fb-body' },
        h('div', { class: 'fb-title' }, ok ? 'Igen!' : 'Not quite'), h('div', { class: 'full tl' }, it.reveal), given && !ok ? h('div', { class: 'small muted' }, `You wrote: ${given}`) : null), sayBtn(it.say)),
        h('div', { class: 'ex-actions' }, btn([i + 1 < N ? 'Next ' : 'Finish ', icon('arrow', 16)], () => { i++; show(); }, 'primary', { id: 'next-btn' })));
      setTimeout(() => wrap.querySelector('#next-btn')?.focus(), 20);
    };
    let body;
    if (it.options) {
      const opts = it.options.map((o) => h('button', { class: 'opt', onclick: (e) => {
        if (answered) return;
        opts.forEach((b) => { b.disabled = true; if (b.textContent === it.correct) b.classList.add('ok'); });
        if (o !== it.correct) e.currentTarget.classList.add('bad');
        done(o === it.correct);
      } }, o));
      body = h('div', { class: 'stack' }, opts);
    } else {
      const inp = h('input', { type: 'text', inputmode: it.typedHu ? 'text' : 'numeric', autocomplete: 'off', autocapitalize: 'off', spellcheck: false, placeholder: it.typedHu ? 'In Hungarian…' : 'Digits…' });
      if (it.typedHu) smartAccents(inp);
      const check = () => {
        if (!inp.value.trim()) return;
        inp.disabled = true;
        const r = checkAnswer(inp.value.replace(/\s*ft\.?$/i, (m) => m.toLowerCase()), it.answers);
        done(r.verdict !== 'wrong', inp.value);
      };
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); if (!answered) check(); } });
      body = h('div', null, inp, it.typedHu ? accentBar(inp) : null, h('div', { class: 'ex-actions' }, btn('Check', check, 'primary')));
      setTimeout(() => inp.focus(), 50);
    }
    wrap.replaceChildren(h('div', { class: 'small muted', style: { marginBottom: '8px' } }, `${i + 1} / ${N}`),
      h('div', { class: 'ex-card' },
        it.show ? h('div', { class: 'ex-prompt', style: { fontSize: '2rem' } }, it.show) : h('div', { class: 'row', style: { marginBottom: '12px' } },
          h('button', { class: 'say big', onclick: () => play(), 'aria-label': 'Listen' }, icon('play', 24)), btn('Slower', () => play(0.7), 'small'),
          h('span', { class: 'small muted' }, it.options ? 'Listen and choose.' : 'Listen and type.')),
        body, fb));
    if (!it.show) play();
  };
  show();
  return () => stopSpeaking();
}
