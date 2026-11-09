// Speaking content: pronunciation units (perception → production), 4/3/2 fluency topics,
// and guided role-plays (respond to a cue in real time; checked by keywords).
// Pronunciation pairs are real minimal pairs; the reading course (data/reading.js) teaches
// the letters, these units train hearing and saying the hard contrasts.

export const PRON = [
  {
    id: 'hossz', title: 'Rövid és hosszú', en: 'Short and long vowels',
    explain: `<p>Length changes the meaning: <em>kor</em> (age) / <em>kór</em> (illness), <em>öt</em> (five) / <em>őt</em> (him). Hold a long vowel about <b>twice as long</b>, and don’t stress it: stress stays on the first syllable.</p><p><b>a/á</b> and <b>e/é</b> also differ in quality: a is rounded (British “hot”), á is open (Italian “casa”); e is open (“bed”), é is closed (Italian “perché”).</p>`,
    pairs: [['hat', 'hát'], ['kor', 'kór'], ['öt', 'őt'], ['meg', 'még'], ['el', 'él'], ['fel', 'fél'], ['kerek', 'kerék'], ['szel', 'szél']],
    words: ['kávé', 'kép', 'jó', 'víz', 'út', 'tűz', 'nő', 'Kálmán'],
    sentence: 'Még öt kávét kérek a kék asztalra.',
  },
  {
    id: 'ou', title: 'Ö és ü', en: 'The rounded front vowels',
    explain: `<p>Keep your tongue where it is for <b>i</b> and round your lips as for <b>u</b>: that is <b>ü</b>. Start from <b>e</b> and round: that is <b>ö</b>. The long ones (ű, ő) are the same sounds held longer.</p><p>They are not “yo” or “yu”: no y-sound comes first.</p>`,
    pairs: [['sor', 'sör'], ['kor', 'kör'], ['bor', 'bőr'], ['tó', 'tő'], ['szúr', 'szűr'], ['húz', 'hűz'], ['tor', 'tör']],
    words: ['öt', 'ül', 'sör', 'tükör', 'gyümölcs', 'fürdő', 'őszi', 'csütörtök'],
    sentence: 'Csütörtökön öt sört és gyümölcsöt kérünk.',
  },
  {
    id: 'sz-s', title: 'S és sz', en: 'sh and s',
    explain: `<p><b>s</b> is “sh”, <b>sz</b> is “s”. <b>zs</b> is the s in “measure”, <b>z</b> is z. Russian: s = ш, sz = с, zs = ж.</p><p>The trap for English speakers is writing s and saying s: <em>Budapest</em> is “Budapesht”.</p>`,
    pairs: [['só', 'szó'], ['kés', 'kész'], ['rés', 'rész'], ['sír', 'szír'], ['sál', 'szál'], ['mos', 'mosz']],
    words: ['szép', 'Budapest', 'szia', 'sör', 'zseb', 'egészség', 'szomszéd', 'kész'],
    sentence: 'Szia! Szép napot, és egészségedre!',
  },
  {
    id: 'lagy', title: 'Gy, ty, ny', en: 'The soft consonants',
    explain: `<p><b>gy</b>, <b>ty</b> and <b>ny</b> are single sounds made with the middle of the tongue against the palate: Russian дь, ть, нь; Italian gn for ny. Don’t say “d+y”: it is one quick sound.</p>`,
    pairs: [['egy', 'ed'], ['nyúl', 'núl'], ['hegy', 'hed'], ['kutya', 'kuta'], ['anya', 'ana']],
    words: ['egy', 'magyar', 'nyolc', 'kutya', 'gyerek', 'hány', 'tyúk', 'nyelv'],
    sentence: 'Egy magyar gyerek nyolc kutyát lát.',
  },
  {
    id: 'dupla', title: 'Hosszú mássalhangzók', en: 'Long consonants',
    explain: `<p>A written double consonant is held longer, exactly like Italian “palla” against “pala”: <em>hal</em> (fish) / <em>hall</em> (hears), <em>kel</em> (gets up) / <em>kell</em> (must). Russian has a few too: касса, ванна.</p>`,
    pairs: [['hal', 'hall'], ['tol', 'toll'], ['kel', 'kell'], ['megy', 'meggy'], ['sok', 'sokk'], ['vissza', 'visza']],
    words: ['itt', 'ott', 'kell', 'szebb', 'asszony', 'otthon', 'könnyű', 'mellett'],
    sentence: 'Itt kell várni, a kassza mellett.',
  },
  {
    id: 'r', title: 'Az r', en: 'The rolled r',
    explain: `<p>Hungarian r is a short <b>trill</b> with the tip of the tongue, as in Russian and Italian. At the end of a word it is still clearly pronounced: <em>bor, sör, kér</em>. English speakers: don’t swallow it.</p>`,
    pairs: [['bor', 'bol'], ['sor', 'sol'], ['kér', 'kél']],
    words: ['bor', 'kérek', 'reggel', 'barát', 'piros', 'három', 'körte', 'árvíztűrő'],
    sentence: 'Reggel három piros körtét kérek.',
  },
  {
    id: 'dallam', title: 'Kérdő dallam', en: 'Question melody',
    explain: `<p>Hungarian stresses the <b>first syllable</b> of every word, and a statement falls steadily. A yes/no question rises on the <b>second-to-last syllable</b> and falls on the last: <em>Beszél angolul?</em> (an-go-<b>lu</b>-ul ↗↘). With one-syllable words the rise and fall happen inside the word: <em>Kész?</em></p><p>A question with a question word (Hol? Mikor?) falls like a statement.</p>`,
    pairs: [],
    words: ['Beszél angolul?', 'Kéred?', 'Itt lakik?', 'Mennyibe kerül?', 'Megy busszal?'],
    sentence: 'Elnézést, ez a busz megy a Keletibe?',
  },
];

