// Principal parts of common words, as in a good dictionary. The engine (core/morph.js) builds
// every other form from these; words not listed here are handled by the regular rules.
//
// Nouns: 'nominative|plural|accusative|his/her ___ (3rd person possessive)|English'
//   The plural shows the stem changes: ház → házak (lowering), víz → vizek (shortening),
//   ló → lovak (v-stem), cukor → cukrok (vowel drop).
export const NOUNS = [
  // home
  'ház|házak|házat|háza|house', 'lakás|lakások|lakást|lakása|flat', 'szoba|szobák|szobát|szobája|room',
  'konyha|konyhák|konyhát|konyhája|kitchen', 'fürdőszoba|fürdőszobák|fürdőszobát|fürdőszobája|bathroom',
  'ablak|ablakok|ablakot|ablaka|window', 'asztal|asztalok|asztalt|asztala|table', 'szék|székek|széket|széke|chair',
  'ágy|ágyak|ágyat|ágya|bed', 'kert|kertek|kertet|kertje|garden', 'szekrény|szekrények|szekrényt|szekrénye|wardrobe',
  'kulcs|kulcsok|kulcsot|kulcsa|key', 'tükör|tükrök|tükröt|tükre|mirror',
  // town
  'utca|utcák|utcát|utcája|street', 'város|városok|várost|városa|town, city', 'ország|országok|országot|országa|country',
  'iskola|iskolák|iskolát|iskolája|school', 'egyetem|egyetemek|egyetemet|egyeteme|university', 'munka|munkák|munkát|munkája|work',
  'bolt|boltok|boltot|boltja|shop', 'piac|piacok|piacot|piaca|market', 'étterem|éttermek|éttermet|étterme|restaurant',
  'kávézó|kávézók|kávézót|kávézója|café', 'mozi|mozik|mozit|mozija|cinema', 'posta|posták|postát|postája|post office',
  'bank|bankok|bankot|bankja|bank', 'állomás|állomások|állomást|állomása|station', 'park|parkok|parkot|parkja|park',
  'múzeum|múzeumok|múzeumot|múzeuma|museum', 'templom|templomok|templomot|temploma|church', 'kórház|kórházak|kórházat|kórháza|hospital',
  'szálloda|szállodák|szállodát|szállodája|hotel', 'tér|terek|teret|tere|square', 'út|utak|utat|útja|road, way',
  'híd|hidak|hidat|hídja|bridge', 'gyógyszertár|gyógyszertárak|gyógyszertárat|gyógyszertára|pharmacy',
  // getting around
  'busz|buszok|buszt|busza|bus', 'villamos|villamosok|villamost|villamosa|tram', 'metró|metrók|metrót|metrója|metro',
  'vonat|vonatok|vonatot|vonata|train', 'autó|autók|autót|autója|car', 'taxi|taxik|taxit|taxija|taxi', 'jegy|jegyek|jegyet|jegye|ticket',
  'repülőtér|repülőterek|repülőteret|repülőtere|airport', 'térkép|térképek|térképet|térképe|map', 'bőrönd|bőröndök|bőröndöt|bőröndje|suitcase',
  // people
  'ember|emberek|embert|embere|person', 'férfi|férfiak|férfit|férfija|man', 'nő|nők|nőt|nője|woman', 'fiú|fiúk|fiút|fia|boy; son',
  'lány|lányok|lányt|lánya|girl; daughter', 'gyerek|gyerekek|gyereket|gyereke|child', 'barát|barátok|barátot|barátja|friend',
  'család|családok|családot|családja|family', 'anya|anyák|anyát|anyja|mother', 'apa|apák|apát|apja|father',
  'testvér|testvérek|testvért|testvére|sibling', 'férj|férjek|férjet|férje|husband', 'feleség|feleségek|feleséget|felesége|wife',
  'tanár|tanárok|tanárt|tanára|teacher', 'diák|diákok|diákot|diákja|student', 'orvos|orvosok|orvost|orvosa|doctor', 'név|nevek|nevet|neve|name',
  // time
  'nap|napok|napot|napja|day; sun', 'hét|hetek|hetet|hete|week', 'hónap|hónapok|hónapot|hónapja|month', 'év|évek|évet|éve|year',
  'óra|órák|órát|órája|hour; clock; lesson', 'perc|percek|percet|perce|minute', 'idő|idők|időt|ideje|time; weather',
  'reggel|reggelek|reggelt|reggele|morning', 'este|esték|estét|estéje|evening', 'éjszaka|éjszakák|éjszakát|éjszakája|night',
  'tél|telek|telet|tele|winter', 'nyár|nyarak|nyarat|nyara|summer', 'tavasz|tavaszok|tavaszt|tavasza|spring', 'ősz|őszök|őszt|ősze|autumn',
  // food and drink
  'víz|vizek|vizet|vize|water', 'kávé|kávék|kávét|kávéja|coffee', 'tea|teák|teát|teája|tea', 'sör|sörök|sört|söre|beer', 'bor|borok|bort|bora|wine',
  'tej|tejek|tejet|teje|milk', 'kenyér|kenyerek|kenyeret|kenyere|bread', 'alma|almák|almát|almája|apple', 'hús|húsok|húst|húsa|meat',
  'leves|levesek|levest|levese|soup', 'sajt|sajtok|sajtot|sajtja|cheese', 'tojás|tojások|tojást|tojása|egg', 'gyümölcs|gyümölcsök|gyümölcsöt|gyümölcse|fruit',
  'zöldség|zöldségek|zöldséget|zöldsége|vegetable', 'cukor|cukrok|cukrot|cukra|sugar', 'só|sók|sót|sója|salt', 'reggeli|reggelik|reggelit|reggelije|breakfast',
  'ebéd|ebédek|ebédet|ebédje|lunch', 'vacsora|vacsorák|vacsorát|vacsorája|dinner', 'pohár|poharak|poharat|pohara|glass',
  'tányér|tányérok|tányért|tányérja|plate', 'kanál|kanalak|kanalat|kanala|spoon', 'kés|kések|kést|kése|knife', 'villa|villák|villát|villája|fork',
  // things
  'pénz|pénzek|pénzt|pénze|money', 'forint|forintok|forintot|forintja|forint', 'kártya|kártyák|kártyát|kártyája|card', 'könyv|könyvek|könyvet|könyve|book',
  'újság|újságok|újságot|újságja|newspaper', 'levél|levelek|levelet|levele|letter; leaf', 'telefon|telefonok|telefont|telefonja|phone',
  'számítógép|számítógépek|számítógépet|számítógépe|computer', 'táska|táskák|táskát|táskája|bag', 'ruha|ruhák|ruhát|ruhája|dress; clothes',
  'cipő|cipők|cipőt|cipője|shoe', 'kabát|kabátok|kabátot|kabátja|coat', 'toll|tollak|tollat|tolla|pen', 'szótár|szótárak|szótárt|szótára|dictionary',
  'papír|papírok|papírt|papírja|paper', 'lecke|leckék|leckét|leckéje|lesson', 'feladat|feladatok|feladatot|feladata|task',
  'kép|képek|képet|képe|picture', 'film|filmek|filmet|filmje|film', 'zene|zenék|zenét|zenéje|music', 'gyógyszer|gyógyszerek|gyógyszert|gyógyszere|medicine',
  // nature
  'kutya|kutyák|kutyát|kutyája|dog', 'macska|macskák|macskát|macskája|cat', 'ló|lovak|lovat|lova|horse', 'madár|madarak|madarat|madara|bird',
  'hal|halak|halat|hala|fish', 'fa|fák|fát|fája|tree; wood', 'virág|virágok|virágot|virága|flower', 'tó|tavak|tavat|tava|lake',
  'folyó|folyók|folyót|folyója|river', 'hegy|hegyek|hegyet|hegye|mountain', 'tenger|tengerek|tengert|tengere|sea', 'eső|esők|esőt|esője|rain',
  'kő|kövek|követ|köve|stone', 'tűz|tüzek|tüzet|tüze|fire', 'föld|földek|földet|földje|earth, ground',
  // body
  'kéz|kezek|kezet|keze|hand', 'láb|lábak|lábat|lába|leg; foot', 'fej|fejek|fejet|feje|head', 'szem|szemek|szemet|szeme|eye',
  'fül|fülek|fület|füle|ear', 'száj|szájak|szájat|szája|mouth', 'fog|fogak|fogat|foga|tooth',
  // language
  'nyelv|nyelvek|nyelvet|nyelve|language; tongue', 'szó|szavak|szót|szava|word', 'mondat|mondatok|mondatot|mondata|sentence',
  'kérdés|kérdések|kérdést|kérdése|question', 'válasz|válaszok|választ|válasza|answer',
];

