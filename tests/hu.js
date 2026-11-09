// Hungarian engine: run with `node tests/hu.js`.
import assert from 'node:assert/strict';
import { letters, harmony, rounded, syllables, article, unlong } from '../js/core/hu.js';
import { caseForm, plural, possessive, present, past, lak, infinitive, nounInfo } from '../js/core/morph.js';
import { numHu, ordinalHu, dayOfMonth, timeHu } from '../js/core/numbers.js';

let n = 0;
const eq = (a, b, msg) => { assert.deepEqual(a, b, `${msg || "expected"}: got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`); n++; };

// Letters and sounds
eq(letters('gyönyörű'), ['gy', 'ö', 'ny', 'ö', 'r', 'ű']);
eq(letters('asszony'), ['a', 'sz', 'sz', 'o', 'ny'], 'doubled digraph');
eq(letters('meggy'), ['m', 'e', 'gy', 'gy']);
eq(letters('dzsungel'), ['dzs', 'u', 'n', 'g', 'e', 'l']);
eq(letters('olvassa'), ['o', 'l', 'v', 'a', 's', 's', 'a']);
eq(syllables('Budapest'), ['Bu', 'da', 'pest']);
eq(syllables('asztal'), ['asz', 'tal']);
eq(syllables('gyerekek'), ['gye', 're', 'kek']);
eq(unlong('Kórház ő'), 'Korhaz ö');
for (const [w, h] of [['ház', 'back'], ['kert', 'front'], ['víz', 'front'], ['kávé', 'back'], ['papír', 'back'], ['híd', 'back'], ['sofőr', 'front'], ['hotel', 'front'], ['taxi', 'back'], ['férfi', 'back']]) eq(harmony(w), h, w);
eq(rounded('föld'), true); eq(rounded('üveg'), false); eq(rounded('ház'), false);
eq(article('alma'), 'az'); eq(article('ház'), 'a'); eq(article('üveg'), 'az');

// Plural, object and cases
const forms = {
  ház: { pl: 'házak', acc: 'házat', ine: 'házban', sup: 'házon', all: 'házhoz', ins: 'házzal', dat: 'háznak' },
  kert: { pl: 'kertek', acc: 'kertet', ine: 'kertben', sup: 'kerten', all: 'kerthez', ins: 'kerttel' },
  alma: { pl: 'almák', acc: 'almát', ine: 'almában', sup: 'almán', ins: 'almával', ela: 'almából' },
  kefe: { pl: 'kefék', acc: 'kefét', ine: 'kefében', ins: 'kefével' },
  gyümölcs: { pl: 'gyümölcsök', acc: 'gyümölcsöt', sup: 'gyümölcsön', all: 'gyümölcshöz', ins: 'gyümölccsel' },
  asztal: { pl: 'asztalok', acc: 'asztalt', sup: 'asztalon', sub: 'asztalra', ins: 'asztallal' },
  föld: { pl: 'földek', acc: 'földet', sup: 'földön', all: 'földhöz' },
  víz: { pl: 'vizek', acc: 'vizet', ine: 'vízben', sup: 'vízen', ins: 'vízzel' },
  ló: { pl: 'lovak', acc: 'lovat', sup: 'lovon', ins: 'lóval', dat: 'lónak' },
  tó: { sup: 'tavon', ine: 'tóban' },
  kő: { sup: 'kövön', ins: 'kővel' },
  cukor: { pl: 'cukrok', acc: 'cukrot', sup: 'cukron', ins: 'cukorral', ine: 'cukorban' },
  kenyér: { pl: 'kenyerek', acc: 'kenyeret', sup: 'kenyéren' },
  híd: { sup: 'hídon', ine: 'hídban', acc: 'hidat' },
  autó: { pl: 'autók', acc: 'autót', ine: 'autóban', ins: 'autóval' },
  kulcs: { ins: 'kulccsal', tra: 'kulccsá' },
  toll: { ins: 'tollal' },
  szó: { sup: 'szón', acc: 'szót' },
  // not in the lexicon: the rules
  rizs: { ins: 'rizzsel', acc: 'rizst', pl: 'rizsek' },
  park: { pl: 'parkok', acc: 'parkot' },
};
for (const [w, f] of Object.entries(forms)) for (const [k, v] of Object.entries(f)) {
  eq(k === 'pl' ? plural(w) : caseForm(w, k), v, `${w} ${k}`);
}
eq(caseForm('ház', 'ine', { plural: true }), 'házakban');
eq(caseForm('ház', 'acc', { plural: true }), 'házakat');
eq(caseForm('gyümölcs', 'acc', { plural: true }), 'gyümölcsöket');
eq(caseForm('ház', 'sup', { plural: true }), 'házakon');
eq(caseForm('ház', 'ins', { plural: true }), 'házakkal');
eq(nounInfo('ház').known, true);
// compounds follow their last part, which the listed plural shows: számítógép(ek) is front
eq(['ine', 'sup', 'all'].map((c) => caseForm('számítógép', c)), ['számítógépben', 'számítógépen', 'számítógéphez']);
eq(caseForm('férfi', 'dat'), 'férfinak');

