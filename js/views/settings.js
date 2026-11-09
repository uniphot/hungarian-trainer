// Beállítások: profile and the languages you know, audio, practice, AI tutor, data.
import { h, mount, btn, card, toast, modal } from '../core/ui.js';
import { store } from '../core/store.js';
import { hungarianVoices, voiceLabel, speak, waitForVoices, ttsSupported, sttSupported, Recorder } from '../core/speech.js';
import { AI_MODELS, explainItem, friendlyError } from '../core/ai.js';
import { LEVELS } from '../data/grammar.js';
import { applyTheme } from '../main.js';

export const strand = null;

function select(options, value, onChange) {
  const el = h('select', { onchange: () => onChange(el.value) }, options.map(([v, l]) => h('option', { value: v, selected: v === value }, l)));
  return el;
}
function toggle(label, value, onChange, help) {
  const inp = h('input', { type: 'checkbox', checked: !!value, onchange: () => onChange(inp.checked) });
  return h('div', { style: { marginBottom: '12px' } }, h('label', { class: 'check' }, inp, h('span', null, label)), help ? h('div', { class: 'small muted', style: { marginLeft: '26px' } }, help) : null);
}
function field(label, control, help) {
  return h('label', { class: 'field' }, h('span', label), control, help ? h('div', { class: 'small muted', style: { marginTop: '4px' } }, help) : null);
}