// The forms the rules can't see coming.
export const NOUN_OVERRIDES = {
  szó: { sup: 'szón' },
  fiú: { poss: ['fiam', 'fiad', 'fia', 'fiunk', 'fiatok', 'fiuk'] },
  férfi: { poss: ['férfim', 'férfid', 'férfija', 'férfink', 'férfitok', 'férfijuk'] },
};

// Verbs: 'dictionary form (he/she, present)|English|past (he/she)|past (I)|infinitive if irregular|flags'
// -ik verbs are recognised from their ending. Flag nolink: no linking vowel despite the double
// consonant (te állsz, not *állasz; compare hallasz). Flag intr: takes no object, so it has no
// definite forms.
export const VERBS = [
  'olvas|read|olvasott|olvastam', 'ír|write|írt|írtam', 'beszél|speak|beszélt|beszéltem', 'tanul|learn, study|tanult|tanultam',
  'tanít|teach|tanított|tanítottam', 'dolgozik|work|dolgozott|dolgoztam||intr', 'lakik|live (somewhere)|lakott|laktam||intr', 'él|live, be alive|élt|éltem||intr',
  'kér|ask for|kért|kértem', 'kérdez|ask (a question)|kérdezett|kérdeztem', 'válaszol|answer|válaszolt|válaszoltam||intr', 'tud|know; can|tudott|tudtam',
  'akar|want|akart|akartam', 'szeret|love, like|szeretett|szerettem', 'lát|see|látott|láttam', 'néz|look at, watch|nézett|néztem',
  'hall|hear|hallott|hallottam', 'ért|understand|értett|értettem', 'mond|say|mondott|mondtam', 'vár|wait|várt|vártam',
  'keres|look for|keresett|kerestem', 'talál|find|talált|találtam', 'vásárol|shop|vásárolt|vásároltam', 'fizet|pay|fizetett|fizettem',
  'főz|cook|főzött|főztem', 'mos|wash|mosott|mostam', 'takarít|clean|takarított|takarítottam', 'segít|help|segített|segítettem',
  'kezd|begin|kezdett|kezdtem', 'nyit|open|nyitott|nyitottam', 'zár|close, lock|zárt|zártam', 'ül|sit|ült|ültem||intr', 'áll|stand|állt|álltam||nolink,intr',
  'fut|run|futott|futottam||intr', 'sétál|walk|sétált|sétáltam||intr', 'utazik|travel|utazott|utaztam||intr', 'érkezik|arrive|érkezett|érkeztem||intr',
  'indul|set off|indult|indultam||intr', 'marad|stay|maradt|maradtam||intr', 'kap|get|kapott|kaptam', 'ad|give|adott|adtam', 'hoz|bring|hozott|hoztam',
  'hív|call|hívott|hívtam', 'telefonál|phone|telefonált|telefonáltam||intr', 'játszik|play|játszott|játszottam', 'úszik|swim|úszott|úsztam||intr',
  'gondol|think|gondolt|gondoltam', 'kel|get up|kelt|keltem||intr', 'reggelizik|have breakfast|reggelizett|reggeliztem||intr', 'ebédel|have lunch|ebédelt|ebédeltem||intr',
  'vacsorázik|have dinner|vacsorázott|vacsoráztam||intr', 'csinál|do, make|csinált|csináltam', 'készít|prepare|készített|készítettem',
  'használ|use|használt|használtam', 'foglal|book, reserve|foglalt|foglaltam', 'rendel|order|rendelt|rendeltem', 'küld|send|küldött|küldtem',
  'ismer|know (someone)|ismert|ismertem', 'táncol|dance|táncolt|táncoltam||intr', 'énekel|sing|énekelt|énekeltem', 'örül|be glad|örült|örültem||intr',
  'nevet|laugh|nevetett|nevettem||intr', 'sír|cry|sírt|sírtam||intr', 'nyer|win|nyert|nyertem', 'fáj|hurt|fájt|fájtam||intr', 'kerül|cost|került|kerültem||intr',
  'tesz|put|tett|tettem|tenni', 'vesz|take; buy|vett|vettem|venni', 'visz|carry, take|vitt|vittem|vinni', 'hisz|believe|hitt|hittem|hinni',
  'lesz|become; will be|lett|lettem|lenni|intr', 'tetszik|please (be liked)|tetszett|tetszettem||intr',
];

