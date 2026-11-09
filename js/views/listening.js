// Hallás: real audio and video for learners, metacognitive listening cycle, dictation.
import { h, mount, btn, card, icon, shuffle, sample, pick, levelBadge, toast, smartAccents, accentBar, tabs, sayBtn } from '../core/ui.js';
import { store, logDone, logError, logMinutes } from '../core/store.js';
import { TEXTS, DICTATION } from '../data/listening.js';
import { LEVELS } from '../data/grammar.js';
import { speak, speakLines, stopSpeaking, voicePool, nextVoice } from '../core/speech.js';
import { alignWords, escapeHtml } from '../core/text.js';
import { accentNote, diffLine } from './exercise.js';
import { addCard } from '../core/srs.js';
import { levelIndex } from '../core/learner.js';

export const strand = 'input';

export async function render(root, params, ctx) {
  const [sub, id] = params;
  if (sub === 'real') return (await import('./real.js')).renderReal(root, params, ctx);
  if (sub === 'comprehension' && id) { const t = TEXTS.find((x) => x.id === id); if (t) return cycle(root, t, ctx); }
  if (sub === 'comprehension') return textList(root);
  if (sub === 'dictation') { ctx.setStrand('language'); return dictation(root, ctx.params.get('level')); }
  if (sub === 'numbers') { location.hash = '#/numbers/hear'; return undefined; }
  return hub(root);
}

function hub(root) {
  const done = Object.keys(store.state.listening).length;
  mount(root,
    h('div', { class: 'page-head' }, h('h1', 'Hallás'),
      h('p', { class: 'lead' }, 'Listening is the skill learners practise least deliberately. Here you train it two ways: understanding meaning (the full listening cycle) and decoding sounds into words (dictation, numbers, minimal pairs).')),
    h('div', { class: 'grid grid-2' },
      h('a', { class: 'tile', href: '#/listening/real' }, h('div', { class: 'tile-tag' }, 'Real speech · new episodes daily'), h('h3', 'Valódi magyar'),
        h('p', null, 'Podcasts and videos from Hungarian teachers and storytellers, chosen for your level, with slow-down, repeat, Hungarian subtitles and line-by-line transcripts.')),
      h('a', { class: 'tile', href: '#/listening/comprehension' }, h('div', { class: 'tile-tag' }, 'Meaning · input'), h('h3', 'Listening cycle'),
        h('p', null, `Predict → listen → verify → listen again → check with the transcript → reflect. ${TEXTS.length} graded texts with different voices. ${done} completed.`)),
      h('a', { class: 'tile', href: '#/listening/dictation' }, h('div', { class: 'tile-tag' }, 'Decoding'), h('h3', 'Dictation'),
        h('p', null, 'Write exactly what you hear. Word-by-word feedback shows whether you missed sounds, words or accents. Missed sentences become review cards.')),
      h('a', { class: 'tile', href: '#/numbers/hear' }, h('div', { class: 'tile-tag' }, 'Decoding'), h('h3', 'Numbers, prices & times'),
        h('p', null, 'The classic listening blind spot. Unlimited generated items in Számok: numbers, forints, clock times, dates.')),
      h('a', { class: 'tile', href: '#/speaking/pronunciation' }, h('div', { class: 'tile-tag' }, 'Perception'), h('h3', 'Minimal pairs'),
        h('p', null, 'pero/perro, caro/carro, papa/papá… Train your ear with several voices, then your mouth.')),
      h('a', { class: 'tile', href: '#/writing/dictogloss' }, h('div', { class: 'tile-tag' }, 'Listening → writing'), h('h3', 'Dictogloss'),
        h('p', null, 'Hear a short text twice, note key words, reconstruct it, compare. Makes you notice the grammar you didn’t catch.'))));
}

