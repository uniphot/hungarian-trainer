// Writing checker. Two layers:
//  1. Built-in rules for the mistakes learners of Hungarian really make (offline, instant, with
//     explanations and links to the grammar topic). Most are driven by the engine, so they can
//     suggest the exact form: a/az, plural after numbers, van where Hungarian drops it (and the
//     reverse), a missing -t, definite vs indefinite verb, vowel harmony in endings, Budapesten.
//  2. AI feedback (optional, see core/ai.js) for a full teacher-style review.
// LanguageTool has no Hungarian; the editor turns on the browser's own Hungarian spell-check.
import { tokens } from './analyzer.js';
import { analyze, caseForm, present, nouns, verbInfo, CASES } from './morph.js';
import { stripAccents } from './text.js';

const keepCase = (orig, rep) => (orig[0] === orig[0].toUpperCase() ? rep[0].toUpperCase() + rep.slice(1) : rep);
const KNOWN_NOUNS = new Set(nouns().map((n) => n.nom));
// Adjectives and nouns from the deck, for “Ő van tanár” / “Én tanár”.
const PREDICATES = new Set([...KNOWN_NOUNS, ...['jó', 'rossz', 'nagy', 'kicsi', 'szép', 'új', 'régi', 'öreg', 'fiatal', 'drága', 'olcsó', 'finom', 'meleg', 'hideg', 'könnyű', 'nehéz',
  'fáradt', 'éhes', 'magyar', 'olasz', 'orosz', 'angol', 'beteg', 'boldog', 'szomorú', 'kedves', 'okos', 'magas', 'alacsony', 'gazdag', 'szegény', 'tanár', 'orvos', 'diák']]);
const NUMBER_WORDS = 'két|kettő|három|négy|öt|hat|hét|nyolc|kilenc|tíz|húsz|harminc|száz|ezer|sok|néhány|pár|kevés|több|minden|hány|mennyi|\\d+';
const OBJECT_VERBS = 'kérek|kérünk|szeretnék|szeretnénk|veszek|veszünk|eszem|eszünk|iszom|iszunk|látok|látunk|keresek|keresünk|olvasok|olvasunk|írok|írunk|nézek|nézünk|főzök|főzünk|rendelek|rendelünk|hozok|kapok|csinálok|akarok|vásárolok|van|nincs';

// Wrong-harmony endings for listed nouns: házben → házban, kertban → kertben, földhez → földhöz.
let harmonyMap = null;
function getHarmonyMap() {
  if (harmonyMap) return harmonyMap;
  harmonyMap = new Map();
  for (const n of nouns()) {
    for (const [id, c] of Object.entries(CASES)) {
      if (c.end.length < 2) continue;
      for (const plural of [false, true]) {
        const right = caseForm(n.nom, id, { plural });
        const variants = (id === 'ins' || id === 'tra') ? c.end.map((e) => e.slice(1)) : c.end;
        const used = variants.find((v) => right.endsWith(v));
        if (!used) continue;
        for (const v of variants) if (v !== used) harmonyMap.set(right.slice(0, -used.length) + v, right);
      }
    }
  }
  return harmonyMap;
}

const R = (re, msg, fix, extra = {}) => ({ re, msg, fix, ...extra });
// \b only knows ASCII letters, so word edges are written as Unicode lookarounds.
const W0 = '(?<!\\p{L})', W1 = '(?!\\p{L})';
const re = (src) => new RegExp(src.replaceAll('<', W0).replaceAll('>', W1), 'gu');
const TOWN_END = { ben: 'en', ba: 're', ből: 'ről' };
const RULES = [
  R(re('<([Aa]) ((?=[aáeéiíoóöőuúüű])\\p{L}+)'), 'Before a vowel the article is az: az alma, az autó.', (m, a, w) => `${keepCase(a, 'az')} ${w}`, { topic: 'alapok', cat: 'article' }),
  R(re('<([Aa]z) ((?![aáeéiíoóöőuúüű])\\p{L}+)'), 'Before a consonant the article is a: a ház, a busz. (Az before a consonant means “that”.)',
    (m, a, w) => (KNOWN_NOUNS.has(w.toLowerCase()) ? `${keepCase(a, 'a')} ${w}` : null), { topic: 'alapok', cat: 'article' }),
  R(re('<(Budapest|Szeged|Pécs)(ben|ba|ből)>'), 'Hungarian towns usually take the “on” endings: Budapesten, Budapestre, Budapestről.',
    (m, town, end) => town + TOWN_END[end], { topic: 'hol', cat: 'case' }),
  R(re('<(Magyarország)(ban|ba|ból)>'), 'Hungary takes the “on” endings: Magyarországon, Magyarországra, Magyarországról.',
    (m, c, end) => c + ({ ban: 'on', ba: 'ra', ból: 'ról' })[end], { topic: 'hol', cat: 'case' }),
  R(re('<([Éé]n|[Tt]e|[Mm]i|[Tt]i) van>'), '“van” goes with ő/ők. With én it is vagyok (én vagyok); for “I have”, say nekem van + -m: Nekem van egy kutyám.', () => null, { topic: 'birtok', cat: 'copula', hintOnly: true }),
];