// Verbs whose present tense must simply be learnt.
export const IRREGULAR = {
  van: { en: 'be', inf: 'lenni', past: ['volt', 'voltam'], ind: ['vagyok', 'vagy', 'van', 'vagyunk', 'vagytok', 'vannak'] },
  megy: { en: 'go', inf: 'menni', past: ['ment', 'mentem'], ind: ['megyek', 'mész', 'megy', 'megyünk', 'mentek', 'mennek'] },
  jön: { en: 'come', inf: 'jönni', past: ['jött', 'jöttem'], ind: ['jövök', 'jössz', 'jön', 'jövünk', 'jöttök', 'jönnek'] },
  eszik: { en: 'eat', inf: 'enni', past: ['evett', 'ettem'], ind: ['eszem', 'eszel', 'eszik', 'eszünk', 'esztek', 'esznek'], def: ['eszem', 'eszed', 'eszi', 'esszük', 'eszitek', 'eszik'] },
  iszik: { en: 'drink', inf: 'inni', past: ['ivott', 'ittam'], ind: ['iszom', 'iszol', 'iszik', 'iszunk', 'isztok', 'isznak'], def: ['iszom', 'iszod', 'issza', 'isszuk', 'isszátok', 'isszák'] },
  alszik: { en: 'sleep', inf: 'aludni', past: ['aludt', 'aludtam'], ind: ['alszom', 'alszol', 'alszik', 'alszunk', 'alszotok', 'alszanak'] },
  fekszik: { en: 'lie (down)', inf: 'feküdni', past: ['feküdt', 'feküdtem'], ind: ['fekszem', 'fekszel', 'fekszik', 'fekszünk', 'feküsztök', 'feküsznek'] },
};
