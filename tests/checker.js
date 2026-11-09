// Writing checker: run with `node tests/checker.js`. Each typical mistake is caught with the right
// fix, and a text of correct sentences produces no errors at all.
globalThis.window = globalThis;
globalThis.addEventListener = () => {};
globalThis.localStorage = { getItem: () => null, setItem() {} };
const assert = (await import('node:assert/strict')).default;
const { localCheck } = await import('../js/core/checker.js');

const fixes = (text) => localCheck(text).filter((i) => i.sev === 'error').map((i) => [i.text, i.fix]);
const cases = [
  ['Ez a alma piros.', [['a alma', 'az alma']]],
  ['Az ház nagy.', [['Az ház', 'A ház']]],
  ['Budapestben lakom.', [['Budapestben', 'Budapesten']]],
  ['Magyarországba utazom.', [['Magyarországba', 'Magyarországra']]],
  ['Két almák van itt.', [['almák', 'alma']]],
  ['Én tanár.', [['Én tanár', 'Én tanár vagyok']]],
  ['Szia, én Péter.', [['én Péter', 'én Péter vagyok']]],
  ['Ő van tanár.', [['van tanár', 'tanár']]],
  ['Kérek egy kávé.', [['kávé', 'kávét']]],
  ['Látok a házat.', [['Látok', 'Látom']]],
  ['Látom egy házat.', [['Látom', 'Látok']]],
  ['A házben vagyok.', [['házben', 'házban']]],
  ['A kertban ülünk.', [['kertban', 'kertben']]],
  ['A földhez megyek.', [['földhez', 'földhöz']]],
];
let n = 0;
for (const [text, want] of cases) { assert.deepEqual(fixes(text), want, text); n++; }

// capitals are a style note, not an error
const cap = localCheck('Szeretem a Magyar zenét.');
assert.equal(cap.length, 1); assert.equal(cap[0].sev, 'style'); assert.equal(cap[0].fix, 'magyar'); n++;

const clean = `Szia! Kovács Anna vagyok, és Budapesten lakom. Tanár vagyok egy iskolában. Van egy kutyám és két macskám.
Reggel kávét iszom, aztán busszal megyek a munkába. Látom a Dunát, és szeretem a várost. Kérek egy pohár vizet.
Péter itt van, de Éva nincs itthon. Hétfőn moziba megyünk, szombaton a Balatonra utazunk. Az alma piros, a ház nagy.
Tegnap olvastam egy könyvet a kertben. Szegeden is jártam már. A gyerekek a parkban játszanak. Két sört kérünk.`;
assert.deepEqual(localCheck(clean).filter((i) => i.sev === 'error'), [], 'no false alarms on correct text'); n++;
console.log(`checker: ${n} checks passed`);