// Capital letters: days, months, languages and nationalities are lower case in Hungarian.
const LOWER_WORDS = /(?<!\p{L})(Hétfő|Kedd|Szerda|Csütörtök|Péntek|Szombat|Vasárnap|Január|Február|Március|Április|Május|Június|Július|Augusztus|Szeptember|Október|November|December|Magyar|Angol|Orosz|Olasz|Német|Francia|Spanyol|Lengyel)(\p{L}*)/gu;

function capitalRules(text) {
  const out = [];
  let m;
  LOWER_WORDS.lastIndex = 0;
  while ((m = LOWER_WORDS.exec(text))) {
    if (/^ország/.test(m[2])) continue; // Magyarország, Olaszország are names
    const before = text.slice(0, m.index).trimEnd();
    if (!before || /[.!?:]$/.test(before)) continue; // start of a sentence
    out.push({ start: m.index, end: m.index + m[0].length, text: m[0], fix: m[0].toLowerCase(), msg: 'Days, months, languages and nationalities are written in lower case: hétfőn, május, magyar, angolul.', cat: 'capitals', sev: 'style', source: 'local' });
  }
  return out;
}

// Rules that need to know what the words are.
function wordRules(text) {
  const issues = [];
  const toks = tokens(text);
  const H = getHarmonyMap();
  toks.forEach((t, i) => {
    const next = toks[i + 1], next2 = toks[i + 2];
    // vowel harmony in a case ending
    const fixH = H.get(t.lw);
    if (fixH && !analyze(t.lw).length) issues.push({ start: t.start, end: t.end, text: t.w, fix: keepCase(t.w, fixH), msg: 'The ending must match the word’s vowels (vowel harmony): back vowels take -ban, -hoz…, front vowels -ben, -hez/-höz.', topic: 'harmonia', cat: 'harmony', source: 'local' });
    // plural after a number or quantity: két almák → két alma
    if (new RegExp(`^(${NUMBER_WORDS})$`).test(t.lw) && next) {
      const r = analyze(next.lw).find((x) => x.pos === 'noun' && x.plural && x.owner == null);
      if (r) {
        const sg = r.case === 'nom' ? r.lemma : caseForm(r.lemma, r.case);
        issues.push({ start: next.start, end: next.end, text: next.w, fix: keepCase(next.w, sg), msg: 'After a number or a word like sok (many), Hungarian uses the singular: két alma, sok ember.', topic: 'tobbes', cat: 'plural', source: 'local' });
      }
    }
    // Én tanár. → Én tanár vagyok.
    const subj = { én: 'vagyok', te: 'vagy', mi: 'vagyunk', ti: 'vagytok' }[t.lw];
    if (subj && next && (PREDICATES.has(next.lw) || (t.lw === 'én' && /^\p{Lu}/u.test(next.w)))) {
      const after = text.slice(next.end).match(/^\s*([.!?]|$)/);
      if (after) issues.push({ start: t.start, end: next.end, text: text.slice(t.start, next.end), fix: `${text.slice(t.start, next.end)} ${subj}`, msg: 'In the 1st and 2nd person the verb stays: Tanár vagyok. Only the 3rd person drops it (Ő tanár).', topic: 'van', cat: 'copula', source: 'local' });
    }
    // Ő van tanár. → Ő tanár.
    if (/^(ő|ez|az|ők|ezek|azok)$/.test(t.lw) && next?.lw === 'van' && next2 && PREDICATES.has(next2.lw) && /^\s*([.!?,]|$)/.test(text.slice(next2.end))) {
      issues.push({ start: next.start, end: next2.end, text: text.slice(next.start, next2.end), fix: next2.w, msg: 'In the 3rd person, Hungarian drops van before a noun or adjective: Ő tanár. A ház nagy.', topic: 'van', cat: 'copula', source: 'local' });
    }
    // Kérek egy kávé → kávét
    if (new RegExp(`^(${OBJECT_VERBS})$`).test(t.lw) && !['van', 'nincs'].includes(t.lw)) {
      const objAt = next?.lw === 'egy' ? i + 2 : i + 1;
      const obj = toks[objAt];
      // a measure word comes before the object: egy pohár vizet, egy csésze teát
      const measure = toks[objAt + 1] && analyze(toks[objAt + 1].lw).some((x) => x.case === 'acc');
      if (obj && !measure && KNOWN_NOUNS.has(obj.lw)) issues.push({ start: obj.start, end: obj.end, text: obj.w, fix: keepCase(obj.w, caseForm(obj.lw, 'acc')), msg: 'The object of the verb needs -t: Kérek egy kávét.', topic: 'targy', cat: 'object', source: 'local' });
    }
    // definite vs indefinite: látok a házat → látom a házat; látom egy házat → látok egy házat
    const vr = analyze(t.lw).find((x) => x.pos === 'verb' && x.tense === 'pres' && x.person != null);
    if (vr && verbInfo(vr.lemma).transitive && next) {
      const objAfter = (k) => toks[i + k] && /t$/.test(toks[i + k].lw) && analyze(toks[i + k].lw).some((x) => x.case === 'acc');
      if (!vr.def && /^(a|az)$/.test(next.lw) && objAfter(2)) {
        const right = present(vr.lemma, { def: true })?.[vr.person];
        if (right) issues.push({ start: t.start, end: t.end, text: t.w, fix: keepCase(t.w, right), msg: 'With a definite object (a/az …, a name, ezt) use the definite form: látom a házat.', topic: 'hatarozott', cat: 'definite', source: 'local' });
      }
      if (vr.def && next.lw === 'egy' && objAfter(2)) {
        const right = present(vr.lemma)?.[vr.person];
        if (right) issues.push({ start: t.start, end: t.end, text: t.w, fix: keepCase(t.w, right), msg: 'With egy (an indefinite object) use the indefinite form: látok egy házat.', topic: 'hatarozott', cat: 'definite', source: 'local' });
      }
    }
  });
  return issues;
}

