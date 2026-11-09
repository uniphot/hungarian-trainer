// Writing tasks. Requirements are checked live by core/analyzer.js:
//   { t: 'any', words: ['szia', 'kedves'], label: '…' }   one of these words or phrases
//   { t: 'past', min: 3 }                                   past-tense verbs
//   { t: 'cases', min: 3 }                                  different case endings
//   { t: 'connectors', min: 2 }                             linking words from CONNECTORS
export const TASKS = [
  { id: 'bemutatkozas', level: 'A1', genre: 'Email', title: 'Bemutatkozás', min: 30, max: 80,
    prompt: 'Write to a new Hungarian language partner: your name, age, where you are from, where you live, what you do and what you like.',
    reqs: [{ t: 'any', words: ['szia', 'sziasztok', 'kedves', 'helló'], label: 'A greeting (Szia / Kedves …!)' }, { t: 'any', words: ['vagyok'], label: 'Say who you are (… vagyok)' },
      { t: 'any', words: ['lakom', 'élek'], label: 'Where you live (… lakom)' }, { t: 'any', words: ['szeretem', 'szeretek'], label: 'What you like (Szeretem a …-t)' }] },
  { id: 'csalad', level: 'A1', genre: 'Description', title: 'A családom', min: 40, max: 100,
    prompt: 'Describe your family: who they are, how old they are, where they live and what they do.',
    reqs: [{ t: 'any', words: ['van egy', 'vannak', 'van két', 'van három'], label: 'Say what you have (Van egy …-m)' }, { t: 'any', words: ['éves'], label: 'Someone’s age (… éves)' },
      { t: 'cases', min: 2, label: 'At least 2 different case endings (-ban, -on, -val …)' }] },
  { id: 'napom', level: 'A1', genre: 'Description', title: 'Egy napom', min: 40, max: 100,
    prompt: 'Describe a normal weekday from morning to evening.',
    reqs: [{ t: 'any', words: ['reggel', 'délelőtt'], label: 'The morning (reggel …)' }, { t: 'any', words: ['este', 'éjszaka'], label: 'The evening (este …)' },
      { t: 'any', words: ['aztán', 'utána', 'később', 'majd'], label: 'Sequence words (aztán, utána …)' }] },
  { id: 'hetvege', level: 'A2', genre: 'Story', title: 'A hétvégém', min: 60, max: 130,
    prompt: 'Tell a friend what you did last weekend, where you went and who you were with.',
    reqs: [{ t: 'past', min: 4, label: 'At least 4 verbs in the past tense' }, { t: 'any', words: ['szombaton', 'vasárnap', 'pénteken'], label: 'Days (szombaton, vasárnap …)' },
      { t: 'connectors', min: 2, label: 'At least 2 linking words (mert, de, aztán …)' }] },
  { id: 'lakas', level: 'A2', genre: 'Description', title: 'Az otthonom', min: 60, max: 130,
    prompt: 'Describe your home: the rooms, what is where, and what you like or would change.',
    reqs: [{ t: 'cases', min: 3, label: 'At least 3 different case endings (-ban, -on, -nál …)' }, { t: 'any', words: ['mellett', 'előtt', 'alatt', 'felett', 'mögött', 'között'], label: 'A postposition (mellett, előtt …)' },
      { t: 'any', words: ['szeretnék', 'szeretném', 'jó lenne'], label: 'A wish (szeretnék …, jó lenne …)' }] },
  { id: 'uzenet', level: 'A2', genre: 'Message', title: 'Nem tudok menni', min: 40, max: 100,
    prompt: 'Write a message to a friend: you can’t come to their party on Saturday. Apologise, explain why, and suggest another time.',
    reqs: [{ t: 'any', words: ['sajnos', 'bocsánat', 'ne haragudj', 'sajnálom'], label: 'An apology (Sajnos …, Ne haragudj!)' }, { t: 'any', words: ['mert'], label: 'A reason (… mert …)' },
      { t: 'any', words: ['jövő', 'holnap', 'vasárnap', 'jövő héten'], label: 'Another time (jövő héten …)' }] },
  { id: 'utazas', level: 'B1', genre: 'Story', title: 'Egy emlékezetes utazás', min: 100, max: 200,
    prompt: 'Tell the story of a trip you remember: where, with whom, what happened, and why you remember it.',
    reqs: [{ t: 'past', min: 6, label: 'At least 6 past-tense verbs' }, { t: 'connectors', min: 3, label: 'At least 3 linking words' },
      { t: 'any', words: ['amikor', 'miután', 'mielőtt'], label: 'A time clause (amikor, miután …)' }] },
];

export const JOURNAL_PROMPTS = [
  'Mit csináltál ma?', 'Mit eszel ma?', 'Milyen az idő ma?', 'Mit csinálsz a hétvégén?', 'Ki a legjobb barátod? Milyen?',
  'Mi a kedvenc ételed?', 'Hol vagy most? Mit látsz?', 'Mit tanultál ma?', 'Mit szeretnél csinálni nyáron?', 'Milyen volt a napod?',
];

export const QUICKWRITE_TOPICS = ['A szobám', 'A legjobb barátom', 'Kedvenc ételem', 'A városom', 'Egy átlagos reggel', 'A munkám vagy a tanulmányaim',
  'Tegnap', 'A nyár', 'Állatok', 'Zene', 'A terveim', 'Egy kép a telefonomon'];

// Linking words by level (used in analysis and requirements).
export const CONNECTORS = {
  A1: ['és', 'de', 'vagy', 'is', 'mert', 'aztán'],
  A2: ['utána', 'ezért', 'amikor', 'akkor', 'először', 'végül', 'például', 'pedig', 'viszont', 'majd'],
  B1: ['azonban', 'mégis', 'tehát', 'hiszen', 'ugyanis', 'miután', 'mielőtt', 'egyrészt', 'másrészt', 'ráadásul', 'szerintem', 'habár'],
  B2: ['ennek ellenére', 'következésképpen', 'mindazonáltal', 'ugyanakkor', 'összességében', 'amennyiben'],
};

// Overused words → alternatives.
export const SYNONYMS = {
  nagyon: ['igazán', 'rendkívül', 'eléggé'], jó: ['kiváló', 'remek', 'nagyszerű', 'kellemes'], szép: ['gyönyörű', 'csodás', 'festői'],
  rossz: ['kellemetlen', 'szörnyű', 'gyenge'], nagy: ['hatalmas', 'óriási', 'tágas'], kicsi: ['apró', 'parányi', 'szűk'],
  csinál: ['készít', 'végez', 'elkészít'], mond: ['közöl', 'elmesél', 'megjegyez'], érdekes: ['izgalmas', 'különleges', 'figyelemre méltó'],
  sok: ['rengeteg', 'számos', 'temérdek'], aztán: ['utána', 'majd', 'később'], de: ['viszont', 'azonban', 'mégis'],
};