// 4/3/2 fluency topics: familiar content you can talk about at length.
export const FLUENCY_TOPICS = [
  { level: 'A1', topic: 'Bemutatkozás', prompt: 'Introduce yourself: name, age, where you are from, where you live, what you do.', chunks: ['… vagyok.', '… éves vagyok.', '…-ból/-ből jövök.', '…-ban/-ben lakom.', '… vagyok (job).', 'Szeretem a …-t.'] },
  { level: 'A1', topic: 'A családom', prompt: 'Describe your family.', chunks: ['Van egy …-m.', 'A neve …', '… éves.', '…-ban/-ben lakik.', 'Ő … (job).', 'Nincs …-m.'] },
  { level: 'A1', topic: 'Egy átlagos nap', prompt: 'Describe a normal day from morning to night.', chunks: ['Reggel …', '… órakor', 'Aztán …', 'Délután …', 'Este …', 'Utána …'] },
  { level: 'A1', topic: 'A városom', prompt: 'Describe the town or city where you live.', chunks: ['… -ban/-ben lakom.', 'Van egy …', 'Nincs …', 'Szeretem a …-t.', 'Nagyon szép a …'] },
  { level: 'A2', topic: 'A múlt hétvégém', prompt: 'Tell what you did last weekend.', chunks: ['Szombaton …', 'Vasárnap …', '… voltam.', '…-val/-vel …', 'Nagyon jó volt, mert …'] },
  { level: 'A2', topic: 'Kedvenc ételem', prompt: 'Talk about a dish you love: what it is, how it’s made, when you eat it.', chunks: ['A kedvenc ételem a …', 'Kell hozzá …', 'Először …', 'Aztán …', 'Általában …'] },
  { level: 'A2', topic: 'Miért tanulok magyarul?', prompt: 'Explain why you are learning Hungarian and how it is going.', chunks: ['Magyarul tanulok, mert …', 'Nehéz, de …', 'Szeretem a …', 'Szeretnék …', 'Tavaly …'] },
  { level: 'B1', topic: 'Egy utazás', prompt: 'Tell the story of a trip you remember well.', chunks: ['Néhány éve …', 'Amikor megérkeztünk, …', 'A legjobb az volt, hogy …', 'Sajnos …', 'Ha újra mehetnék, …'] },
];