// ---- Listening cycle --------------------------------------------------------------------
function textList(root) {
  const li = levelIndex(store.state.profile.level || 'A2');
  const rec = TEXTS.filter((t) => [li, li + 1].includes(levelIndex(t.level)) && !store.state.listening[t.id]);
  const next = rec[0] || TEXTS.find((t) => !store.state.listening[t.id]);
  mount(root,
    h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/listening' }, '← Hallás')), h('h1', 'Listening cycle'),
      h('p', { class: 'lead' }, 'Based on the metacognitive pedagogical sequence (Vandergrift & Goh): you don’t just test your listening, you learn how to listen — predicting, monitoring and evaluating your understanding.')),
    next ? card(h('div', { class: 'row between' }, h('div', null, h('div', { class: 'tile-tag' }, 'Recommended next'), h('h3', { style: { margin: '4px 0' } }, next.title), h('div', { class: 'small muted' }, next.context)),
      h('a', { class: 'btn primary', href: `#/listening/comprehension/${next.id}` }, 'Start'))) : null,
    LEVELS.filter((L) => TEXTS.some((t) => t.level === L)).map((L) => h('div', null,
      h('div', { class: 'level-head' }, levelBadge(L)),
      h('div', { class: 'grid grid-2' }, TEXTS.filter((t) => t.level === L).map((t) => {
        const res = store.state.listening[t.id];
        return h('a', { class: 'topic', href: `#/listening/comprehension/${t.id}` },
          h('div', { style: { flex: 1 } }, h('div', { class: 't-title' }, t.title), h('div', { class: 't-en' }, `${t.type} · ${t.context}`)),
          res ? h('span', { class: 'tag' }, `${Math.round(res.score * 100)}%`) : null);
      })))));
}

function speakersFor(t) {
  const pool = voicePool();
  const names = [...new Set(t.lines.map((l) => l[0]))];
  const map = {};
  names.forEach((n, i) => {
    map[n] = pool.length > 1 ? { voice: pool[i % pool.length] } : { voice: pool[0], pitch: [1, 0.85, 1.2][i % 3] };
  });
  return map;
}

