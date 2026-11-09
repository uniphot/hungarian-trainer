// Grammar topics A2. Same item mini-language as grammar-a1.js.
export default [
{
  id: 'nak-val', level: 'A2', title: '-nak/-nek és -val/-vel', en: 'To/for and with',
  summary: 'Adok egy könyvet Péternek. Nekem tetszik. Busszal megyek.',
  explain: `
<h4>-nak / -nek: to, for</h4>
<p><em>Adok egy könyvet Péternek.</em> (I give a book to Péter) · <em>Annának van egy kutyája.</em> (Anna has a dog)</p>
<p>It also goes with <b>kell</b> (must), <b>tetszik</b> (please) and <b>fáj</b> (hurt): <em>Nekem kell menni.</em> (I have to go) · <em>Nekem tetszik a ház.</em> (I like the house) · <em>Fáj a fejem.</em></p>
<table><tr><td class="ex">nekem</td><td class="ex">neked</td><td class="ex">neki</td><td class="ex">nekünk</td><td class="ex">nektek</td><td class="ex">nekik</td></tr>
<tr><td>to me</td><td>to you</td><td>to him/her</td><td>to us</td><td>to you (pl.)</td><td>to them</td></tr></table>
<h4>-val / -vel: with, by</h4>
<p>After a vowel: <em>Annával, kávéval</em>. After a consonant the v <b>turns into that consonant</b>: <em>busz → busszal, vonat → vonattal, tej → tejjel, Péter → Péterrel</em>.</p>
<table><tr><td class="ex">velem</td><td class="ex">veled</td><td class="ex">vele</td><td class="ex">velünk</td><td class="ex">veletek</td><td class="ex">velük</td></tr>
<tr><td>with me</td><td>with you</td><td>with him/her</td><td>with us</td><td>with you (pl.)</td><td>with them</td></tr></table>`,
  notes: {
    ru: 'Nekem kell = мне надо, Nekem tetszik = мне нравится, Fáj a fejem = у меня болит голова: the same dative logic. -val/-vel = с + творительный: busszal = автобусом, Annával = с Анной.',
    it: 'Nekem tetszik = mi piace, esattamente la stessa costruzione. -val/-vel = con: kávé tejjel = caffè con latte.',
    en: '“I like the house” is “the house pleases to-me”: Nekem tetszik a ház. And “by bus” is “with bus”: busszal.',
  },
  input: { q: 'What does it mean?', items: [
    'Péternek adom a könyvet. ? I’m giving the book to Péter*|I’m giving Péter a book about himself ~ -nek = to.',
    'Nekem tetszik ez a kép. ? I like this picture*|This picture likes me ~ The thing liked is the subject; the person takes -nek.',
    'Busszal megyek. ? I’m going by bus*|I’m going to the bus ~ -val/-vel = with, by (means).',
    'Annával beszélek. ? I’m talking with Anna*|I’m talking about Anna',
  ] },
  items: [
    'Adok egy könyvet {Péternek:Péter}.',
    '{Annának:Anna} van egy kutyája. ~ The owner takes -nak/-nek.',
    'Ma {busszal:busz} megyek. ~ busz + val → busszal.',
    'Kávét kérek {tejjel:tej}. ~ tej + vel → tejjel.',
    '{Vonattal:vonat} utazunk.',
    'Egy teát kérek {cukorral:cukor}.',
    '{Nekem:én} tetszik ez a ház.',
    'Holnap {nekem:én} is dolgozni kell.',
    'Gyere {velem:én}! ~ with me: velem.',
    'Beszéltél már {vele:ő}? ~ with him/her: vele.',
    '! Moziba megyek [Péterval>Péterrel]. ~ e is front, and v becomes r: Péterrel.',
    '! [Én>Nekem] kell menni. ~ kell goes with the -nak/-nek form: nekem kell.',
  ],
},
{
  id: 'fonevi', level: 'A2', title: 'Főnévi igenév: -ni', en: 'The infinitive: want to, can, like to',
  summary: 'Tudok úszni. Szeretek főzni. Ma dolgozni kell.',
  explain: `
<p>The infinitive ends in <b>-ni</b>: <em>olvas → olvasni, beszél → beszélni</em>. Verbs in -ít and two consonants add a vowel: <em>tanít → tanítani, mond → mondani</em>. -ik verbs lose the -ik: <em>dolgozik → dolgozni</em>.</p>
<p>Irregular: <em>eszik → enni, iszik → inni, megy → menni, jön → jönni, van → lenni, tesz → tenni, vesz → venni, alszik → aludni</em>.</p>
<table><tr><td class="ex">akar</td><td>want</td><td><em>Akarok enni.</em></td></tr>
<tr><td class="ex">tud</td><td>can, know how</td><td><em>Tudok úszni.</em></td></tr>
<tr><td class="ex">szeret</td><td>like</td><td><em>Szeretek főzni.</em></td></tr>
<tr><td class="ex">kell</td><td>must, have to</td><td><em>Ma dolgozni kell.</em></td></tr>
<tr><td class="ex">lehet</td><td>it is possible, may</td><td><em>Itt lehet fizetni?</em></td></tr></table>
<p>If the infinitive has a definite object, the main verb takes the definite form: <em>Meg akarom nézni a filmet.</em></p>`,
  notes: {
    ru: 'tud + infinitive = умею/могу: Tudok úszni = Я умею плавать. kell = надо (Ma dolgozni kell = Сегодня надо работать).',
    it: 'Come in italiano: Voglio mangiare = Akarok enni. Ma “so nuotare” si dice con tud: Tudok úszni.',
    en: 'Very like English: Akarok enni = I want to eat. tud covers both “can” and “know how to”.',
  },
  input: { q: 'What does it mean?', items: [
    'Tudok úszni. ? I can swim*|I know a swimmer ~ tud + -ni = can.',
    'Ma dolgozni kell. ? Today I have to work*|Today I want to work ~ kell = must.',
    'Szeretek olvasni. ? I like reading*|I’m reading something I like',
    'Itt lehet fizetni kártyával? ? Can you pay by card here?*|Do you have to pay by card here?',
  ] },
  items: [
    'Tudsz {úszni:úszik}?',
    'Szeretek {főzni:főz}.',
    'Ma {dolgozni:dolgozik} kell. ~ -ik verbs drop the -ik.',
    'Akarsz {enni:eszik} valamit? ~ eszik → enni.',
    'Mit szeretnél {inni:iszik}? ~ iszik → inni.',
    'Holnap korán kell {menni:megy}. ~ megy → menni.',
    'Nem tudok jól {beszélni:beszél} magyarul.',
    'Szeretném {megnézni:megnéz} a várat.',
    '{Tanulni:tanul} akarok.',
    'Nehéz magyarul {tanítani:tanít}. ~ -ít: tanítani.',
    '[Tudok*|Lehetek] úszni. ~ tud + infinitive = can.',
  ],
},
{
  id: 'mult', level: 'A2', title: 'Múlt idő', en: 'The past tense',
  summary: 'olvastam, olvastál, olvasott…; volt, ment, jött, evett.',
  explain: `
<p>The past marker is <b>-t</b> or <b>-ott/-ett/-ött</b>, then the person ending. There are only two vowel versions (a/e).</p>
<table><tr><th></th><th>olvas</th><th>kér</th><th>lát</th></tr>
<tr><td>én</td><td class="ex">olvastam</td><td class="ex">kértem</td><td class="ex">láttam</td></tr>
<tr><td>te</td><td class="ex">olvastál</td><td class="ex">kértél</td><td class="ex">láttál</td></tr>
<tr><td>ő</td><td class="ex">olvasott</td><td class="ex">kért</td><td class="ex">látott</td></tr>
<tr><td>mi</td><td class="ex">olvastunk</td><td class="ex">kértünk</td><td class="ex">láttunk</td></tr>
<tr><td>ti</td><td class="ex">olvastatok</td><td class="ex">kértetek</td><td class="ex">láttatok</td></tr>
<tr><td>ők</td><td class="ex">olvastak</td><td class="ex">kértek</td><td class="ex">láttak</td></tr></table>
<ul><li>The 3rd person often has <b>-ott/-ett/-ött</b>: <em>olvasott, nézett, főzött</em>. After l, r, n, j it is usually just <b>-t</b>: <em>kért, tanult, beszélt</em>.</li>
<li>Verbs ending in -ít or in a consonant + t keep the vowel everywhere: <em>tanítottam, értettem</em>.</li>
<li>Definite past: <em>olvastam, olvastad, olvasta, olvastuk, olvastátok, olvasták</em>.</li></ul>
<h4>Learn these</h4><p><em>van → volt</em> (was) · <em>megy → ment</em> · <em>jön → jött</em> · <em>eszik → evett, ettem</em> · <em>iszik → ivott, ittam</em> · <em>alszik → aludt</em> · <em>tesz → tett</em> · <em>vesz → vett</em></p>`,
  notes: {
    ru: 'One past tense, no aspect in the ending. Completion is shown by a prefix, very much like Russian: olvasott = читал, elolvasott = прочитал.',
    it: 'Un solo passato per tutto (passato prossimo e imperfetto): olvastam = ho letto / leggevo. Il prefisso meg-/el- indica che l’azione è conclusa.',
    en: 'One past tense covers “I read”, “I was reading” and “I have read”. A prefix shows that something was finished: elolvastam = I read it through.',
  },
  input: { q: 'When, and who?', items: [
    'Tegnap moziba mentem. ? I went to the cinema yesterday*|I’m going to the cinema tomorrow ~ mentem = I went.',
    'Láttad a filmet? ? Did you see the film?*|Are you watching the film? ~ -ad = you, past, definite.',
    'Hol voltatok? ? Where were you (plural)?*|Where are you?',
    'Anna főzött. ? Anna cooked*|Anna is cooking ~ -ött = past.',
  ] },
  items: [
    'Tegnap moziba {mentem:megy}.',
    'Tegnap este {olvastam:olvas} egy könyvet.',
    'Hol {voltál:van} tegnap?',
    'Anna {főzött:főz} vacsorát.',
    'Mi Bécsben {voltunk:van}.',
    'Ti mit {ettetek:eszik}?',
    'Ők sokat {dolgoztak:dolgozik}.',
    'Ki {hívott:hív}? ~ hív → hívott.',
    '{Láttad:lát} a filmet? ~ Definite past: -ad/-ed.',
    'Péter {megette:megeszik} a tortát. ~ eszik: ette in the definite past.',
    'Tegnap {ittam:iszik} egy sört.',
    'Jól {aludtál:alszik}?',
    '! Tegnap [megyek>mentem] haza. ~ Tegnap (yesterday): past.',
  ],
  drill: { verbs: ['olvas', 'kér', 'lát', 'tanul', 'beszél', 'ír', 'néz', 'dolgozik', 'van', 'megy', 'jön', 'eszik', 'iszik'], tenses: ['past'], def: false },
},
{
  id: 'igekoto', level: 'A2', title: 'Igekötők', en: 'Verbal prefixes: meg-, el-, ki-, be-',
  summary: 'kimegy, bejön, megcsinál, elolvas; and why it’s Nem csinálom meg.',
  explain: `
<table><tr><td class="ex">be-</td><td>in</td><td><em>bemegy</em> go in</td><td class="ex">ki-</td><td>out</td><td><em>kimegy</em> go out</td></tr>
<tr><td class="ex">fel-</td><td>up</td><td><em>felmegy</em> go up</td><td class="ex">le-</td><td>down</td><td><em>leül</em> sit down</td></tr>
<tr><td class="ex">el-</td><td>away; finished</td><td><em>elmegy</em> leave</td><td class="ex">vissza-</td><td>back</td><td><em>visszajön</em> come back</td></tr>
<tr><td class="ex">át-</td><td>across</td><td><em>átmegy</em> go across</td><td class="ex">haza-</td><td>home</td><td><em>hazamegy</em> go home</td></tr>
<tr><td class="ex">meg-</td><td colspan="5">done, completed: <em>megcsinál</em> (get it done), <em>megeszik</em> (eat up), <em>megtanul</em> (learn)</td></tr></table>
<h4>The prefix moves</h4>
<p>In a plain statement it sits on the verb: <em>Megcsinálom.</em> But it moves <b>behind the verb</b> when something else takes the stress spot before the verb: after <b>nem</b>, a <b>question word</b>, or an emphasised word.</p>
<p><em>Nem csinálom meg.</em> · <em>Mikor csinálod meg?</em> · <em>Péter csinálja meg.</em> (It’s Péter who’ll do it)</p>`,
  notes: {
    ru: 'Very close to Russian prefixes: meg-csinál ≈ с-делать, el-olvas ≈ про-читать, ki-megy ≈ вы-йти, be-megy ≈ в-ойти. The new part: the prefix detaches and goes after the verb in negation and questions: Nem csinálom meg.',
    it: 'Somigliano ai verbi frasali (uscire = kimegy, “go out”). meg-/el- danno l’idea di azione compiuta, come il passato prossimo rispetto all’imperfetto.',
    en: 'Like English phrasal verbs (go out, sit down), but the particle comes first: kimegy = go out. And it moves after the verb in negatives and questions: Nem megyek ki.',
  },
  input: { q: 'What does it mean?', items: [
    'Kimegyek a kertbe. ? I’m going out into the garden*|I’m in the garden ~ ki- = out.',
    'Megcsináltam. ? I got it done*|I was doing it ~ meg- = completed.',
    'Nem megyek el. ? I’m not leaving*|I’m leaving ~ el- moved behind the verb after nem.',
    'Mikor jössz haza? ? When are you coming home?*|When did you come home?',
  ] },
  items: [
    'Nem csinálom {meg}. ~ After nem the prefix moves behind the verb.',
    'Mikor jössz {haza}? ~ After a question word, too.',
    'Péter {kimegy:ki + megy} a kertbe.',
    '{Megcsináltam:meg + csinál} a házi feladatot. ~ The definite past: the homework.',
    'Anna {bemegy:be + megy} a boltba.',
    'A lift {felmegy:fel + megy} az ötödik emeletre.',
    'Nem megyek {ki}, mert esik. ~ nem: the prefix goes behind.',
    'Kérem, {üljön le|üljön le:le + ül}! ~ Polite request: üljön, and the prefix follows.',
    '[Megeszem*|Eszem meg] a levest. ~ A plain statement: prefix first.',
    '[Nem eszem meg*|Nem megeszem] a levest. ~ With nem the prefix goes after the verb.',
    '! Nem [megcsinálom>csinálom meg]. ~ After nem: csinálom meg.',
  ],
},
{
  id: 'lak-lek', level: 'A2', title: 'Szeretlek: -lak/-lek', en: 'I … you; object pronouns',
  summary: 'Szeretlek, látlak, várlak; engem, téged, őt.',
  explain: `
<p>When <b>I</b> do something to <b>you</b>, the verb takes <b>-lak/-lek</b>: <em>szeretlek</em> (I love you), <em>látlak</em> (I see you), <em>várlak</em> (I’ll wait for you), <em>hívlak</em> (I’ll call you). Two consonants or -ít add a vowel: <em>értelek, tanítalak</em>.</p>
<h4>Object pronouns</h4>
<table><tr><td class="ex">engem</td><td>me</td><td class="ex">minket</td><td>us</td></tr>
<tr><td class="ex">téged</td><td>you</td><td class="ex">titeket</td><td>you (pl.)</td></tr>
<tr><td class="ex">őt</td><td>him, her</td><td class="ex">őket</td><td>them</td></tr></table>
<p>With engem, téged, minket, titeket the verb is <b>indefinite</b>: <em>Péter engem lát.</em> With őt and őket it is <b>definite</b>: <em>Péter látja őt.</em></p>`,
  notes: {
    ru: 'Szeretlek = я тебя люблю in one word: the ending holds both “I” and “you”. And engem/téged go with the indefinite form, unlike őt (him/her).',
    it: 'Szeretlek = ti amo, una parola sola come in italiano “ti amo” senza “io”.',
    en: 'One word for “I love you”: szeretlek. The ending -lek means “I … you”.',
  },
  input: { q: 'Who does what to whom?', items: [
    'Szeretlek. ? I love you*|You love me|I love him ~ -lek = I … you.',
    'Péter téged keres. ? Péter is looking for you*|You are looking for Péter ~ téged = you (object).',
    'Holnap hívlak. ? I’ll call you tomorrow*|Call me tomorrow',
    'Látod őt? ? Do you see him/her?*|Does he see you?',
  ] },
  items: [
    '{Szeretlek:szeret}! (I … you)',
    'Holnap {hívlak:hív}. (I call you)',
    '{Várlak:vár} a kávézóban. (I’ll wait for you)',
    '{Értelek:ért}. (I understand you) ~ Two consonants: -elek.',
    'Péter {téged} keres. (you) ~ téged = you (object).',
    'Anna {engem} hív. (me)',
    '{Látlak:lát}! (I see you)',
    'Ismered {őt}? (him/her)',
    '! Anna [látja>lát] engem. ~ engem takes the indefinite form.',
    '! Péter [lát>látja] őt. ~ őt takes the definite form.',
  ],
},
{
  id: 'feltetes', level: 'A2', title: 'Szeretnék…', en: 'Would like, could you: the conditional',
  summary: 'Szeretnék egy kávét. Tudnál segíteni? Jó lenne.',
  explain: `
<p>The conditional marker is <b>-na/-ne</b> (<b>-nék</b> for én). Its everyday job is <b>politeness</b>:</p>
<table><tr><td class="ex">Szeretnék egy kávét.</td><td>I would like a coffee.</td></tr>
<tr><td class="ex">Tudnál segíteni?</td><td>Could you help?</td></tr>
<tr><td class="ex">Kérnék egy pohár vizet.</td><td>I’d like a glass of water.</td></tr>
<tr><td class="ex">Jó lenne!</td><td>That would be good!</td></tr></table>
<table><tr><th></th><th>szeret</th><th>tud</th></tr>
<tr><td>én</td><td class="ex">szeretnék</td><td class="ex">tudnék</td></tr><tr><td>te</td><td class="ex">szeretnél</td><td class="ex">tudnál</td></tr>
<tr><td>ő</td><td class="ex">szeretne</td><td class="ex">tudna</td></tr><tr><td>mi</td><td class="ex">szeretnénk</td><td class="ex">tudnánk</td></tr>
<tr><td>ti</td><td class="ex">szeretnétek</td><td class="ex">tudnátok</td></tr><tr><td>ők</td><td class="ex">szeretnének</td><td class="ex">tudnának</td></tr></table>
<p><em>van → lenne</em> (would be). Definite: <em>szeretném, tudnám</em>: <em>Szeretném látni a várat.</em></p>`,
  notes: {
    ru: 'Szeretnék = я бы хотел: the “бы” is inside the ending. Use it exactly where you’d use “я бы хотел / не могли бы вы”.',
    it: 'Szeretnék = vorrei, Tudnál…? = potresti…? Si usa come il condizionale di cortesia italiano.',
    en: 'Szeretnék = I would like. It’s the polite way to ask for anything in a shop or café.',
  },
  input: { q: 'What does it mean?', items: [
    'Szeretnék egy jegyet. ? I would like a ticket*|I like tickets ~ -nék = would (I).',
    'Tudnál segíteni? ? Could you help?*|Can you help? (blunt) ~ -nál = would (you).',
    'Jó lenne. ? It would be good*|It was good',
  ] },
  items: [
    '{Szeretnék:szeret} egy kávét. ~ Polite: I would like.',
    '{Tudnál:tud} segíteni? ~ Could you help?',
    'Mit {szeretnél:szeret} enni?',
    'Jó {lenne:van} találkozni. ~ van → lenne.',
    '{Kérnék:kér} egy pohár vizet.',
    'Mi Rómába {utaznánk:utazik}.',
    '[Szeretnék*|Szeretek] egy jegyet Pécsre. ~ Asking politely: the conditional.',
    '{Szeretném:szeret} látni a várat. ~ Definite: the castle.',
  ],
},
];