// Guided role-plays. expect: groups of keywords (any one of each group), checked leniently.
export const ROLEPLAYS = [
  {
    id: 'kavezo', level: 'A1', title: 'A kávézóban', setting: 'You are in a café in Budapest.',
    them: 'Pincér', turns: [
      { them: 'Jó napot! Mit kér?', cue: 'Ask for a coffee with milk.', expect: [['kávé', 'kávét'], ['tej', 'tejjel']], model: 'Egy kávét kérek, tejjel.' },
      { them: 'Cukorral?', cue: 'Say no, without sugar.', expect: [['nem'], ['nélkül']], model: 'Nem, cukor nélkül, köszönöm.' },
      { them: 'Valami mást? Süteményt?', cue: 'Ask for a pogácsa too.', expect: [['pogácsa', 'pogácsát']], model: 'Igen, egy pogácsát is kérek.' },
      { them: 'Itt fogyasztja, vagy elviszi?', cue: 'Say you’ll have it here.', expect: [['itt']], model: 'Itt, köszönöm.' },
      { them: 'Összesen nyolcszázötven forint.', cue: 'Ask if you can pay by card.', expect: [['kártya', 'kártyával']], model: 'Fizethetek kártyával?' },
    ],
  },
  {
    id: 'piac', level: 'A1', title: 'A piacon', setting: 'You are buying fruit at a market stall.',
    them: 'Eladó', turns: [
      { them: 'Jó napot! Mit adhatok?', cue: 'Ask how much the apples cost.', expect: [['mennyi', 'mennyibe'], ['alma']], model: 'Mennyibe kerül az alma?' },
      { them: 'Négyszáz forint kilója.', cue: 'Ask for two kilos.', expect: [['két', 'kettő', '2'], ['kiló', 'kilót']], model: 'Két kilót kérek.' },
      { them: 'Még valamit?', cue: 'Ask if they have raspberries (málna).', expect: [['málna']], model: 'Van málna?' },
      { them: 'Sajnos ma nincs.', cue: 'Say that’s all, thank you.', expect: [['köszönöm', 'köszi'], ['ennyi', 'minden', 'semmi']], model: 'Akkor ennyi, köszönöm.' },
    ],
  },
  {
    id: 'jegy', level: 'A1', title: 'Jegyet veszek', setting: 'At the railway station ticket office.',
    them: 'Pénztáros', turns: [
      { them: 'Jó napot! Hová lesz?', cue: 'Ask for a ticket to Pécs.', expect: [['jegy', 'jegyet'], ['pécs', 'pécsre']], model: 'Egy jegyet kérek Pécsre.' },
      { them: 'Csak oda, vagy oda-vissza?', cue: 'Say return.', expect: [['vissza', 'oda-vissza']], model: 'Oda-vissza, kérem.' },
      { them: 'Tessék. Ötezer-kétszáz forint.', cue: 'Ask when the next train leaves.', expect: [['mikor', 'hánykor'], ['vonat', 'indul']], model: 'Mikor indul a következő vonat?' },
      { them: 'Tizenegy óra tízkor, a második vágányról.', cue: 'Thank them and say goodbye.', expect: [['köszönöm', 'köszi'], ['viszontlátásra', 'viszlát']], model: 'Köszönöm, viszontlátásra!' },
    ],
  },
  {
    id: 'ut', level: 'A1', title: 'Útbaigazítás', setting: 'You are lost near the Danube and ask a passer-by.',
    them: 'Járókelő', turns: [
      { them: 'Segíthetek?', cue: 'Ask where the metro is.', expect: [['hol'], ['metró']], model: 'Elnézést, hol van a metró?' },
      { them: 'Menjen egyenesen, aztán balra.', cue: 'Check: straight on, then left?', expect: [['egyenesen'], ['balra']], model: 'Egyenesen, aztán balra?' },
      { them: 'Igen, pontosan.', cue: 'Ask if it is far.', expect: [['messze']], model: 'Messze van?' },
      { them: 'Nem, öt perc gyalog.', cue: 'Thank them warmly.', expect: [['köszönöm', 'köszi']], model: 'Köszönöm szépen!' },
    ],
  },
  {
    id: 'szalloda', level: 'A2', title: 'A szállodában', setting: 'You arrive at a hotel in Eger.',
    them: 'Recepciós', turns: [
      { them: 'Jó estét! Miben segíthetek?', cue: 'Say you have a reservation in your name.', expect: [['foglalás', 'foglaltam', 'foglalásom'], ['nev', 'nevemre', 'nevén']], model: 'Jó estét! Van egy foglalásom a nevemre.' },
      { them: 'Egy pillanat… Igen, egy kétágyas szoba két éjszakára.', cue: 'Ask if breakfast is included.', expect: [['reggeli']], model: 'A reggeli benne van az árban?' },
      { them: 'Igen, hét és tíz között.', cue: 'Ask for the wifi password.', expect: [['wifi', 'jelszó', 'jelszava']], model: 'Mi a wifi jelszava?' },
      { them: 'Itt van a kártyán. A szoba a harmadik emeleten van.', cue: 'Ask where the lift is.', expect: [['lift']], model: 'Hol van a lift?' },
    ],
  },
  {
    id: 'orvos', level: 'A2', title: 'Az orvosnál', setting: 'You visit a doctor because you feel ill.',
    them: 'Orvos', turns: [
      { them: 'Jó napot! Mi a panasza?', cue: 'Say your head and throat hurt.', expect: [['fáj'], ['fej', 'fejem'], ['torok', 'torkom']], model: 'Fáj a fejem és a torkom.' },
      { them: 'Mióta?', cue: 'Say since yesterday.', expect: [['tegnap', 'tegnap óta']], model: 'Tegnap óta.' },
      { them: 'Van láza?', cue: 'Say yes, 38 degrees.', expect: [['igen', 'van'], ['harmincnyolc', '38']], model: 'Igen, harmincnyolc fokos.' },
      { them: 'Felírok egy gyógyszert. Naponta kétszer.', cue: 'Ask if you need to stay in bed.', expect: [['ágy', 'ágyban'], ['marad', 'maradni', 'maradnom']], model: 'Ágyban kell maradnom?' },
    ],
  },
];

