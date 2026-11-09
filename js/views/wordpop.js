// Tap-a-word help for transcripts and texts: the word taken apart by the engine (stem + endings,
// or verb + person and tense), dictionary links, and saving the word or sentence for review.
import { h, btn, icon, toast, sayBtn } from '../core/ui.js';
import { escapeHtml } from '../core/text.js';
import { analyze, guessParts } from '../core/morph.js';
import { addCard } from '../core/srs.js';
import { store } from '../core/store.js';

// Text as HTML with each word in a tappable span.
export const wordSpans = (text) => text.split(/(\p{L}+)/u).map((part, i) => (i % 2 === 0 ? escapeHtml(part) : `<span class="w">${part}</span>`)).join('');

// Listens for taps on .w spans inside container. sentenceOf(span) gives the word's sentence;
// sentenceCard(sentence, span) can add to the card that "Save sentence" creates.
export function attachWordPopup(container, { voice, idPrefix, sentenceOf, sentenceCard = () => ({}) }) {
  const el = h('div', { class: 'word-pop', style: { display: 'none' } });
  const close = () => { el.style.display = 'none'; };
  container.addEventListener('click', (e) => {
    const w = e.target.closest('.w');
    if (!w) return;
    const word = w.textContent;
    const sentence = sentenceOf(w, word);
    const readings = analyze(word).slice(0, 3);
    const meaning = h('input', { type: 'text', placeholder: 'Meaning (your own words)…', value: readings[0]?.en || '' });
    const q = encodeURIComponent(word.toLowerCase());
    const guess = readings.length ? null : guessParts(word);
    const lemma = encodeURIComponent((readings[0]?.lemma || guess?.stem || word).toLowerCase());
    const known = store.state.profile.known || [];
    el.replaceChildren(
      h('div', { class: 'row between' }, h('b', { class: 'tl', style: { fontSize: '1.2rem' } }, word), h('button', { class: 'icon-btn', onclick: close, 'aria-label': 'Close' }, icon('x', 16))),
      readings.length ? h('div', { class: 'small', style: { margin: '4px 0' } }, readings.map((r) => h('div', null, h('b', { class: 'tl' }, r.lemma), r.en ? ` (${r.en})` : '', h('span', { class: 'muted' }, ` · ${r.desc}`))))
        : guess ? h('div', { class: 'small', style: { margin: '4px 0' } }, 'Probably ', h('b', { class: 'tl' }, guess.stem), ` + ${guess.ending} (“${guess.en}”)`, h('div', { class: 'muted' }, 'A guess from the ending: check the stem in a dictionary.'))
          : h('div', { class: 'small muted', style: { margin: '4px 0' } }, 'Not in the app’s word list yet: try the dictionaries.'),
      h('div', { class: 'row', style: { margin: '8px 0' } }, sayBtn(word, { voice }),
        h('a', { class: 'btn small', href: `https://en.wiktionary.org/wiki/${lemma}#Hungarian`, target: '_blank', rel: 'noopener' }, 'Wiktionary'),
        known.includes('ru') ? h('a', { class: 'btn small', href: `https://ru.wiktionary.org/wiki/${lemma}`, target: '_blank', rel: 'noopener' }, 'Викисловарь') : null,
        h('a', { class: 'btn small', href: `https://translate.google.com/?sl=hu&tl=${known.includes('ru') && !known.includes('en') ? 'ru' : 'en'}&text=${q}`, target: '_blank', rel: 'noopener' }, 'Translate')),
      meaning,
      h('div', { class: 'row', style: { marginTop: '8px' } },
        btn('Save word', () => {
          addCard(`${idPrefix}:${word.toLowerCase()}`, 'custom', { front: `Mit jelent «${word}»?\n${sentence}`, back: meaning.value.trim() || '(look it up and say it in Hungarian)' }, { source: 'manual', priority: true });
          toast(`“${word}” added to review`, 'ok'); close();
        }, 'small primary'),
        btn('Save sentence', () => {
          addCard(`s:${sentence.slice(0, 50)}`, 'sentence', { text: sentence, ...sentenceCard(sentence, w) }, { source: 'dictation', priority: true });
          toast('Sentence added as a dictation card', 'ok'); close();
        }, 'small')));
    const rect = w.getBoundingClientRect();
    el.style.display = 'block';
    el.style.top = `${window.scrollY + rect.bottom + 6}px`;
    el.style.left = `${Math.max(8, Math.min(window.innerWidth - 320, rect.left))}px`;
  });
  const onDocClick = (e) => { if (!el.contains(e.target) && !e.target.closest?.('.w')) close(); };
  document.addEventListener('click', onDocClick);
  return { el, close, destroy: () => document.removeEventListener('click', onDocClick) };
}