// Possessive
eq([0, 1, 2, 3, 4, 5].map((p) => possessive('ház', p)), ['házam', 'házad', 'háza', 'házunk', 'házatok', 'házuk']);
eq([0, 1, 2, 3, 4, 5].map((p) => possessive('kert', p)), ['kertem', 'kerted', 'kertje', 'kertünk', 'kertetek', 'kertjük']);
eq([0, 1, 2, 3, 4, 5].map((p) => possessive('alma', p)), ['almám', 'almád', 'almája', 'almánk', 'almátok', 'almájuk']);
eq([0, 1, 2, 3, 4, 5].map((p) => possessive('könyv', p)), ['könyvem', 'könyved', 'könyve', 'könyvünk', 'könyvetek', 'könyvük']);
eq([0, 1, 2, 3, 4, 5].map((p) => possessive('ló', p)), ['lovam', 'lovad', 'lova', 'lovunk', 'lovatok', 'lovuk']);
eq([0, 2, 5].map((p) => possessive('autó', p)), ['autóm', 'autója', 'autójuk']);
eq(possessive('cipő', 4), 'cipőtök');
eq(possessive('apa', 2), 'apja');
eq(possessive('fiú', 0), 'fiam');
eq([0, 3, 4].map((p) => possessive('férfi', p)), ['férfim', 'férfink', 'férfitok']);
eq(possessive('számítógép', 5), 'számítógépük');

// Verbs: present
eq(present('olvas'), ['olvasok', 'olvasol', 'olvas', 'olvasunk', 'olvastok', 'olvasnak']);
eq(present('olvas', { def: true }), ['olvasom', 'olvasod', 'olvassa', 'olvassuk', 'olvassátok', 'olvassák']);
eq(present('kér'), ['kérek', 'kérsz', 'kér', 'kérünk', 'kértek', 'kérnek']);
eq(present('kér', { def: true }), ['kérem', 'kéred', 'kéri', 'kérjük', 'kéritek', 'kérik']);
eq(present('főz'), ['főzök', 'főzöl', 'főz', 'főzünk', 'főztök', 'főznek']);
eq(present('főz', { def: true }), ['főzöm', 'főzöd', 'főzi', 'főzzük', 'főzitek', 'főzik']);
eq(present('tanít'), ['tanítok', 'tanítasz', 'tanít', 'tanítunk', 'tanítotok', 'tanítanak']);
eq(present('mond', { def: true }), ['mondom', 'mondod', 'mondja', 'mondjuk', 'mondjátok', 'mondják']);
eq(present('küld'), ['küldök', 'küldesz', 'küld', 'küldünk', 'küldötök', 'küldenek']);
eq(present('ért'), ['értek', 'értesz', 'ért', 'értünk', 'értetek', 'értenek']);
eq(present('hall'), ['hallok', 'hallasz', 'hall', 'hallunk', 'hallotok', 'hallanak']);
eq(present('áll'), ['állok', 'állsz', 'áll', 'állunk', 'álltok', 'állnak']);
eq(present('dolgozik'), ['dolgozom', 'dolgozol', 'dolgozik', 'dolgozunk', 'dolgoztok', 'dolgoznak']);
eq(present('lakik'), ['lakom', 'laksz', 'lakik', 'lakunk', 'laktok', 'laknak']);
eq(present('játszik', { def: true }), ['játszom', 'játszod', 'játssza', 'játsszuk', 'játsszátok', 'játsszák']);
eq(present('ír'), ['írok', 'írsz', 'ír', 'írunk', 'írtok', 'írnak']);
eq(present('néz', { def: true }), ['nézem', 'nézed', 'nézi', 'nézzük', 'nézitek', 'nézik']);
eq(present('tesz', { def: true }), ['teszem', 'teszed', 'teszi', 'tesszük', 'teszitek', 'teszik']);
eq(present('van'), ['vagyok', 'vagy', 'van', 'vagyunk', 'vagytok', 'vannak']);
eq(present('megcsinál', { def: true })[2], 'megcsinálja');
eq(present('elolvas')[0], 'elolvasok');

