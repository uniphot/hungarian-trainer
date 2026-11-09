// Content integrity: run with `node tests/content.js`. Every exercise parses, every deck card
// has a target, the reading units and show lists are complete and match the feed builder.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TOPICS } from '../js/data/grammar.js';
import { DECK, DECK_ITEMS } from '../js/data/deck.js';
import { UNITS } from '../js/data/reading.js';
import { SHOWS, TIERS } from '../js/data/shows.js';
import { TEXTS, DICTATION } from '../js/data/listening.js';
import { PRON, ROLEPLAYS } from '../js/data/speaking.js';
import { TASKS } from '../js/data/writing.js';

let n = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); n++; };

const ids = new Set();
for (const t of TOPICS) {
  ok(!ids.has(t.id), `topic id ${t.id} unique`); ids.add(t.id);
  ok(t.explain && t.summary && t.items.length >= 8, `${t.id} has content`);
  ok(t.notes?.ru && t.notes?.it && t.notes?.en, `${t.id} has notes for ru, it and en`);
  for (const s of t.items) {
    const body = s.split(' ~ ')[0];
    ok(/\{[^}]+\}/.test(body) || (/\[[^\]]+\|[^\]]+\]/.test(body) && body.includes('*')) || (body.startsWith('! ') && /\[[^\]>]*>[^\]]*\]/.test(body)), `${t.id}: item has a gap: ${s}`);
  }
  for (const s of t.input?.items || []) ok(s.includes(' ? ') && s.includes('*'), `${t.id}: interpret item: ${s}`);
}
for (const row of DECK) ok(/\*[^*]+\*/.test(row.split('|')[2]), `deck target in: ${row}`);
ok(new Set(DECK_ITEMS.map((d) => d.lemma + d.en)).size === DECK_ITEMS.length, 'no duplicate deck cards');
for (const d of DECK_ITEMS) for (const r of d.related) ok(['ru', 'it', 'en'].includes(r.lang) && r.word, `related word on ${d.lemma}`);
for (const u of UNITS) {
  ok(u.sounds.length && u.words.length >= 10, `${u.id}: sounds and words`);
  ok(u.notes.ru && u.notes.it && u.notes.en, `${u.id}: notes`);
  for (const [a, b] of u.pairs) ok(a !== b, `${u.id}: pair ${a}/${b}`);
}
const fetched = [...readFileSync(new URL('../listen.py', import.meta.url), 'utf8').matchAll(/^\s+\("([a-z-]+)", "(audio|video)",/gm)].map((m) => m[1]);
ok(fetched.length === SHOWS.length && fetched.every((id) => SHOWS.some((s) => s.id === id)), 'listen.py and shows.js list the same shows');
for (const s of SHOWS) ok(TIERS[s.tier] && s.level && s.why, `${s.id} described`);
for (const t of TEXTS) ok(t.lines.length && t.q.length === 3 && t.gist.o.length === 4 && t.predict.some((p) => p.endsWith('*')), `${t.id}: listening text complete`);
ok(Object.values(DICTATION).every((l) => l.length >= 8), 'dictation sentences');
for (const p of PRON) ok(p.words.length && p.sentence, `${p.id}: pronunciation unit`);
for (const r of ROLEPLAYS) ok(r.turns.every((t) => t.them && t.cue && t.expect.length && t.model), `${r.id}: role-play turns`);
for (const t of TASKS) ok(t.reqs.every((r) => ['any', 'past', 'cases', 'connectors'].includes(r.t)), `${t.id}: requirement types`);
console.log(`content: ${n} checks passed`);
