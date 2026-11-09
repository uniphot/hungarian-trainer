// Hungarian numbers, ordinals, dates and clock times, generated for unlimited drills.
import { harmony } from './hu.js';

const ONES = ['', 'egy', 'kettő', 'három', 'négy', 'öt', 'hat', 'hét', 'nyolc', 'kilenc'];
const TENS = ['', 'tíz', 'húsz', 'harminc', 'negyven', 'ötven', 'hatvan', 'hetven', 'nyolcvan', 'kilencven'];
const TENS_JOIN = ['', 'tizen', 'huszon', 'harminc', 'negyven', 'ötven', 'hatvan', 'hetven', 'nyolcvan', 'kilencven'];

// 1–999. two: how a final 2 is said (kettő on its own, két before a noun or inside a compound).
function under1000(n, two) {
  const h = Math.floor(n / 100), t = Math.floor((n % 100) / 10), o = n % 10;
  let s = '';
  if (h) s += (h === 1 ? '' : h === 2 ? 'két' : ONES[h]) + 'száz';
  if (t) s += o ? TENS_JOIN[t] : TENS[t];
  if (o) s += o === 2 ? two : ONES[o];
  return s;
}

// numHu(2026) → 'kétezer-huszonhat'. attr: before a noun (két alma, tizenkét forint).
export function numHu(n, { attr = false } = {}) {
  if (n === 0) return 'nulla';
  if (n < 0) return `mínusz ${numHu(-n, { attr })}`;
  const two = attr ? 'két' : 'kettő';
  if (n < 1000) return under1000(n, two);
  const groups = [];
  for (let x = n; x > 0; x = Math.floor(x / 1000)) groups.push(x % 1000);
  const names = ['', 'ezer', 'millió', 'milliárd'];
  const parts = [];
  for (let g = groups.length - 1; g >= 0; g--) {
    if (!groups[g]) continue;
    const word = g === 0 ? under1000(groups[g], two) : (groups[g] === 1 && g === 1 ? '' : under1000(groups[g], 'két')) + names[g];
    parts.push(word);
  }
  // Up to 2000 a number is one word; above it, groups of three are joined with hyphens.
  return n <= 2000 ? parts.join('') : parts.join('-');
}

const ORD_ONES = ['', 'egyedik', 'kettedik', 'harmadik', 'negyedik', 'ötödik', 'hatodik', 'hetedik', 'nyolcadik', 'kilencedik'];
const ORD_TENS = ['', 'tizedik', 'huszadik', 'harmincadik', 'negyvenedik', 'ötvenedik', 'hatvanadik', 'hetvenedik', 'nyolcvanadik', 'kilencvenedik'];
// első, második, harmadik … tizenegyedik, huszonkettedik, századik.
export function ordinalHu(n) {
  if (n === 1) return 'első';
  if (n === 2) return 'második';
  if (n % 1000 === 0) return `${n === 1000 ? '' : numHu(n / 1000, { attr: true })}ezredik`;
  if (n % 100 === 0 && n < 1000) return `${n === 100 ? '' : numHu(n / 100, { attr: true })}századik`;
  const rest = n % 100, head = n - rest;
  const prefix = head ? numHu(head, { attr: true }) : '';
  if (rest % 10 === 0) return prefix + ORD_TENS[rest / 10];
  return prefix + (rest > 10 ? TENS_JOIN[Math.floor(rest / 10)] : '') + ORD_ONES[rest % 10];
}

export const MONTHS = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'];
export const DAYS = ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'];

// The day of the month as said in a date: november kilencedike, május elseje.
export function dayOfMonth(d) {
  if (d === 1) return 'elseje';
  if (d === 2) return 'másodika';
  const o = ordinalHu(d);
  return o + (harmony(o) === 'back' ? 'a' : 'e');
}
// 2026. november 9. → 'kétezer-huszonhat november kilencedike'
export const dateHu = (y, m, d) => `${numHu(y)} ${MONTHS[m - 1]} ${dayOfMonth(d)}`;

// Clock times the way people say them. Quarters count towards the next hour, as in Russian:
// 3:15 negyed négy (четверть четвёртого), 3:30 fél négy, 3:45 háromnegyed négy.
export function timeHu(h, m) {
  const hour12 = (x) => ((x + 11) % 12) + 1;
  const nextH = numHu(hour12(h + 1));
  if (m === 0) return `${numHu(hour12(h), { attr: true })} óra`;
  if (m === 15) return `negyed ${nextH}`;
  if (m === 30) return `fél ${nextH}`;
  if (m === 45) return `háromnegyed ${nextH}`;
  return `${numHu(h, { attr: true })} óra ${numHu(m, { attr: true })} perc`;
}

export const priceHu = (n) => `${numHu(n, { attr: true })} forint`;
// 1 250 Ft — Hungarian groups thousands with a space.
export const fmtNum = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