// Verbs: past, -lak/-lek, infinitive
eq(past('olvas'), ['olvastam', 'olvastál', 'olvasott', 'olvastunk', 'olvastatok', 'olvastak']);
eq(past('olvas', { def: true }), ['olvastam', 'olvastad', 'olvasta', 'olvastuk', 'olvastátok', 'olvasták']);
eq(past('lát'), ['láttam', 'láttál', 'látott', 'láttunk', 'láttatok', 'láttak']);
eq(past('néz', { def: true }), ['néztem', 'nézted', 'nézte', 'néztük', 'néztétek', 'nézték']);
eq(past('iszik'), ['ittam', 'ittál', 'ivott', 'ittunk', 'ittatok', 'ittak']);
eq(past('megy'), ['mentem', 'mentél', 'ment', 'mentünk', 'mentetek', 'mentek']);
eq(past('ért'), ['értettem', 'értettél', 'értett', 'értettünk', 'értettetek', 'értettek']);
eq(past('vacsorázik')[0], 'vacsoráztam');
eq([lak('szeret'), lak('lát'), lak('vár'), lak('ért'), lak('tanít')], ['szeretlek', 'látlak', 'várlak', 'értelek', 'tanítalak']);
eq(['olvas', 'tanít', 'mond', 'dolgozik', 'eszik', 'van', 'játszik', 'áll'].map(infinitive), ['olvasni', 'tanítani', 'mondani', 'dolgozni', 'enni', 'lenni', 'játszani', 'állni']);

// Numbers, dates, time
const nums = { 0: 'nulla', 2: 'kettő', 7: 'hét', 10: 'tíz', 11: 'tizenegy', 12: 'tizenkettő', 20: 'húsz', 21: 'huszonegy', 30: 'harminc', 45: 'negyvenöt', 99: 'kilencvenkilenc', 100: 'száz', 101: 'százegy', 200: 'kétszáz', 345: 'háromszáznegyvenöt', 1000: 'ezer', 1956: 'ezerkilencszázötvenhat', 2000: 'kétezer', 2026: 'kétezer-huszonhat', 12500: 'tizenkétezer-ötszáz', 1000000: 'egymillió' };
for (const [k, v] of Object.entries(nums)) eq(numHu(+k), v, `number ${k}`);
eq(numHu(2, { attr: true }), 'két'); eq(numHu(12, { attr: true }), 'tizenkét'); eq(numHu(1250, { attr: true }), 'ezerkétszázötven');
const ords = { 1: 'első', 2: 'második', 3: 'harmadik', 5: 'ötödik', 10: 'tizedik', 11: 'tizenegyedik', 12: 'tizenkettedik', 20: 'huszadik', 21: 'huszonegyedik', 100: 'századik' };
for (const [k, v] of Object.entries(ords)) eq(ordinalHu(+k), v, `ordinal ${k}`);
eq([1, 2, 3, 9, 15, 20, 21, 30, 31].map(dayOfMonth), ['elseje', 'másodika', 'harmadika', 'kilencedike', 'tizenötödike', 'huszadika', 'huszonegyedike', 'harmincadika', 'harmincegyedike']);
eq(timeHu(3, 0), 'három óra'); eq(timeHu(2, 0), 'két óra'); eq(timeHu(3, 15), 'negyed négy'); eq(timeHu(3, 30), 'fél négy');
eq(timeHu(3, 45), 'háromnegyed négy'); eq(timeHu(12, 30), 'fél egy'); eq(timeHu(11, 45), 'háromnegyed tizenkettő'); eq(timeHu(14, 20), 'tizennégy óra húsz perc');

console.log(`hungarian engine: ${n} checks passed`);
