// Grammar topics A1. Item mini-language (parsed in views/exercise.js):
//   fill:   "Kérek egy {kávét:kávé}."         {answer|alternative:hint}
//   choice: "[Budapestre*|Budapestbe] megyek."  * marks the correct option
//   fix:    "! Látok [a>egy] házat."           learner finds the wrong word and corrects it
//   "~ text" at the end = explanation shown after answering.
// input = structured-input activity: interpret the meaning from the form before producing it.
// notes = what the learner's other languages make easy or hard (ru, it, en).
export default [
{
  id: 'alapok', level: 'A1', title: 'Nincs nem: ő, a/az, egy', en: 'No gender; the articles',
  summary: 'One word for he and she, adjectives that never change, and the articles a, az and egy.',
  explain: `
<p>Hungarian has <b>no grammatical gender</b>. One pronoun means both he and she: <em>ő</em>. Adjectives never agree in gender: <em>nagy ház</em> (a big house), <em>nagy lány</em> (a tall girl).</p>
<h4>The definite article</h4>
<table><tr><th>before a consonant</th><th>before a vowel</th></tr>
<tr><td>a ház, a nő, a busz</td><td>az alma, az autó, az étterem</td></tr></table>
<p>It works like English a/an, but it means <b>the</b>.</p>
<h4>The indefinite article</h4><p><em>egy</em> = a, an (it is also the number one): <em>egy ház, egy alma</em>.</p>
<h4>Adjectives before a noun don’t change</h4><p><em>a nagy ház · a nagy házak</em>. After the noun, as the predicate, they do take the plural: <em>A házak nagyok.</em></p>`,
  notes: {
    ru: 'Two pieces of good news: no gender at all, and no agreement of adjectives before nouns. The new piece is the article, which Russian doesn’t have: a/az = “the”, egy = “a”.',
    it: 'Niente genere e niente accordo dell’aggettivo davanti al nome. a/az funziona come lo/il davanti a vocale (l’): az alma come “l’arancia”.',
    en: 'a/az is chosen like a/an, but it means “the”. And Hungarian uses it more than English: A kávé jó (Coffee is good).',
  },
  input: { q: 'Use the articles and forms to work out the meaning.', items: [
    'Ő orvos. Who could this be? ? A man or a woman: the sentence doesn’t say*|Only a man|Only a woman ~ ő means both he and she.',
    'Az alma piros. Why az and not a? ? alma starts with a vowel*|alma is feminine|alma is plural ~ az before a vowel sound, a before a consonant.',
    'Egy kávét kérek. How many coffees? ? One*|The (specific) coffee|Several ~ egy = a, one.',
    'A ház nagy és a lány is nagy. Does nagy change? ? No: adjectives never change for gender*|Yes, for the girl ~ No gender, so no agreement.',
  ] },
  items: [
    '{Az} alma piros. ~ az before a vowel.',
    '{A} ház nagy. ~ a before a consonant.',
    '{Az} autó új. ~ autó starts with a vowel.',
    '{Az} egyetem régi.',
    '{A} nő tanár.',
    '[A*|Az] kávé forró. ~ k is a consonant: a.',
    '[Az*|A] étterem drága. ~ é is a vowel: az.',
    '[Az*|A] óra pontos. ~ ó is a vowel: az.',
    '! [Az>A] busz késik. ~ busz starts with a consonant: a busz.',
    '! [A>Az] ablak nyitva van. ~ ablak starts with a vowel: az ablak.',
    'Ez {egy} szép virág. ~ egy = a, an.',
    'Anna nagyon [kedves*|kedvesek]. ~ One person, and no gender: kedves.',
  ],
},
{
  id: 'van', level: 'A1', title: 'Lenni: vagyok, vagy, van', en: 'To be, and when it disappears',
  summary: 'vagyok, vagy, van…; why “Péter tanár” has no verb; nincs for “isn’t there”.',
  explain: `
<table><tr><th></th><th>van (to be)</th><th></th><th></th></tr>
<tr><td>én</td><td class="ex">vagyok</td><td>mi</td><td class="ex">vagyunk</td></tr>
<tr><td>te</td><td class="ex">vagy</td><td>ti</td><td class="ex">vagytok</td></tr>
<tr><td>ő / Ön</td><td class="ex">van</td><td>ők / Önök</td><td class="ex">vannak</td></tr></table>
<h4>No van with a noun or adjective in the 3rd person</h4>
<p><em>Péter tanár.</em> (Péter is a teacher) · <em>A ház nagy.</em> (The house is big)<br>But <em>Tanár vagyok.</em> (I am a teacher) — 1st and 2nd person keep the verb.</p>
<h4>van for where something is, and for “there is”</h4>
<p><em>Péter itt van.</em> (Péter is here) · <em>Van egy kávézó a sarkon.</em> (There is a café on the corner)</p>
<h4>Negative</h4>
<p>With a noun or adjective: <em>nem</em>. <em>Péter nem tanár.</em> · <em>Nem vagyok fáradt.</em><br>For “is not there / there is no”: <b>nincs</b> (plural <b>nincsenek</b>). <em>Péter nincs itthon.</em> · <em>Nincs tej.</em> · <em>A gyerekek nincsenek itt.</em></p>`,
  notes: {
    ru: 'Just like Russian, the 3rd person drops the verb: Péter tanár = Пётр учитель. But unlike Russian, 1st and 2nd person need it: Tanár vagyok (not “Én tanár”). nincs = нет: Nincs tej = Молока нет.',
    it: 'A differenza dell’italiano, alla 3ª persona con un nome o un aggettivo il verbo sparisce: Péter tanár = Pietro è insegnante. nincs = non c’è.',
    en: '“He is a teacher” is Ő tanár, with no “is”. But “I am a teacher” keeps it: Tanár vagyok. nincs = “isn’t there / there is no”.',
  },
  input: { q: 'What does it mean?', items: [
    'Péter orvos. ? Péter is a doctor*|Péter has a doctor|Péter is at the doctor’s ~ 3rd person + noun: no van.',
    'Péter itt van. ? Péter is here*|Here is Péter’s doctor ~ Where someone is: van stays.',
    'Nincs tej. ? There is no milk*|The milk is not good|I am not milk ~ nincs = there is no.',
    'Tanár vagyok. Who is the teacher? ? I am*|He is|You are ~ vagyok = I am.',
    'Fáradt vagy? Who is asked? ? You (one person, informal)*|You all|He ~ vagy = you are (te).',
  ] },
  items: [
    'Én magyar {vagyok}.',
    'Te olasz {vagy}?',
    'Mi Budapesten {vagyunk}.',
    'Ti hol {vagytok}?',
    'Ők otthon {vannak}.',
    'Hol {van} a posta? ~ Where something is: van.',
    '[Péter tanár.*|Péter tanár van.] ~ 3rd person + noun: no van.',
    '! A ház [van>-] nagy. ~ 3rd person + adjective: no van.',
    '! Én [tanár>tanár vagyok]. ~ 1st and 2nd person need the verb.',
    'Ma {nincs} tej a hűtőben. ~ There is no…: nincs.',
    'Péter [nincs*|nem] itthon. ~ Not here (a place): nincs.',
    'Péter [nem*|nincs] orvos. ~ With a noun: nem.',
    'A gyerekek {nincsenek} az iskolában. ~ Plural: nincsenek.',
  ],
},
{
  id: 'harmonia', level: 'A1', title: 'Magánhangzó-harmónia', en: 'Vowel harmony',
  summary: 'Why it is házban but kertben, and házhoz but kerthez and földhöz.',
  explain: `
<p>Most endings come in two or three versions, and the <b>vowels of the word</b> choose which.</p>
<table><tr><th>the word has…</th><th>example</th><th>two-way</th><th>three-way</th></tr>
<tr><td>back vowels <b>a á o ó u ú</b></td><td>ház</td><td class="ex">házban</td><td class="ex">házhoz</td></tr>
<tr><td>front vowels <b>e é i í</b></td><td>kert</td><td class="ex">kertben</td><td class="ex">kerthez</td></tr>
<tr><td>front rounded <b>ö ő ü ű</b> (last vowel)</td><td>föld</td><td class="ex">földben</td><td class="ex">földhöz</td></tr></table>
<h4>The neutral vowels</h4>
<p><b>i, í, é</b> go with either family. In a mixed word the back vowel wins: <em>papír → papírban</em>, <em>kávé → kávéban</em>. A word with only neutral vowels is front: <em>víz → vízben</em>.</p>
<h4>A few exceptions to learn</h4><p><em>híd → hídon</em> (bridge), <em>cél → célba</em> (goal), <em>férfi → férfinak</em>: only i/í/é, but back endings.</p>
<h4>Compounds follow their last part</h4><p><em>Budapest → Budapesten</em> (pest), <em>Magyarország → Magyarországon</em>.</p>`,
  notes: {
    ru: 'A new idea for you: endings change their vowel to match the word. Not like Russian endings, which depend on gender and declension type: here only the vowels of the word decide.',
    it: 'Un’idea nuova: la desinenza si adatta alle vocali della parola. Non dipende dal genere (che non c’è), solo dal suono.',
    en: 'A new idea: endings change their vowel to match the word, so the whole word “sounds” back or front.',
  },
  input: { q: 'Which ending sounds right? Trust your ear.', audio: false, items: [
    'ház + in ? házban*|házben ~ á is a back vowel: -ban.',
    'kert + in ? kertben*|kertban ~ e is front: -ben.',
    'föld + to ? földhöz*|földhez|földhoz ~ The last vowel is ö (front, rounded): -höz.',
    'papír + in ? papírban*|papírben ~ í is neutral; the a decides: back.',
    'víz + in ? vízben*|vízban ~ Only neutral vowels: front.',
  ] },
  items: [
    'a ház[ban*|ben] ~ á: back.',
    'a kert[ben*|ban] ~ e: front.',
    'a könyv[ben*|ban] ~ ö: front.',
    'a víz[ben*|ban] ~ Only í, a neutral vowel: front.',
    'a kávé[ban*|ben] ~ é is neutral; á decides.',
    'az autó[ban*|ben] ~ au, ó: back.',
    'a föld[ön*|en|on] ~ The last vowel ö is rounded: -ön.',
    'a hegy[en*|on|ön] ~ e: front, not rounded.',
    'az asztal[on*|en|ön] ~ a: back.',
    'Péter[hez*|hoz|höz] ~ e: front.',
    'a fiú[hoz*|hez|höz] ~ ú: back.',
    'a tükör[höz*|hez|hoz] ~ The last vowel ö: rounded.',
    'a papír[ban*|ben] ~ The a decides: back.',
    'a híd[on*|en] ~ An exception: híd takes back endings.',
  ],
},
{
  id: 'tobbes', level: 'A1', title: 'Többes szám: -k', en: 'The plural',
  summary: 'házak, kertek, almák; and the surprise: két alma, not *két almák.',
  explain: `
<table><tr><th>word ends in…</th><th>plural</th></tr>
<tr><td>a vowel: add -k (a → á, e → é)</td><td class="ex">autó → autók · alma → almák · kefe → kefék</td></tr>
<tr><td>a consonant: -ok / -ek / -ök</td><td class="ex">asztal → asztalok · kert → kertek · gyümölcs → gyümölcsök</td></tr>
<tr><td>some words: -ak / -ek (learn them)</td><td class="ex">ház → házak · toll → tollak · könyv → könyvek</td></tr>
<tr><td>some words change their stem</td><td class="ex">ló → lovak · víz → vizek · kenyér → kenyerek</td></tr></table>
<h4>No plural after numbers and quantities</h4>
<p><em>két alma</em> (two apples) · <em>öt ember</em> (five people) · <em>sok ház</em> (many houses) · <em>néhány nap</em> (a few days). The verb stays singular too: <em>Öt gyerek játszik.</em></p>
<h4>Adjectives as the predicate do take the plural</h4><p><em>A házak nagyok.</em> · <em>A gyerekek fáradtak.</em></p>`,
  notes: {
    ru: 'After numbers the noun is simply singular, always: két alma, öt alma (compare два яблока, пять яблок). Much easier than Russian.',
    it: 'Dopo i numeri il nome resta singolare: két alma = due mele. Anche dopo “molti”: sok ember = molte persone.',
    en: 'After numbers and “many”, the noun stays singular: két alma (two apples), sok ember (many people).',
  },
  input: { q: 'What does it mean?', items: [
    'Három almát veszek. How many apples? ? Three*|One ~ After a number the noun is singular; the number says how many.',
    'A házak szépek. ? The houses are beautiful*|The house is beautiful ~ -k = plural.',
    'Sok ember van itt. ? There are many people here*|There is one person here ~ sok + singular.',
    'Az autók drágák. ? The cars are expensive*|The car is expensive',
  ] },
  items: [
    'Az {almák:alma} pirosak. ~ After a vowel: -k, and a becomes á.',
    'A {kertek:kert} szépek.',
    'Az {asztalok:asztal} újak.',
    'A {gyümölcsök:gyümölcs} édesek. ~ ö in the word: -ök.',
    'A {házak:ház} régiek. ~ ház → házak: learn it with the word.',
    'A {lovak:ló} gyorsak. ~ ló → lovak.',
    'Az {autók:autó} drágák.',
    'Itt két {ház:ház} van. ~ After a number: singular.',
    '! Öt [gyerekek>gyerek] játszik a parkban. ~ After a number: singular, and the verb too.',
    '! Sok [emberek>ember] van itt. ~ After sok: singular.',
    'A [gyerekek*|gyerekok] a kertben vannak. ~ e is front: -ek.',
    'A {székek:szék} kényelmesek.',
  ],
},
{
  id: 'kerdesek', level: 'A1', title: 'Kérdések', en: 'Questions',
  summary: 'Ki? Mi? Hol? Hová? Honnan? Mikor? Mennyi? and yes/no questions by melody.',
  explain: `
<table><tr><td class="ex">Ki?</td><td>who</td><td class="ex">Mi?</td><td>what</td></tr>
<tr><td class="ex">Hol?</td><td>where (at)</td><td class="ex">Hová? / Hova?</td><td>where to</td></tr>
<tr><td class="ex">Honnan?</td><td>where from</td><td class="ex">Mikor?</td><td>when</td></tr>
<tr><td class="ex">Miért?</td><td>why</td><td class="ex">Hogy? / Hogyan?</td><td>how</td></tr>
<tr><td class="ex">Mennyi? / Mennyibe kerül?</td><td>how much / how much is it</td><td class="ex">Hány?</td><td>how many (+ singular)</td></tr>
<tr><td class="ex">Milyen?</td><td>what kind, what … like</td><td class="ex">Melyik?</td><td>which</td></tr></table>
<p>The question word goes <b>right before the verb</b>: <em>Hol laksz? Mikor indul a vonat?</em></p>
<h4>Yes/no questions</h4>
<p>Same words as the statement; only the melody changes. The voice rises on the second-to-last syllable and falls on the last: <em>Beszél angolul?</em> In indirect questions you add <b>-e</b>: <em>Nem tudom, beszél-e angolul.</em></p>`,
  notes: {
    ru: 'As in Russian, a yes/no question keeps the word order and uses melody. But the Hungarian melody is different: up on the second-to-last syllable, down on the last (an-go-LU-ul ↗↘). -e is like ли: beszél-e = говорит ли.',
    it: 'Come in italiano l’ordine resta uguale e cambia l’intonazione, ma la melodia sale sulla penultima sillaba e scende sull’ultima.',
    en: 'No “do”: Beszél angolul? = Do you speak English? (the polite Ön form). The voice goes up on the second-to-last syllable and down on the last.',
  },
  input: { q: 'What is being asked?', items: [
    'Hol laksz? ? Where do you live?*|Where are you going?|Where are you from? ~ hol = where (at).',
    'Honnan jössz? ? Where are you coming from?*|Where are you going? ~ honnan = from where.',
    'Hány éves vagy? ? How old are you?*|How many are you? ~ Literally “how many yeared are you”.',
    'Mennyibe kerül? ? How much does it cost?*|How many are there?',
    'Milyen a kávé? ? What is the coffee like?*|Which coffee? ~ milyen = what … like.',
  ] },
  items: [
    '{Hol} van a posta? — A sarkon. ~ hol = where (at).',
    '{Hová|Hova} mész? — Haza. ~ hová/hova = where to.',
    '{Honnan} jössz? — Olaszországból.',
    '{Mikor} indul a vonat? — Nyolckor.',
    '{Ki} az? — Ő a barátom.',
    '{Mi} ez? — Ez egy könyv.',
    '{Hány} gyereked van? — Kettő. ~ hány + singular: how many.',
    '{Mennyibe} kerül a jegy? — Ezer forint.',
    '{Miért} tanulsz magyarul? — Mert szeretem a nyelveket.',
    '{Milyen} az idő? — Szép. ~ milyen = what … like.',
    '[Melyik*|Milyen] busz megy a központba? — A hetes. ~ melyik = which one.',
  ],
},
{
  id: 'jelen', level: 'A1', title: 'Jelen idő', en: 'The present tense',
  summary: 'olvasok, olvasol, olvas…; the -ik verbs; and the polite Ön.',
  explain: `
<table><tr><th></th><th>back: olvas</th><th>front: kér</th><th>rounded: főz</th></tr>
<tr><td>én</td><td class="ex">olvasok</td><td class="ex">kérek</td><td class="ex">főzök</td></tr>
<tr><td>te</td><td class="ex">olvasol</td><td class="ex">kérsz</td><td class="ex">főzöl</td></tr>
<tr><td>ő / Ön</td><td class="ex">olvas</td><td class="ex">kér</td><td class="ex">főz</td></tr>
<tr><td>mi</td><td class="ex">olvasunk</td><td class="ex">kérünk</td><td class="ex">főzünk</td></tr>
<tr><td>ti</td><td class="ex">olvastok</td><td class="ex">kértek</td><td class="ex">főztök</td></tr>
<tr><td>ők / Önök</td><td class="ex">olvasnak</td><td class="ex">kérnek</td><td class="ex">főznek</td></tr></table>
<ul><li><b>te</b>: -sz, but <b>-ol / -el / -öl</b> after s, sz, z: <em>olvasol, főzöl, keresel</em>.</li>
<li>Verbs ending in <b>-ít</b> or two consonants add a linking vowel: <em>tanítasz, tanítotok, tanítanak · mondasz, mondotok, mondanak</em>.</li>
<li><b>-ik verbs</b> (lakik, dolgozik) end in -ik in the 3rd person and take <b>-om/-em/-öm</b> for én: <em>lakom, dolgozom</em>.</li>
<li>The dictionary form is the 3rd person: <em>olvas</em> = reads.</li></ul>
<h4>Ön: the polite you</h4><p>Takes the 3rd person, like Italian Lei: <em>Ön beszél angolul?</em> = Do you speak English?</p>
<h4>Irregular: learn as chunks</h4><p><em>megy</em> (go): megyek, mész, megy… · <em>jön</em> (come): jövök, jössz, jön… · <em>eszik</em> (eat): eszem, eszel, eszik… · <em>iszik</em> (drink): iszom, iszol, iszik…</p>`,
  notes: {
    ru: 'The ending shows the person, so pronouns are usually dropped, as in Russian: Olvasok = Читаю. There is no aspect in the present; the -ik verbs are just a class, not reflexive.',
    it: 'Come in italiano il pronome si omette: Olvasok = Leggo. E Ön si usa come Lei, con la 3ª persona: Ön hol lakik? = Lei dove abita?',
    en: 'The ending says who does it, so “I”, “you” etc. are usually left out. Ön (polite you) takes the he/she form, like the old “Would sir like…?”.',
  },
  input: { q: 'Who is it about?', items: [
    'Beszélsz angolul? ? You (informal, one person)*|He|We ~ -sz = te.',
    'Beszél angolul? ? He/she, or polite you (Ön)*|Only I ~ Ön takes the 3rd person.',
    'Tanulunk. ? We are learning*|They are learning ~ -unk/-ünk = mi.',
    'Hol laknak? ? Where do they live?*|Where do you live? ~ -nak/-nek = ők.',
    'Olvasol? ? Are you reading?*|Are they reading? ~ -ol after s = te.',
  ] },
  items: [
    'Én magyarul {tanulok:tanul}.',
    'Te hol {laksz:lakik}?',
    'Ő angolul {beszél:beszél}.',
    'Mi minden nap {dolgozunk:dolgozik}.',
    'Ti mit {olvastok:olvas}?',
    'Ők Budapesten {élnek:él}.',
    'Te mit {olvasol:olvas}? ~ After s, sz, z: -ol/-el/-öl instead of -sz.',
    'Én itt {dolgozom|dolgozok:dolgozik}. ~ -ik verbs: -om/-em/-öm (-ok is also heard).',
    'Ti {tanítotok:tanít}? ~ -ít verbs add a linking vowel.',
    'Ön {beszél:beszél} angolul? ~ Ön = polite you, 3rd person form.',
    'Mi sokat {főzünk:főz}.',
    'Hova {mész:megy}? ~ megy: megyek, mész, megy.',
    '! Te mit [olvassz>olvasol]? ~ After s: -ol.',
  ],
  drill: { verbs: ['olvas', 'kér', 'főz', 'tanul', 'beszél', 'lakik', 'dolgozik', 'tanít', 'ír', 'néz', 'megy', 'jön', 'eszik', 'iszik', 'van'], tenses: ['pres'], def: false },
},
{
  id: 'targy', level: 'A1', title: 'Tárgyeset: -t', en: 'The object ending -t',
  summary: 'Kérek egy kávét. The object is marked, so word order is free.',
  explain: `
<p>The direct object takes <b>-t</b>: <em>Kérek egy kávét.</em> (I’d like a coffee) <em>Látok egy házat.</em> (I see a house)</p>
<table><tr><th>word ends in…</th><th>object</th></tr>
<tr><td>a vowel (a → á, e → é)</td><td class="ex">kávé → kávét · alma → almát · autó → autót</td></tr>
<tr><td>j, l, ly, n, ny, r, s, sz, z, zs: just -t</td><td class="ex">asztal → asztalt · sör → sört · pénz → pénzt</td></tr>
<tr><td>other consonants: -ot / -et / -öt</td><td class="ex">lap → lapot · kert → kertet · gyümölcs → gyümölcsöt</td></tr>
<tr><td>some words (learn them)</td><td class="ex">ház → házat · könyv → könyvet · víz → vizet · ló → lovat</td></tr></table>
<p>After the plural: <b>-at / -et</b>: <em>házakat, almákat, embereket</em>.</p>
<h4>Free word order</h4><p>Because -t shows the object, <em>Péter látja Annát</em> and <em>Annát látja Péter</em> both mean “Péter sees Anna”. The word right before the verb gets the emphasis.</p>
<h4>Object pronouns</h4><p><em>engem</em> (me), <em>téged</em> (you), <em>őt</em> (him/her), <em>minket</em> (us), <em>titeket</em> (you pl.), <em>őket</em> (them).</p>`,
  notes: {
    ru: 'Your винительный падеж, with one ending for everything: -t. Word order is free for the same reason as in Russian: Annát látja Péter = Анну видит Пётр.',
    it: 'L’oggetto ha una desinenza propria (-t): per questo l’ordine delle parole è libero. Annát látja Péter = Anna, la vede Péter.',
    en: 'English shows the object by word order; Hungarian marks it with -t, so word order can change for emphasis.',
  },
  input: { q: 'Who does what to whom?', items: [
    'Pétert látja Anna. ? Anna sees Péter*|Péter sees Anna ~ -t marks the object: Pétert.',
    'A kutyát nézi a macska. ? The cat is looking at the dog*|The dog is looking at the cat ~ kutyát has -t.',
    'Anna Évát hívja. ? Anna is calling Éva*|Éva is calling Anna',
    'Kérek egy kávét. ? I’d like a coffee*|A coffee is asking for me ~ kávét = the object.',
  ] },
  items: [
    'Kérek egy {kávét:kávé}. ~ After a vowel: -t.',
    'Iszol egy {sört:sör}? ~ After r: just -t.',
    'Veszek egy {almát:alma}. ~ a becomes á.',
    'Látok egy {házat:ház}. ~ ház → házat: learn it with the word.',
    'Olvasok egy {könyvet:könyv}.',
    'Keresek egy {szállodát:szálloda}.',
    'Kérek egy pohár {vizet:víz}. ~ víz → vizet: the vowel gets short.',
    'Veszek egy {kenyeret:kenyér}.',
    'Kérek egy {jegyet:jegy} Szegedre.',
    'Keresem {Pétert:Péter}. ~ Names take -t too.',
    'Látod a {gyerekeket:gyerekek}? ~ After the plural: -et.',
    '! Kérek egy [kávé>kávét]. ~ The object needs -t.',
    '! Látok egy [házot>házat]. ~ ház → házat.',
  ],
},
{
  id: 'hol', level: 'A1', title: 'Hol? -ban, -on, -nál', en: 'Where: in, on, at',
  summary: 'a házban, az asztalon, Budapesten, Péternél.',
  explain: `
<table><tr><th>Hol? (where)</th><th>ending</th><th>examples</th></tr>
<tr><td>in</td><td>-ban / -ben</td><td class="ex">a házban · a kertben · Londonban</td></tr>
<tr><td>on</td><td>-n / -on / -en / -ön</td><td class="ex">az asztalon · a hegyen · a földön · Budapesten</td></tr>
<tr><td>at, by; at someone’s place</td><td>-nál / -nél</td><td class="ex">az ablaknál · Péternél</td></tr></table>
<p>Before an ending, a final <b>a/e becomes long</b>: <em>iskola → iskolában, Pécs → Pécsen, este → estére</em>.</p>
<h4>Towns and countries</h4>
<p>Most Hungarian towns take <b>-n</b>: <em>Budapesten, Szegeden, Pécsen, Debrecenben</em> (a few, like Debrecen and Győr, take -ban/-ben). Foreign towns and countries take <b>-ban/-ben</b>: <em>Rómában, Olaszországban</em>. But Hungary itself: <em>Magyarországon</em>.</p>`,
  notes: {
    ru: '-ban = в (где?), -on = на (где?), -nál = у: Péternél = у Петра. Hungarian towns use the “on” ending: Budapesten, a bit like на почте vs в магазине, which you also just learn.',
    it: '-nál/-nél = da: Péternél = da Pietro. -ban = in, -on = su. Le città ungheresi usano -on: Budapesten = a Budapest.',
    en: '-nál/-nél also means “at someone’s place”: Péternél = at Péter’s. Hungarian towns usually take the “on” ending: Budapesten = in Budapest.',
  },
  input: { q: 'Where is it?', items: [
    'A kulcs az asztalon van. ? On the table*|In the table|By the table ~ -on = on.',
    'Anna a boltban van. ? In the shop*|By the shop ~ -ban = in.',
    'Péternél vagyok. ? At Péter’s place*|Inside Péter|On Péter ~ -nál = at someone’s.',
    'Budapesten lakom. ? In Budapest*|On top of Budapest ~ Hungarian towns: -n.',
  ] },
  items: [
    'A könyv a {táskában:táska} van. ~ a → á before an ending.',
    'A kávé az {asztalon:asztal} van.',
    'Anna {Budapesten:Budapest} lakik. ~ Hungarian towns: -n.',
    'A gyerekek az {iskolában:iskola} vannak.',
    'Péter {Londonban:London} dolgozik. ~ Foreign towns: -ban/-ben.',
    'Éva {Magyarországon:Magyarország} él. ~ Hungary is the exception: -on.',
    'A macska a {kertben:kert} alszik.',
    'A kép a {falon:fal} van.',
    'Az {ablaknál:ablak} ülök. ~ -nál = by, at.',
    'Ma este {Péternél:Péter} vacsorázunk. ~ At someone’s place: -nál/-nél.',
    '[Olaszországban*|Olaszországon] lakom. ~ Countries: -ban/-ben, except Magyarországon.',
    '! A kulcs a [táskaban>táskában] van. ~ A final a becomes á before an ending.',
  ],
},
{
  id: 'hova', level: 'A1', title: 'Hová? Honnan?', en: 'Into, onto, to — out of, off, from',
  summary: 'The 3 × 3 grid: -ba/-ban/-ból, -ra/-on/-ról, -hoz/-nál/-tól.',
  explain: `
<table><tr><th></th><th>Hová? (to)</th><th>Hol? (at)</th><th>Honnan? (from)</th></tr>
<tr><td>inside</td><td class="ex">a házba</td><td class="ex">a házban</td><td class="ex">a házból</td></tr>
<tr><td>surface</td><td class="ex">az asztalra</td><td class="ex">az asztalon</td><td class="ex">az asztalról</td></tr>
<tr><td>beside / a person</td><td class="ex">Péterhez</td><td class="ex">Péternél</td><td class="ex">Pétertől</td></tr></table>
<p>Endings: -ba/-be, -ban/-ben, -ból/-ből · -ra/-re, -n/-on/-en/-ön, -ról/-ről · -hoz/-hez/-höz, -nál/-nél, -tól/-től.</p>
<p>Hungarian towns follow the surface row: <em>Budapestre, Budapesten, Budapestről</em>. Foreign ones the inside row: <em>Bécsbe, Bécsben, Bécsből</em>.</p>
<p>-ról/-ről also means <b>about</b>: <em>Mit gondolsz a filmről?</em> (What do you think about the film?)</p>`,
  notes: {
    ru: 'The same logic as Russian prepositions: в дом / в доме / из дома = -ba / -ban / -ból; на стол / на столе / со стола = -ra / -on / -ról; к Петру / у Петра / от Петра = -hoz / -nál / -tól.',
    it: 'In italiano “a casa / in casa / da casa” si confondono; qui ogni direzione ha la sua desinenza. -hoz = da (andare da qualcuno), -tól = da (venire da qualcuno).',
    en: 'English: into / in / out of, onto / on / off, to / at / from. Each has its own ending.',
  },
  input: { q: 'Which direction?', items: [
    'Megyek a boltba. ? Into the shop (going there)*|In the shop|Out of the shop ~ -ba = into (Hová?).',
    'Jövök a boltból. ? Out of the shop*|Into the shop ~ -ból = out of.',
    'Péterhez megyek. ? I’m going to Péter’s*|I’m at Péter’s|I’m coming from Péter ~ -hoz = to (a person).',
    'Budapestről jön. ? He is coming from Budapest*|He is going to Budapest ~ -ról = from (towns in Hungary).',
    'Az asztalra teszem a könyvet. ? Onto the table*|Off the table ~ -ra = onto.',
  ] },
  items: [
    'Este {moziba:mozi} megyek. ~ Hová? into: -ba/-be.',
    'Most jövök a {munkából:munka}. ~ Out of: -ból/-ből; a becomes á.',
    'Holnap {Szegedre:Szeged} utazom. ~ Hungarian towns: -ra/-re.',
    'A kulcsot az {asztalra:asztal} teszem.',
    'A macska leugrik az {asztalról:asztal}.',
    'Megyek az {orvoshoz:orvos}. ~ To a person: -hoz/-hez/-höz.',
    'Most jövök az {orvostól:orvos}. ~ From a person: -tól/-től.',
    'Szombaton a {nagymamához:nagymama} megyünk.',
    'Hazajövök a {boltból:bolt}.',
    '[Bécsbe*|Bécsre] utazom. ~ Foreign towns: -ba/-be.',
    '[Budapestre*|Budapestbe] megyek. ~ Hungarian towns: -ra/-re.',
    '! Megyek a [boltban>boltba]. ~ Movement into: -ba (Hová?), not -ban (Hol?).',
  ],
},
{
  id: 'hatarozott', level: 'A1', title: 'Határozott ragozás', en: 'The definite conjugation',
  summary: 'látok egy házat but látom a házat: the verb shows whether the object is definite.',
  explain: `
<p>Every verb has <b>two sets of endings</b>. Use the <b>definite</b> set when the object is definite:</p>
<ul><li>a/az + noun: <em>látom a házat</em></li><li>names: <em>ismerem Pétert</em></li><li>ezt, azt (this, that): <em>ezt kérem</em></li>
<li>possessed nouns: <em>olvasom a könyvedet</em></li><li>őt, őket, Önt</li></ul>
<p>Use the <b>indefinite</b> set with no object, with egy, with plain nouns, and with <b>engem, téged, minket, titeket</b>: <em>látok egy házat · Péter engem lát</em>.</p>
<table><tr><th></th><th>olvas</th><th>kér</th><th>főz</th></tr>
<tr><td>én</td><td class="ex">olvasom</td><td class="ex">kérem</td><td class="ex">főzöm</td></tr>
<tr><td>te</td><td class="ex">olvasod</td><td class="ex">kéred</td><td class="ex">főzöd</td></tr>
<tr><td>ő</td><td class="ex">olvassa</td><td class="ex">kéri</td><td class="ex">főzi</td></tr>
<tr><td>mi</td><td class="ex">olvassuk</td><td class="ex">kérjük</td><td class="ex">főzzük</td></tr>
<tr><td>ti</td><td class="ex">olvassátok</td><td class="ex">kéritek</td><td class="ex">főzitek</td></tr>
<tr><td>ők</td><td class="ex">olvassák</td><td class="ex">kérik</td><td class="ex">főzik</td></tr></table>
<p>The <b>j</b> of -ja, -juk, -játok, -ják merges with s, sz, z: <em>olvas + ja → olvassa · néz + jük → nézzük</em>.</p>`,
  notes: {
    ru: 'Nothing like this in Russian: the verb itself says whether the object is a specific one. Think “читаю книгу” (olvasok egy könyvet) vs “читаю эту книгу” (olvasom a könyvet).',
    it: 'Pensa a “leggo un libro” (olvasok egy könyvet) e “lo leggo / leggo il libro” (olvasom a könyvet): il verbo “contiene” già il “lo”.',
    en: 'Think of “I read it” vs “I read something”: olvasom (the book, it) vs olvasok (a book, something).',
  },
  input: { q: 'Specific or not?', items: [
    'Látom a házat. ? I see the house (a specific one)*|I see a house ~ -om + a házat = definite.',
    'Látok egy házat. ? I see a house*|I see the house ~ -ok + egy = indefinite.',
    'Olvassa. ? He is reading it (something specific)*|He is reading (in general) ~ -ja = definite.',
    'Kérem a számlát. ? The bill (the specific one)*|A bill',
    'Nézed a filmet? ? Are you watching the film?*|Are you watching a film?',
  ] },
  items: [
    'Én {látom:lát} a házat. ~ a házat = a definite object.',
    'Én {látok:lát} egy házat. ~ egy = indefinite.',
    '{Kérem:kér} a számlát! ~ The bill: definite.',
    '{Kérek:kér} egy kávét. ~ A coffee: indefinite.',
    'Te {ismered:ismer} Pétert? ~ Names are definite.',
    'Ő {olvassa:olvas} az újságot. ~ olvas + ja → olvassa.',
    'Mi {nézzük:néz} a filmet. ~ néz + jük → nézzük.',
    'Ti {tudjátok:tud} a választ?',
    'Ők {szeretik:szeret} a zenét. ~ Front verbs: -ik.',
    'Ezt {kérem:kér}. ~ ezt and azt are definite.',
    '! [Látok>Látom] a buszt. ~ a buszt is definite.',
    '! Ő [olvasja>olvassa] a könyvet. ~ s + j → ss.',
  ],
  drill: { verbs: ['olvas', 'kér', 'lát', 'néz', 'szeret', 'tud', 'ismer', 'keres', 'ír', 'mond', 'vesz', 'eszik', 'iszik'], tenses: ['pres'], def: 'mix' },
},
{
  id: 'birtok', level: 'A1', title: 'Van egy kutyám', en: 'Having: van + possessive',
  summary: 'There is no verb “to have”: Van egy kutyám. Nincs autóm. Péternek van egy háza.',
  explain: `
<p>Hungarian has no everyday verb for “have”. You say <b>there is + my X</b>:</p>
<table><tr><td class="ex">Van egy kutyám.</td><td>I have a dog. (there is a dog-my)</td></tr>
<tr><td class="ex">Van autód?</td><td>Do you have a car?</td></tr>
<tr><td class="ex">Nincs pénzem.</td><td>I have no money.</td></tr>
<tr><td class="ex">Péternek van egy háza.</td><td>Péter has a house. (to-Péter there is his house)</td></tr></table>
<p>The endings: <b>-m</b> (my), <b>-d</b> (your), <b>-a/-e/-ja/-je</b> (his/her). After a consonant a linking vowel comes first: <em>kert → kertem, kerted, kertje</em>; after a vowel, a/e get long: <em>kutya → kutyám</em>.</p>
<p>To stress the owner: <em>Nekem van egy kutyám</em> (I have a dog), <em>Neked van autód?</em></p>`,
  notes: {
    ru: 'Exactly like Russian “у меня есть собака”: Van (есть) egy kutyám (моя собака). Nekem van = у меня есть. Nincs pénzem = у меня нет денег.',
    it: 'Non c’è “avere”: si dice “c’è un cane mio”. Van egy kutyám = Ho un cane.',
    en: 'No verb “have”: Van egy kutyám is literally “there is a dog of mine”.',
  },
  input: { q: 'What does it mean?', items: [
    'Van egy kutyám. ? I have a dog*|There is a dog here|My dog is here ~ van + -m (my) = I have.',
    'Nincs autója. ? He/she has no car*|There is no car here ~ nincs + -ja = he/she doesn’t have.',
    'Van testvéred? ? Do you have brothers or sisters?*|Is your brother here?',
    'Péternek van egy háza. ? Péter has a house*|Péter is in a house ~ -nak/-nek + van + -a = X has.',
  ] },
  items: [
    'Van egy {kutyám:kutya}. (my) ~ my: -m; a becomes á.',
    'Van {autód:autó}? (your)',
    'Annának van egy {macskája:macska}. (her)',
    'Nincs {pénzem:pénz}. (my)',
    '{Van} egy ötletem! ~ van = there is.',
    '{Nincs} időm. ~ nincs = there is no.',
    'Van {testvéred:testvér}? (your)',
    'Péternek van egy {háza:ház}. (his)',
    'Van {kertetek:kert}? (your, plural) ~ -tek after the linking vowel.',
    '! [Én van>Nekem van] egy kutyám. ~ Not “én van”: nekem van (to me there is).',
    '! Van egy [kutya>kutyám]. (I have a dog) ~ Add the possessive ending.',
  ],
},
{
  id: 'birtokos', level: 'A1', title: 'Birtokos személyjelek', en: 'Possessive endings',
  summary: 'házam, házad, háza, házunk, házatok, házuk; and when the j appears.',
  explain: `
<table><tr><th></th><th>ház</th><th>kert</th><th>alma</th></tr>
<tr><td>my</td><td class="ex">házam</td><td class="ex">kertem</td><td class="ex">almám</td></tr>
<tr><td>your</td><td class="ex">házad</td><td class="ex">kerted</td><td class="ex">almád</td></tr>
<tr><td>his/her</td><td class="ex">háza</td><td class="ex">kertje</td><td class="ex">almája</td></tr>
<tr><td>our</td><td class="ex">házunk</td><td class="ex">kertünk</td><td class="ex">almánk</td></tr>
<tr><td>your (pl.)</td><td class="ex">házatok</td><td class="ex">kertetek</td><td class="ex">almátok</td></tr>
<tr><td>their</td><td class="ex">házuk</td><td class="ex">kertjük</td><td class="ex">almájuk</td></tr></table>
<ul><li>After a vowel: always <b>-ja/-je</b> for his/her: <em>autója, cipője</em>.</li>
<li>After a consonant: with or without j. Learn it with the word: <em>háza, asztala</em> but <em>kertje, barátja</em>.</li>
<li>Stem changes as in the plural: <em>név → neve, ló → lova, víz → vize</em>.</li></ul>
<h4>Whose?</h4><p><em>Péter háza</em> = Péter’s house (the owner just goes first). To stress “my”: <em>az én házam</em>.</p>`,
  notes: {
    ru: 'Possession is an ending on the thing owned, not a separate word: házam = мой дом. Péter háza = дом Петра (literally “Péter his-house”).',
    it: 'Il possessivo è una desinenza: házam = la mia casa. Péter háza = la casa di Péter (lett. “Péter casa-sua”).',
    en: 'Possession is an ending on the thing owned: házam = my house. Péter háza = Péter’s house (literally “Péter his-house”).',
  },
  input: { q: 'Whose is it?', items: [
    'Hol van a kulcsod? ? Your key*|My key|His key ~ -d = your.',
    'A kertjük nagy. ? Their garden*|Our garden ~ -jük = their.',
    'Péter autója piros. ? Péter’s car*|Péter and a car ~ Owner + -ja.',
    'Ez a házunk. ? Our house*|Their house ~ -unk = our.',
  ] },
  items: [
    'Ez az én {házam:ház}.',
    'Hol van a {kulcsod:kulcs}? (your)',
    'Péter {autója:autó} piros. (his)',
    'Ez a mi {lakásunk:lakás}.',
    'A {barátom:barát} magyar. (my)',
    'Anna {kertje:kert} szép. (her)',
    'Az ő {nevük:név} Kovács. (their) ~ név → nev-: the vowel gets short.',
    'Mi a {neved:név}? (your)',
    'Az {anyám:anya} tanár. (my)',
    'Hol van a {táskád:táska}? (your)',
    '! Ez az én [ház>házam]. ~ The ending is needed even with “az én”.',
  ],
},
];
