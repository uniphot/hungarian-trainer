// Grammar topics B1. Same item mini-language as grammar-a1.js.
export default [
{
  id: 'felszolito', level: 'B1', title: 'Felszólító mód', en: 'The imperative',
  summary: 'Gyere! Menj! Várj! Nézd! and the polite Üljön le!',
  explain: `
<p>The imperative marker is <b>-j</b>, which merges with some consonants. Start with the forms you hear every day:</p>
<table><tr><td class="ex">Gyere!</td><td>Come! (jön)</td><td class="ex">Menj!</td><td>Go! (megy)</td></tr>
<tr><td class="ex">Várj!</td><td>Wait!</td><td class="ex">Figyelj!</td><td>Listen! Pay attention!</td></tr>
<tr><td class="ex">Nézd!</td><td>Look at it! (definite)</td><td class="ex">Segíts!</td><td>Help! (segít + j → segíts)</td></tr>
<tr><td class="ex">Ülj le!</td><td>Sit down! (te)</td><td class="ex">Üljön le!</td><td>Please sit down. (Ön)</td></tr></table>
<p>The prefix goes <b>after</b> the imperative: <em>Gyere be!</em> (come in) · <em>Hívj fel!</em> (call me) · <em>Mondd meg neki!</em> (tell him)</p>
<p>The polite form (Ön) uses the 3rd person: <em>Jöjjön be!</em> · <em>Várjon egy kicsit!</em></p>`,
  notes: {
    ru: 'The prefix goes after the verb in the imperative: Gyere be! = Входи! Ülj le! = Садись! Polite Üljön le! = Садитесь!',
    it: 'Come il Lei: Üljön le! = Si sieda! Jöjjön be! = Entri!',
    en: 'The particle follows the verb, as in English: Gyere be! = Come in! Ülj le! = Sit down!',
  },
  input: { q: 'What is being asked?', items: [
    'Gyere be! ? Come in!*|Go out! ~ be = in.',
    'Várjon egy kicsit! ? Please wait a moment (polite)*|I’ll wait a bit',
    'Hívj fel holnap! ? Call me tomorrow!*|I’ll call you tomorrow',
  ] },
  items: [
    '{Gyere:jön} ide! (come)',
    '{Menj:megy} haza! (go)',
    '{Várj:vár} egy kicsit! (wait)',
    '{Nézd:néz} a térképet! (look at it) ~ Definite: Nézd!',
    '{Figyelj:figyel}! (pay attention)',
    'Kérem, {üljön:ül} le! (polite) ~ Ön: üljön.',
    '{Hívj:hív} fel holnap! (call)',
    'Mondd {meg} neki! ~ The prefix follows the imperative.',
    '{Segíts:segít}! (help) ~ segít + j → segíts.',
    'Gyere {be}! (in)',
  ],
},
];