function cycle(root, t, ctx) {
  const STEPS = ['Predict', 'Listen 1', 'Verify', 'Listen 2', 'Check', 'Reflect'];
  let step = 0;
  const predicted = new Set();
  const answers = {};
  let gistOk = null;
  let rate = 1;
  const voices = speakersFor(t);
  const lines = () => t.lines.map(([spk, text]) => ({ text, ...voices[spk] }));
  const qs = t.q.map((q) => ({ ...q, opts: shuffle(q.o) }));
  const gistOpts = shuffle(t.gist.o);
  let playing = null;
  const body = h('div');
  const dots = h('div', { class: 'step-dots' });

  const player = ({ transcript = null, label = 'Play' } = {}) => {
    const playBtn = btn([icon('play', 18), ` ${label}`], async () => {
      if (playing) { stopSpeaking(); playing = null; playBtn.lastChild.textContent = ` ${label}`; return; }
      playing = new AbortController();
      playBtn.lastChild.textContent = ' Stop';
      await speakLines(lines(), { rate, signal: playing.signal, onLine: (i) => {
        transcript?.querySelectorAll('p').forEach((p, k) => p.classList.toggle('now', k === i));
      } });
      playing = null; playBtn.lastChild.textContent = ` ${label}`;
    }, 'primary');
    const rates = h('div', { class: 'rate-pick' }, [0.75, 0.9, 1, 1.15].map((r) => h('button', { class: r === rate ? 'on' : '', onclick: (e) => {
      rate = r; e.currentTarget.parentNode.querySelectorAll('button').forEach((b) => b.classList.remove('on')); e.currentTarget.classList.add('on');
    } }, `${r}×`)));
    return h('div', { class: 'player' }, playBtn, rates, h('span', { class: 'small muted' }, Object.keys(voices).length > 1 ? `${Object.keys(voices).length} speakers` : ''));
  };

  const mcq = (q, opts, key, reveal) => h('div', { style: { marginBottom: '16px' } }, h('p', { style: { fontWeight: 600, marginBottom: '6px' } }, q.q),
    h('div', { class: 'options' }, opts.map((o) => {
      const b = h('button', { class: `opt ${reveal ? (o === q.o[0] ? 'ok' : answers[key] === o ? 'bad' : '') : answers[key] === o ? 'sel' : ''}`, disabled: !!reveal, onclick: () => {
        answers[key] = o; b.parentNode.querySelectorAll('.opt').forEach((x) => x.classList.remove('sel')); b.classList.add('sel');
      } }, o);
      return b;
    })));

  const draw = () => {
    stopSpeaking(); playing = null;
    dots.replaceChildren(...STEPS.map((s, i) => h('span', { class: i === step ? 'on' : i < step ? 'done' : '' }, `${i + 1} ${s}`)));
    if (step === 0) {
      body.replaceChildren(card(
        h('h3', 'Before you listen: predict'),
        h('p', null, h('b', 'Situation: '), t.context),
        h('p', { class: 'muted small' }, 'Which of these words do you expect to hear? Pick 3–5. Activating what you already know about a situation makes the real audio easier to parse.'),
        h('div', { class: 'chips' }, t.predict.map((w) => w.replace('*', '')).map((w) => h('button', { class: `chip ${predicted.has(w) ? 'on' : ''}`, onclick: (e) => {
          predicted.has(w) ? predicted.delete(w) : predicted.add(w); e.currentTarget.classList.toggle('on');
        } }, w))),
        h('div', { class: 'ex-actions' }, btn(['First listening ', icon('arrow', 16)], () => { step = 1; draw(); }, 'primary'))));
    } else if (step === 1) {
      body.replaceChildren(card(h('h3', 'First listening — for the gist'),
        h('p', { class: 'muted' }, 'Just listen once for the general idea. No text, no pausing. It’s fine not to understand everything.'),
        player({ label: 'Listen' }),
        h('div', { class: 'ex-actions' }, btn(['Next ', icon('arrow', 16)], () => { step = 2; draw(); }, 'primary'))));
    } else if (step === 2) {
      const real = new Set(t.predict.filter((w) => w.endsWith('*')).map((w) => w.slice(0, -1)));
      const res = h('div');
      body.replaceChildren(card(h('h3', 'First verification'),
        mcq(t.gist, gistOpts, 'gist'),
        res,
        h('div', { class: 'ex-actions' }, btn('Check', () => {
          if (!answers.gist) return toast('Choose an answer first.');
          gistOk = answers.gist === t.gist.o[0];
          const hits = [...predicted].filter((w) => real.has(w));
          res.replaceChildren(h('div', { class: `feedback ${gistOk ? 'ok' : 'bad'}` }, h('div', { class: 'fb-body' },
            h('div', { class: 'fb-title' }, gistOk ? 'Yes — you got the gist.' : `The answer was: ${t.gist.o[0]}`),
            predicted.size ? h('div', { class: 'small' }, `Your predictions: ${hits.length} of ${predicted.size} words were in the text (${[...real].join(', ')}). Did you hear them?`) : null)),
            h('div', { class: 'ex-actions' }, btn(['Second listening ', icon('arrow', 16)], () => { step = 3; draw(); }, 'primary')));
        }, 'primary'))));
    } else if (step === 3) {
      body.replaceChildren(card(h('h3', 'Second listening — for detail'),
        h('p', { class: 'muted' }, 'Read the questions first, so you know what to listen for. You may listen up to two more times and slow it down.'),
        player({ label: 'Listen' }), h('hr'),
        qs.map((q, i) => mcq(q, q.opts, `q${i}`)),
        h('div', { class: 'ex-actions' }, btn(['Check with the transcript ', icon('arrow', 16)], () => {
          if (qs.some((_, i) => !answers[`q${i}`])) return toast('Answer all the questions first (guess if needed).');
          step = 4; draw();
        }, 'primary'))));
    } else if (step === 4) {
      const correct = qs.filter((q, i) => answers[`q${i}`] === q.o[0]).length;
      const focusRe = new RegExp(`(${t.focus.words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
      const mined = new Set();
      const transcript = h('div', { class: 'transcript' }, t.lines.map(([spk, text]) => h('p', null,
        Object.keys(voices).length > 1 ? h('span', { class: 'spk' }, spk) : null,
        h('span', { html: escapeHtml(text).replace(focusRe, '<mark style="background:var(--almost-soft);border-radius:4px;padding:0 2px">$1</mark>') }), ' ',
        h('button', { class: 'say', title: 'Play this line', onclick: () => speak(text, { ...voices[spk], rate }) }, icon('play', 14)), ' ',
        h('label', { class: 'small muted', style: { cursor: 'pointer' } }, h('input', { type: 'checkbox', onchange: (e) => (e.target.checked ? mined.add(text) : mined.delete(text)) }), ' review'))));
      body.replaceChildren(card(h('h3', `Final verification · ${correct} / ${qs.length} correct`),
        qs.map((q, i) => mcq(q, q.opts, `q${i}`, true)), h('hr'),
        h('h4', 'Listen with the transcript'),
        h('p', { class: 'small muted' }, 'Follow the text as it plays. Where did sound and spelling surprise you? That gap is exactly what to practise.'),
        player({ transcript, label: 'Play with text' }), transcript,
        h('div', { class: 'note' }, h('b', 'Notice: '), t.focus.note),
        h('p', { class: 'small muted' }, h('b', 'Glossary: '), t.glossary),
        h('div', { class: 'ex-actions' },
          btn(['Reflect ', icon('arrow', 16)], () => {
            mined.forEach((text) => addCard(`s:${t.id}:${text.slice(0, 40)}`, 'sentence', { text }, { source: 'dictation', priority: true }));
            if (mined.size) toast(`${mined.size} sentence${mined.size > 1 ? 's' : ''} added to review`, 'ok');
            store.state.listening[t.id] = { score: correct / qs.length, ts: Date.now() }; store.save();
            step = 5; draw();
          }, 'primary'),
          btn('Fluency replay at 1.25×', async () => {
            ctx.setStrand('fluency'); await speakLines(lines(), { rate: 1.25, onLine: (i) => transcript.querySelectorAll('p').forEach((p, k) => p.classList.toggle('now', k === i)) }); ctx.setStrand('input');
          }, 'ghost'))));
    } else {
      const DIFF = {
        speed: ['It was too fast', 'Use 0.9× for the second listening, then go back to 1×. Shadowing (Speaking → Shadowing) trains speed of processing.'],
        vocab: ['I didn’t know key words', 'Add the words you missed to your review deck; listen to texts at your level more than above it.'],
        linking: ['Words ran together', 'Long words with several endings sound like one blur at first (házainkban). Dictation and shadowing train you to hear where the endings start.'],
        voice: ['The accent or voice was unfamiliar', 'Keep “Rotate voices” on in Settings: hearing many voices builds robust perception.'],
        focus: ['I lost concentration', 'Shorter texts, and set yourself one question before each listening.'],
        none: ['Nothing — it was comfortable', 'Great: next time pick a text one level up, or replay this one at 1.25× for fluency.'],
      };
      const chosen = new Set();
      const tips = h('div');
      body.replaceChildren(card(h('h3', 'Reflect'),
        h('p', { class: 'muted' }, 'What made this text difficult? Knowing your problem is half of solving it.'),
        h('div', { class: 'chips' }, Object.entries(DIFF).map(([k, [label]]) => h('button', { class: 'chip', onclick: (e) => {
          chosen.has(k) ? chosen.delete(k) : chosen.add(k); e.currentTarget.classList.toggle('on');
          tips.replaceChildren(...[...chosen].map((c) => h('div', { class: 'note' }, DIFF[c][1])));
        } }, label))),
        tips,
        h('div', { class: 'ex-actions' }, btn('Finish', () => {
          const rec = store.state.listening[t.id] || {}; rec.difficulties = [...chosen]; rec.gist = gistOk; store.save();
          logDone('listen');
          location.hash = '#/listening/comprehension';
        }, 'primary'))));
    }
  };
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/listening/comprehension' }, '← Listening cycle')),
    h('div', { class: 'row' }, levelBadge(t.level), h('span', { class: 'muted small' }, t.type)), h('h1', t.title)), dots, body);
  draw();
  return () => stopSpeaking();
}

// ---- Dictation ----------------------------------------------------------------------------
function dictation(root, levelParam) {
  const lvl = levelParam || (store.state.profile.level && DICTATION[store.state.profile.level] ? store.state.profile.level : store.state.profile.level === 'C2' ? 'C1' : 'A2');
  const recent = new Set(store.state.dictation.slice(-40).map((d) => d.text));
  const pool = DICTATION[lvl].filter((s) => !recent.has(s));
  const items = sample(pool.length >= 8 ? pool : DICTATION[lvl], 8);
  const stats = { ok: 0, accent: 0, spelling: 0, wrong: 0, missing: 0, extra: 0, words: 0 };
  let i = 0, totalScore = 0;
  const wrap = h('div');
  mount(root, h('div', { class: 'page-head' }, h('div', { class: 'crumbs' }, h('a', { href: '#/listening' }, '← Hallás')), h('h1', 'Diktálás'),
    h('p', { class: 'lead' }, 'Type exactly what you hear (punctuation doesn’t matter; missing accents are only noted). Replay as often as you need — the effort of decoding is the exercise.'),
    h('div', { class: 'chips' }, Object.keys(DICTATION).map((L) => h('a', { class: `chip ${L === lvl ? 'on' : ''}`, href: `#/listening/dictation?level=${L}` }, L)))), wrap);
  let onKey = null;
  const show = () => {
    if (onKey) document.removeEventListener('keydown', onKey);
    if (i >= items.length) return summary();
    const text = items[i];
    const voice = nextVoice();
    const inp = h('textarea', { rows: 2, class: 'fix-area', placeholder: 'Type what you hear…', spellcheck: false, autocapitalize: 'off' });
    smartAccents(inp);
    const fb = h('div');
    let answered = false;
    const play = (rate = 1) => speak(text, { voice, rate });
    const chunks = () => {
      const words = text.split(' ');
      const parts = [];
      for (let k = 0; k < words.length; k += 4) parts.push(words.slice(k, k + 4).join(' '));
      return speakLines(parts.map((p) => ({ text: p, voice })), { rate: 0.85, gap: 900 });
    };
    const check = () => {
      if (answered || !inp.value.trim()) return;
      answered = true; inp.disabled = true;
      const { ops, score } = alignWords(text, inp.value, { strict: store.state.settings.strictAccents });
      totalScore += score;
      for (const o of ops) { stats[o.type]++; if (o.type !== 'extra') stats.words++; }
      store.state.dictation.push({ ts: Date.now(), level: lvl, text, score });
      if (score < 0.999) {
        addCard(`s:${text.slice(0, 50)}`, 'sentence', { text }, { source: 'dictation', priority: true });
        const errs = ops.filter((o) => !['ok', 'accent'].includes(o.type));
        if (errs.length) logError({ source: 'dictation', cat: 'listening', text, fix: errs.map((o) => o.ref || o.hyp).join(', ') });
      }
      store.save();
      fb.replaceChildren(h('div', { class: `feedback ${score > 0.98 ? 'ok' : score > 0.75 ? 'almost' : 'bad'}` }, h('div', { class: 'fb-body' },
        h('div', { class: 'fb-title' }, `${Math.round(score * 100)}%`),
        diffLine(ops),
        ops.some((o) => o.type === 'accent') ? accentNote(ops.filter((o) => o.type === 'accent').map((o) => o.ref)) : null,
        h('div', { class: 'small muted' }, 'amber underline = accent note (not counted) · dashed = small spelling slip · red = wrong or missing · grey strikethrough = extra word')), h('button', { class: 'say', onclick: () => play() }, icon('play', 16))),
        h('div', { class: 'ex-actions' }, btn(['Next ', icon('arrow', 16)], () => { i++; show(); }, 'primary', { id: 'next-btn' })));
      setTimeout(() => wrap.querySelector('#next-btn')?.focus(), 20);
    };
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.stopPropagation(); check(); } });
    onKey = (e) => {
      if (e.key === 'Escape' || (e.ctrlKey && e.key === ' ')) { e.preventDefault(); play(); }
    };
    document.addEventListener('keydown', onKey);
    wrap.replaceChildren(h('div', { class: 'progress-top' }, h('span', { class: 'small muted' }, `${i + 1} / ${items.length}`), h('div', { class: 'bar' }, h('div', { class: 'bar-fill', style: { width: `${(i / items.length) * 100}%` } }))),
      h('div', { class: 'ex-card' },
        h('div', { class: 'player', style: { marginBottom: '14px' } },
          h('button', { class: 'say big', onclick: () => play(), title: 'Play (Esc)' }, icon('play', 24)),
          btn('Slow', () => play(0.7), 'small'), btn('Phrase by phrase', () => chunks(), 'small'),
          h('span', { class: 'small muted' }, 'Esc = replay')),
        inp, accentBar(inp),
        h('div', { class: 'ex-actions' }, btn('Check', check, 'primary'), btn('Give up', () => { inp.value = inp.value || '…'; check(); }, 'ghost')), fb));
    setTimeout(() => { inp.focus(); play(); }, 300);
  };
  const summary = () => {
    if (onKey) document.removeEventListener('keydown', onKey);
    logDone('dictation');
    const pct = (k) => Math.round((stats[k] / Math.max(1, stats.words)) * 100);
    const advice = [];
    if (stats.accent >= 3) advice.push(['Length notes', `You missed ${stats.accent} long vowels. They didn’t count against you, but length changes meaning (kor/kór, öt/őt): the reading course trains your ear for it.`, '#/reading/hosszu']);
    if (stats.missing >= 3) advice.push(['Missing words', 'Short words (a, az, is, meg, már) disappear in fast speech. Shadowing trains your ear for them.', '#/speaking/shadowing']);
    if (stats.wrong + stats.spelling >= 3) advice.push(['Wrong words', 'Often a sound you don’t distinguish yet (s/sz, gy/d, o/ö). Try the minimal pairs.', '#/speaking/pronunciation']);
    wrap.replaceChildren(h('div', { class: 'ex-card' }, h('div', { class: 'summary-big' }, `${Math.round((totalScore / items.length) * 100)}%`),
      h('div', { class: 'metrics', style: { margin: '14px 0' } }, [['Correct words', `${pct('ok') + pct('accent')}%`], ['Accent notes', stats.accent], ['Spelling', `${pct('spelling')}%`], ['Wrong', `${pct('wrong')}%`], ['Missed', `${pct('missing')}%`]].map(([l, v]) => h('div', { class: 'metric' }, h('b', v), h('span', l)))),
      advice.map(([t, a, href]) => h('div', { class: 'note' }, h('b', `${t}: `), a, ' ', h('a', { href }, 'Go →'))),
      h('p', { class: 'small muted' }, 'Sentences with mistakes are now dictation cards in your review queue.'),
      h('div', { class: 'ex-actions' }, btn('Another round', () => dictation(root, lvl), 'primary'), btn('Back', () => { location.hash = '#/listening'; }, 'ghost'))));
  };
  show();
  return () => onKey && document.removeEventListener('keydown', onKey);
}
