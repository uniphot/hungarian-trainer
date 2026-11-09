// Olvasás: learning to read and pronounce, from zero. Hungarian spelling is almost perfectly
// phonetic, so each unit teaches a few letter–sound pairs, then drills them three ways: hear →
// pick the spelling, see → say it, hear → write it.
// Each unit: sounds [letter, how it sounds, example], notes keyed by the languages the learner
// knows (ru, it, en), words [word, English], minimal pairs, and a short line to read.
export const UNITS = [
  {
    id: 'alap', es: 'Az első betűk', en: 'Letters that do what you expect', strict: false,
    sounds: [
      ['a', 'like the o in British “hot”: lips slightly rounded', 'ma'], ['e', 'open, like e in “bed”', 'te'], ['i', 'short i, as in Italian', 'itt'],
      ['o', 'short, pure o', 'ott'], ['u', 'short, pure u', 'tud'],
      ['b d f h k l m n p t v', 'as in English, but p, t, k without a puff of air', 'van'], ['r', 'rolled with the tip of the tongue', 'ma'],
    ],
    notes: {
      ru: 'Most letters are read just as you would read them in Latin script, and every letter is pronounced. One trap: Hungarian a is not your а, it is rounded, closer to о. Hungarian has no vowel reduction: unstressed o stays o (compare Russian молоко [məlako]).',
      it: 'Read the letters as in Italian: every letter is pronounced, p/t/k without aspiration, r is rolled. One trap: Hungarian a is not your a, it is rounded, close to the o in “porta”.',
      en: 'Every letter is pronounced and always the same way. p, t and k are said without the puff of air English gives them, and r is rolled. Hungarian a sounds close to the o in British “hot”.',
    },
    words: [['ma', 'today'], ['nap', 'day; sun'], ['van', 'is, there is'], ['nem', 'no, not'], ['hal', 'fish'], ['bor', 'wine'], ['tud', 'knows'], ['itt', 'here'], ['ott', 'there'], ['fal', 'wall'], ['nem tudom', 'I don’t know'], ['tenger', 'sea']],
    pairs: [['hal', 'hall'], ['ott', 'itt']],
    line: 'Ma itt van a hal, nem ott.',
  },
  {
    id: 'hosszu', es: 'Hosszú magánhangzók', en: 'Long vowels: á é í ó ú', strict: true,
    sounds: [
      ['á', 'long open a, as in Italian “casa” (not rounded!)', 'láb'], ['é', 'long closed e, as in Italian “perché”', 'kép'], ['í', 'long i', 'víz'],
      ['ó', 'long o', 'jó'], ['ú', 'long u', 'kút'],
    ],
    notes: {
      ru: 'The accent mark means length, not stress. Stress is always on the first syllable, whatever the marks say. And á is a different vowel from a: á is your а, a is close to о.',
      it: 'L’accento grafico indica la lunghezza, non l’accento tonico. é is your closed é and e is your open è, so “kép” sounds like the é in “perché”, held longer.',
      en: 'The marks show length, not stress: hold the vowel about twice as long. á is also a different sound from a (open, like the a in “father”), and é is closed, like the a in “late” without the glide.',
    },
    words: [['kép', 'picture'], ['jó', 'good'], ['víz', 'water'], ['láb', 'leg, foot'], ['kávé', 'coffee'], ['tér', 'square'], ['út', 'road'], ['hát', 'back; well…'], ['kór', 'illness'], ['él', 'lives'], ['még', 'still, yet'], ['fél', 'half']],
    pairs: [['hat', 'hát'], ['kor', 'kór'], ['meg', 'még'], ['el', 'él'], ['fel', 'fél'], ['kerek', 'kerék']],
    line: 'Hát még jó a kávé? Igen, jó.',
  },
  {
    id: 'ou', es: 'Ö, ő, ü, ű', en: 'The rounded front vowels', strict: true,
    sounds: [
      ['ö', 'say e, then round your lips (German ö)', 'öt'], ['ő', 'the same, held long', 'ő'],
      ['ü', 'say i, then round your lips (German ü, French u)', 'ül'], ['ű', 'the same, held long', 'tű'],
    ],
    notes: {
      ru: 'Russian has no such vowels. Say и and push your lips forward as for у without moving your tongue: that is ü. Do the same from е to get ö. They are not ё or ю: there is no й in them.',
      it: 'Italiano non li ha (ma il lombardo e il piemontese sì: “fiö”). Say i with your lips as for u: that is ü. From e, the same gives ö.',
      en: 'English has none of these. Keep your tongue where it is for “ee” and round your lips as for “oo”: that is ü. From the e of “bed”, the same move gives ö.',
    },
    words: [['öt', 'five'], ['ő', 'he, she'], ['ül', 'sits'], ['tűz', 'fire'], ['sör', 'beer'], ['bőr', 'leather; skin'], ['föld', 'earth'], ['fül', 'ear'], ['köd', 'fog'], ['ügy', 'matter, case'], ['tükör', 'mirror'], ['gyümölcs', 'fruit']],
    pairs: [['sor', 'sör'], ['kor', 'kör'], ['bor', 'bőr'], ['tó', 'tő'], ['öt', 'őt'], ['szúr', 'szűr']],
    line: 'Ő öt sört kér.',
  },
  {
    id: 'sz-s', es: 'S, sz, z, zs', en: 'The s trap', strict: false,
    sounds: [
      ['s', 'sh, as in “shop”', 'sör'], ['sz', 's, as in “see”', 'szó'], ['z', 'z, as in “zoo”', 'zene'], ['zs', 's in “measure”, French j', 'zseb'],
    ],
    notes: {
      ru: 'Map them straight onto Russian: s = ш, sz = с, z = з, zs = ж. So Budapest is “Будапешт”, and szép (beautiful) is “сэп”.',
      it: 's = sc in “scena”, sz = s in “sole”, z = s in “rosa”, zs = French j (“jour”). So Budapest is read “Budapescht”.',
      en: 'The biggest trap for English speakers: s is “sh”, and the English s sound is written sz. So Budapest is “Budapesht”, and szia (hi) is “see-ya”.',
    },
    words: [['szó', 'word'], ['só', 'salt'], ['szép', 'beautiful'], ['Budapest', 'Budapest'], ['zene', 'music'], ['zseb', 'pocket'], ['kés', 'knife'], ['kész', 'ready'], ['szia', 'hi, bye'], ['ház', 'house'], ['rizs', 'rice'], ['szoba', 'room']],
    pairs: [['só', 'szó'], ['kés', 'kész'], ['rés', 'rész'], ['sír', 'szír']],
    line: 'Szia! Kész a rizs? Igen, és szép a szoba.',
  },
  {
    id: 'c-cs', es: 'C, cs, dz, dzs', en: 'ts and ch', strict: false,
    sounds: [
      ['c', 'ts, as in “cats”', 'utca'], ['cs', 'ch, as in “church”', 'csak'], ['dz', 'ds, as in “kids”', 'edz'], ['dzs', 'j, as in “jam”', 'dzsem'],
    ],
    notes: {
      ru: 'c = ц, cs = ч, dz = дз, dzs = дж. Simple: cukor = цукор, csak = чак.',
      it: 'c = z in “pizza”, cs = c in “ciao”, dzs = g in “gelato”. Hungarian c is never k: cukor is “tsukor”.',
      en: 'c is always “ts” (never k or s): cukor (sugar) is “tsoo-kor”. cs is “ch”, dzs is “j”.',
    },
    words: [['cukor', 'sugar'], ['utca', 'street'], ['csak', 'only'], ['kocsi', 'car'], ['cica', 'kitty'], ['csésze', 'cup'], ['kulcs', 'key'], ['dzsem', 'jam'], ['csütörtök', 'Thursday'], ['nyolc', 'eight'], ['kilenc', 'nine'], ['cipő', 'shoe']],
    pairs: [['cél', 'csél'], ['öcs', 'öc']],
    line: 'Csak egy csésze teát kérek, cukor nélkül.',
  },
  {
    id: 'lagy', es: 'Gy, ty, ny, ly, j', en: 'The soft consonants', strict: false,
    sounds: [
      ['gy', 'soft d, as in “during” said quickly, Russian дь', 'egy'], ['ty', 'soft t, Russian ть', 'kutya'], ['ny', 'Italian gn, Spanish ñ, Russian нь', 'nyár'],
      ['j', 'y, as in “yes”', 'jó'], ['ly', 'exactly the same as j: an old spelling', 'hely'],
    ],
    notes: {
      ru: 'Your soft consonants: gy = дь, ty = ть, ny = нь, j = й, ly = й. magyar = мадьяр, kutya = кутя, nyelv = ньелв.',
      it: 'ny = gn in “gnocchi”. gy and ty are like the sounds in “ghianda” and “chiave”, but softer. ly is just j (= i in “ieri”).',
      en: 'gy is close to the d in “dew” (British), ty to the t in “tune”, ny to the ny in “canyon”. ly is pronounced exactly like j (the y in “yes”).',
    },
    words: [['egy', 'one'], ['magyar', 'Hungarian'], ['gyerek', 'child'], ['hegy', 'mountain'], ['kutya', 'dog'], ['tyúk', 'hen'], ['nyár', 'summer'], ['anya', 'mother'], ['nyelv', 'language'], ['hely', 'place'], ['folyó', 'river'], ['jó', 'good']],
    pairs: [['egy', 'ed'], ['nyár', 'nár'], ['kutya', 'kuta']],
    line: 'Egy magyar gyerek és egy kutya a hegyen.',
  },
  {
    id: 'dupla', es: 'Hosszú mássalhangzók', en: 'Long consonants', strict: true,
    sounds: [['tt, ll, ss…', 'a written double consonant is held longer, as in Italian “fatto”', 'itt'], ['ssz, ggy, nny…', 'a long digraph doubles only its first letter', 'asszony']],
    notes: {
      ru: 'Like the сс in касса or the нн in ванна, but much more common, and it changes the meaning: hal (fish), hall (hears).',
      it: 'Esattamente come le doppie italiane: hal/hall come “pala/palla”. You already do this.',
      en: 'Hold the consonant for a beat, like the k in “book case”. It changes the meaning: hal (fish), hall (hears).',
    },
    words: [['itt', 'here'], ['hall', 'hears'], ['toll', 'pen'], ['kell', 'must, need'], ['szebb', 'more beautiful'], ['meggy', 'sour cherry'], ['asszony', 'woman, wife'], ['vissza', 'back'], ['mellett', 'beside'], ['könnyű', 'easy; light'], ['otthon', 'at home'], ['összes', 'all']],
    pairs: [['hal', 'hall'], ['tol', 'toll'], ['kel', 'kell'], ['megy', 'meggy'], ['sok', 'sokk']],
    line: 'Itt kell maradni, otthon.',
  },
  {
    id: 'hangsuly', es: 'Hangsúly és ritmus', en: 'Stress and rhythm', strict: false,
    sounds: [['1st syllable', 'stress is always on the first syllable, nowhere else', 'Budapest'], ['full vowels', 'unstressed vowels keep their full sound', 'kávéház']],
    notes: {
      ru: 'Always the first syllable: BU-da-pest, MA-gyar-or-szág. And no reduction: every o stays o, every a stays a. A long vowel later in the word is long, not stressed (ká-VÉ ✗, KÁ-vé ✓).',
      it: 'Sempre sulla prima sillaba: BU-da-pest, non Buda-PEST. Le vocali lunghe non attirano l’accento: KÁ-vé, non ca-FFÈ.',
      en: 'Always the first syllable: BU-da-pest, MA-gyar-or-szág. Don’t reduce unstressed vowels to “uh” as English does. A long vowel later in the word is long, not stressed.',
    },
    words: [['Budapest', 'Budapest'], ['Magyarország', 'Hungary'], ['kávéház', 'café'], ['barát', 'friend'], ['egészségedre', 'cheers; bless you'], ['köszönöm', 'thank you'], ['viszontlátásra', 'goodbye'], ['szálloda', 'hotel'], ['étterem', 'restaurant'], ['pályaudvar', 'railway station'], ['Debrecen', 'Debrecen'], ['Balaton', 'Lake Balaton']],
    pairs: [],
    line: 'Köszönöm szépen, viszontlátásra!',
  },
  {
    id: 'harmonia', es: 'Magánhangzó-harmónia', en: 'Vowel harmony: hear the two families', strict: false,
    sounds: [
      ['back', 'a á o ó u ú: words with these take back endings: házban', 'ház'], ['front', 'e é i í ö ő ü ű: front endings: kertben', 'kert'],
      ['neutral', 'i í é go with either family; a word with only these is front: vízben', 'víz'],
    ],
    notes: {
      ru: 'A new idea for you: most endings come in two (or three) versions, and the word’s vowels choose: ház-ban but kert-ben. Listen to whole words and you’ll start to feel it.',
      it: 'Un’idea nuova: quasi ogni desinenza ha due (o tre) forme, e le vocali della parola scelgono: ház-ban, kert-ben.',
      en: 'A new idea: most endings come in two (or three) versions, and the vowels of the word choose: ház-ban (in the house), kert-ben (in the garden).',
    },
    words: [['házban', 'in the house'], ['kertben', 'in the garden'], ['vízben', 'in water'], ['autóban', 'in the car'], ['könyvben', 'in the book'], ['kávéban', 'in coffee'], ['Budapesten', 'in Budapest'], ['Szegeden', 'in Szeged'], ['hegyen', 'on the mountain'], ['asztalon', 'on the table'], ['földön', 'on the ground'], ['papírban', 'in paper']],
    pairs: [['házban', 'házben'], ['kertben', 'kertban']],
    line: 'A kávé a konyhában van, a könyv a kertben.',
  },
  {
    id: 'feliratok', es: 'Feliratok', en: 'Reading signs', strict: false,
    sounds: [['signs', 'what you will read on doors, in shops and at stations', 'Kijárat']],
    notes: {
      ru: 'Many signs are built from a prefix and a verb: ki- (out) + járat → Kijárat (exit), be- (in) → Bejárat (entrance). Like вы-ход / в-ход.',
      it: 'Molti cartelli sono prefisso + parola: ki- (fuori) + járat → Kijárat (uscita), be- (dentro) → Bejárat (entrata).',
      en: 'Many signs are a prefix plus a word: ki- (out) + járat → Kijárat (exit), be- (in) → Bejárat (entrance).',
    },
    words: [['Kijárat', 'Exit'], ['Bejárat', 'Entrance'], ['Nyitva', 'Open'], ['Zárva', 'Closed'], ['Húzni', 'Pull'], ['Tolni', 'Push'], ['Pénztár', 'Cash desk'], ['Mosdó', 'Toilets'], ['Férfi', 'Men'], ['Női', 'Women'], ['Megálló', 'Stop (bus, tram)'], ['Vágány', 'Platform (track)'], ['Indulás', 'Departures'], ['Érkezés', 'Arrivals'], ['Akció', 'Special offer'], ['Tilos a dohányzás', 'No smoking']],
    pairs: [],
    line: 'Kijárat jobbra, a pénztár mellett.',
  },
];

// Spelling slips a listener could make, used to build wrong options: s ↔ sz, short ↔ long…
export const CONFUSIONS = [
  ['sz', 's'], ['s', 'sz'], ['zs', 'z'], ['cs', 'c'], ['c', 'cs'], ['gy', 'd'], ['ny', 'n'], ['ty', 't'], ['ly', 'j'], ['j', 'ly'],
  ['ö', 'o'], ['ü', 'u'], ['ő', 'ö'], ['ű', 'ü'], ['á', 'a'], ['a', 'á'], ['é', 'e'], ['e', 'é'], ['í', 'i'], ['ó', 'o'], ['ú', 'u'],
  ['tt', 't'], ['ll', 'l'], ['ss', 's'], ['gg', 'g'],
];