// Scenarios for the free AI conversation partner.
export const AI_SCENARIOS = [
  { id: 'ismerkedes', level: 'A1', title: 'Getting to know someone', prompt: 'You are Eszter, a friendly 30-year-old from Budapest meeting the learner at a language exchange. Ask simple questions about their name, where they are from, their work and hobbies. Use very short, simple sentences.' },
  { id: 'kavezo-ai', level: 'A1', title: 'Ordering in a café', prompt: 'You are a friendly waiter in a Budapest café. Take the learner’s order, offer pastries (pogácsa, kakaós csiga, rétes), answer questions about prices, and bring the bill.' },
  { id: 'lakas-ai', level: 'A2', title: 'Renting a room', prompt: 'You are Tamás, renting out a room in your flat in the 7th district. The learner calls to ask about it; describe the room, the rent, the neighbourhood and the rules, and arrange a viewing.' },
  { id: 'hetvege-ai', level: 'A2', title: 'Weekend plans', prompt: 'You are the learner’s Hungarian friend Bence. Plan a weekend together: Balaton, a thermal bath, or a trip to Eger. Suggest, disagree a little, and agree on a plan.' },
  { id: 'mesterember', level: 'B1', title: 'Something is broken', prompt: 'You are a plumber the learner has called because the boiler in their flat is broken. Ask questions, explain the problem, and negotiate when you can come and the price.' },
];