export function localCheck(text) {
  const issues = [];
  for (const rule of RULES) {
    if (rule.skip) continue;
    rule.re.lastIndex = 0;
    let m;
    while ((m = rule.re.exec(text))) {
      if (!m[0]) { rule.re.lastIndex++; continue; }
      const fix = rule.fix ? rule.fix(...m) : null;
      if (fix === m[0]) continue;
      if (fix === null && !rule.hintOnly) continue;
      issues.push({ start: m.index, end: m.index + m[0].length, text: m[0], fix, msg: rule.msg, topic: rule.topic, cat: rule.cat, sev: rule.sev || 'error', source: 'local' });
    }
  }
  issues.push(...capitalRules(text), ...wordRules(text));
  return dedupe(issues);
}

// A fix that only changes vowel length (a/á, o/ó, ö/ő…) is a note, not a mistake.
export const isAccentOnly = (is) => is.cat !== 'capitals' && is.fix != null && is.fix !== is.text && stripAccents(is.fix.toLowerCase()) === stripAccents(is.text.toLowerCase());
function markAccentNotes(issues) {
  for (const is of issues) if (isAccentOnly(is)) { is.sev = 'note'; is.hint = `Length note: write “${is.fix}”.`; }
  return issues;
}

// Hint-first feedback: a nudge to self-correct before the answer is shown.
const HINTS = {
  article: 'a or az? Listen to the sound that follows.', case: 'Hungarian towns (and Hungary itself) take a different family of endings.',
  copula: 'Is a form of “van” missing here, or is one there that Hungarian leaves out?', plural: 'What form does a noun take after a number or “sok”?',
  object: 'What does the object of the verb need?', definite: 'Is the object definite (a/az, a name) or not (egy)? The verb ending must match.',
  harmony: 'Check the vowels of the word: does the ending belong to the same family?', capitals: 'Should this word really have a capital letter in Hungarian?',
};

function dedupe(issues) {
  issues.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  const out = [];
  for (const is of markAccentNotes(issues)) {
    is.sev ||= 'error';
    is.hint ||= HINTS[is.cat];
    if (out.some((o) => o.start < is.end && is.start < o.end && (o.msg === is.msg || (o.fix && o.fix === is.fix)))) continue;
    out.push(is);
  }
  return out;
}

export function mergeIssues(local, remote) {
  const out = [...local];
  for (const r of remote) {
    const dup = local.some((l) => l.start < r.end && r.start < l.end && (l.fix === r.fix || l.cat === r.cat || (l.start === r.start && l.end === r.end)));
    if (!dup) out.push(r);
  }
  return out.sort((a, b) => a.start - b.start);
}

// Error category → grammar topic (also used for the AI's categories).
export const CAT_TOPIC = { article: 'alapok', copula: 'van', plural: 'tobbes', object: 'targy', definite: 'hatarozott', harmony: 'harmonia', case: 'hova',
  possessive: 'birtokos', conjugation: 'jelen', 'past-tense': 'mult', prefix: 'igekoto', 'word-order': 'igekoto', capitals: null };