export async function render(root) {
  const S = store.state.settings, P = store.state.profile;
  const save = (msg = 'Saved') => { store.save(); toast(msg); };
  await waitForVoices();
  const voices = hungarianVoices();

  const keyInput = h('input', { type: 'password', value: S.aiKey || '', placeholder: 'sk-ant-…', autocomplete: 'off' });
  keyInput.addEventListener('change', () => { S.aiKey = keyInput.value.trim(); save(S.aiKey ? 'API key saved in this browser' : 'API key removed'); });
  const rate = h('input', { type: 'range', min: 0.6, max: 1.3, step: 0.05, value: S.rate || 1, style: { width: '100%' } });
  const rateLbl = h('span', null, `${(S.rate || 1).toFixed(2)}×`);
  rate.addEventListener('input', () => { S.rate = +rate.value; rateLbl.textContent = `${S.rate.toFixed(2)}×`; });
  rate.addEventListener('change', () => save());

  mount(root,
    h('div', { class: 'page-head' }, h('h1', 'Beállítások'), h('p', { class: 'lead' }, 'Everything is stored locally in this browser. Export a backup if you switch devices.')),
    h('div', { class: 'grid grid-2' },
      card(h('h3', 'You'),
        field('Languages you know', h('div', { class: 'chips' }, [['en', 'English'], ['ru', 'Русский'], ['it', 'Italiano']].map(([k, label]) => {
          const on = () => (P.known || []).includes(k);
          const b = h('button', { class: `chip ${on() ? 'on' : ''}`, onclick: () => {
            P.known = on() ? P.known.filter((x) => x !== k) : [...(P.known || []), k];
            b.classList.toggle('on', on()); save();
          } }, label);
          return b;
        })), 'Explanations compare Hungarian with these: Russian cases and verbal prefixes, Italian double consonants and politeness, and the words Hungarian borrowed from them.'),
        field('Current level', select(LEVELS.map((l) => [l, l]), P.level || 'A1', (v) => { P.level = v; P.levelSource = 'manual'; save(); }), 'Starting from zero means A1. Move it up when the A1 grammar topics feel comfortable.'),
        field('Goal level', select(LEVELS.map((l) => [l, l]), P.goalLevel || 'B2', (v) => { P.goalLevel = v; save(); })),
        field('Daily study time (minutes)', select([[10, '10'], [15, '15'], [20, '20'], [30, '30'], [45, '45'], [60, '60'], [90, '90']].map(([a, b]) => [String(a), b]), String(P.dailyMinutes), (v) => { P.dailyMinutes = +v; save(); }),
          'Hungarian is a long road: the US Foreign Service Institute estimates about 1,100 class hours to professional level for English speakers, against 600–750 for Spanish. Consistency beats long sessions.'),
        field('Why are you learning Hungarian?', (() => { const t = h('textarea', { rows: 2, style: { minHeight: '60px' } }, P.why || ''); t.addEventListener('change', () => { P.why = t.value; save(); }); return t; })(),
          'Shown back to you on hard days. Concrete reasons (a trip, a partner’s family, a job) sustain motivation best.')),

      card(h('h3', 'Audio'),
        !ttsSupported() ? h('p', { class: 'note warn' }, 'This browser has no speech synthesis. Use Chrome, Edge or Safari.') : null,
        voices.length ? field('Main voice', select([['', 'Automatic'], ...voices.map((v) => [v.voiceURI, voiceLabel(v)])], S.voice, (v) => { S.voice = v; save(); speak('Szia! Gyakoroljunk egy kicsit magyarul.'); }),
          `${voices.length} Hungarian voice${voices.length === 1 ? '' : 's'} found. On Apple devices: Settings → Accessibility → Spoken Content → Voices → Hungarian (Tünde). On Android: Google Text-to-speech → Hungarian.`)
          : h('p', { class: 'note warn' }, 'No Hungarian voice found. Install one (Apple devices: Settings → Accessibility → Spoken Content → Voices → Hungarian; Android: Google Text-to-speech → Hungarian; Windows: Settings → Time & language → Speech).'),
        h('div', { class: 'row', style: { marginBottom: '14px' } }, btn('Test voice', () => speak('Árvíztűrő tükörfúrógép. Egy, kettő, három, négy, öt.'), 'small')),
        field(h('span', null, 'Speech rate ', rateLbl), rate),
        toggle('Rotate voices (multi-talker input)', S.multiVoice, (v) => { S.multiVoice = v; save(); }, 'Hearing many speakers and accents builds more robust listening (high-variability phonetic training).'),
        h('p', { class: 'small' }, 'Speech recognition: ', sttSupported() ? h('b', { style: { color: 'var(--ok)' } }, 'available') : h('b', { style: { color: 'var(--bad)' } }, 'not available in this browser — use Chrome or Edge (or Safari) for speaking exercises'), '.'),
        Recorder.supported() ? null : h('p', { class: 'small muted' }, 'Microphone recording is not supported here.')),

      card(h('h3', 'Practice'),
        toggle('Strict vowel length', S.strictAccents, (v) => { S.strictAccents = v; save(); }, 'Off (default): a missing length mark (a for á, o for ő…) is accepted and shown as a length note, not a mistake. On: it counts as a mistake. Writing ö/ü as o/u is always a mistake: they are different letters. The reading units on length always check it.'),
        field('Review target retention', select([['0.85', '85 % — fewer reviews'], ['0.9', '90 % — recommended'], ['0.95', '95 % — more reviews']], String(S.retention || 0.9), (v) => { S.retention = +v; save(); }),
          'How likely you should be to remember a card when it comes back. Higher = more frequent reviews.'),
        field('New vocabulary cards per day', select([0, 5, 10, 15, 20, 30].map((n) => [String(n), String(n)]), String(P.newPerDay ?? 10), (v) => { P.newPerDay = +v; save(); })),
        field('Theme', select([['auto', 'Match system'], ['light', 'Light'], ['dark', 'Dark']], S.theme || 'auto', (v) => { S.theme = v; save(); applyTheme(); }))),

      card(h('h3', 'Writing checker'),
        h('p', { class: 'small muted' }, 'The built-in checker catches the typical learner mistakes in Hungarian (a/az, vowel harmony, plural after numbers, -t, definite forms, van) offline. LanguageTool has no Hungarian, so the editor also switches on your browser’s Hungarian spell-check where the system has a Hungarian dictionary.')),

      card(h('h3', '✦ AI tutor (optional)'),
        h('p', { class: 'small' }, 'With your own Anthropic API key you get: detailed writing feedback with a native-like reformulation, a free conversation partner that gives you hints before corrections, feedback on your spoken monologues, “Ask why” on any exercise, and unlimited AI-generated grammar items.'),
        field('Anthropic API key', keyInput, 'Stored only in this browser’s localStorage and sent only to api.anthropic.com. Create one at console.anthropic.com. Usage is billed to your account (a writing check costs roughly a cent or two).'),
        field('Model', select(AI_MODELS, S.aiModel || 'claude-opus-5-5', (v) => { S.aiModel = v; save(); })),
        h('div', { class: 'row' }, btn('Test connection', async (e) => {
          const b = e.currentTarget; b.disabled = true; b.textContent = 'Testing…';
          try { const r = await explainItem({ question: 'In one short sentence: what does "szeretlek" mean?', context: 'Connection test.', level: P.level }); toast('Connected ✓', 'ok'); modal('AI tutor connected', h('p', null, r)); }
          catch (err) { toast(friendlyError(err), 'bad', 5000); }
          b.disabled = false; b.textContent = 'Test connection';
        }, 'small'), S.aiKey ? btn('Remove key', () => { S.aiKey = ''; keyInput.value = ''; save('API key removed'); }, 'small ghost danger') : null),
        h('p', { class: 'small muted', style: { marginTop: '10px' } }, 'Requests use structured outputs and the server-side refusal fallback (fallbacks: "default") on Opus/Sonnet.')),

      card(h('h3', 'Your data'),
        h('p', { class: 'small muted' }, `${Object.keys(store.state.cards).length} cards · ${store.state.writing.length} texts · ${store.state.errors.length} logged errors · ${Object.keys(store.state.log).length} active days.`),
        h('div', { class: 'row' },
          btn('Export backup', () => {
            const blob = new Blob([store.export()], { type: 'application/json' });
            const a = h('a', { href: URL.createObjectURL(blob), download: `alaposan-backup-${new Date().toISOString().slice(0, 10)}.json` });
            document.body.append(a); a.click(); a.remove();
          }),
          btn('Import backup', () => {
            const inp = h('input', { type: 'file', accept: 'application/json', onchange: async () => {
              const f = inp.files[0]; if (!f) return;
              try { store.import(await f.text()); toast('Backup imported', 'ok'); setTimeout(() => location.reload(), 500); }
              catch { toast('That file is not a valid backup.', 'bad'); }
            } });
            inp.click();
          }),
          btn('Reset everything', () => modal('Reset all progress?', h('p', null, 'This deletes your level, cards, history, texts and settings from this browser. Export a backup first if you might want them back.'),
            { actions: [{ label: 'Cancel' }, { label: 'Delete everything', cls: 'danger', onClick: () => { store.reset(); location.hash = '#/'; location.reload(); } }] }), 'ghost danger'))),
    ));
}
