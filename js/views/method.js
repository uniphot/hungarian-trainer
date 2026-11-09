// Módszer: the research and reasoning behind each feature, and its limits.
import { h, mount, card } from '../core/ui.js';

export const strand = null;

const P = [
  {
    title: 'Learn to read first: Hungarian spelling is regular',
    claim: 'Hungarian is written almost exactly as it is pronounced: each letter or digraph stands for one sound. Comparisons of beginning readers across European languages found that decoding is mastered far faster where spelling is regular than in languages like English or French (Seymour, Aro & Erskine, 2003).',
    app: 'Olvasás comes first in the daily plan: ten short units of letter–sound pairs, each drilled four ways (pick the spelling, tell minimal pairs apart, write what you hear, read aloud with speech recognition). After them you can say any word you see and write any word you hear.',
    refs: [['Seymour, Aro & Erskine (2003), British Journal of Psychology 94(2)', null], ['Hungarian described as a transparent orthography (Hungarian reading research)', 'https://ojs.ppke.hu/verbum/article/view/1106']],
  },
  {
    title: 'Use the languages you already know',
    claim: 'Learners of a third language transfer from the language they perceive as closest, property by property (Rothman’s Typological Primacy Model and its successors; Ringbom on perceived similarity). Transfer helps when the structures really match and hurts when they only seem to, so it pays to say explicitly which is which.',
    app: 'Every topic and reading unit has notes for the languages you know: Russian cases, zero copula and verbal prefixes; Italian double consonants, Lei/Ön and “mi piace”; English a/an for a/az. Russian learners are warned where transfer misleads (Én tanár → Tanár vagyok), and the checker catches exactly that. Vocabulary cards show Slavic and Italian loanwords (asztal ← стол, piac ← piazza).',
    refs: [['Rothman (2011), Second Language Research 27(1) — Typological Primacy Model', null], ['Ringbom (2007), Cross-linguistic Similarity in Foreign Language Learning', null], ['Review of L3 cross-linguistic influence', 'https://munin.uit.no/bitstream/10037/10725/2/article.pdf']],
  },
  {
    title: 'Build words from parts',
    claim: 'A Hungarian noun can take dozens of endings, stacked: ház-ak-ban (in the houses). Most endings come in two or three vowel versions chosen by vowel harmony, and some stems change (ló → lovak, víz → vizet). Learning every form as a separate word is impossible; recognising stem + ending, and producing the ending by rule, is the skill.',
    app: 'A word-form engine builds plurals, objects, all the case endings, possessives and present/past conjugation (indefinite and definite) from each word’s principal parts, as a good dictionary lists them. Its output for all 228 listed words was checked against Wiktionary’s inflection tables. The endings and conjugation trainers draw unlimited items from it, and tapping a word in a transcript takes it apart.',
    refs: [['Hungarian grammar: suffix templates and vowel harmony', 'https://en.wikipedia.org/wiki/Hungarian_grammar']],
  },
  {
    title: 'Spaced retrieval beats re-reading',
    claim: 'Of ten common study techniques reviewed by Dunlosky and colleagues (2013), only two earned a “high utility” rating: practice testing (retrieving from memory) and distributed practice (spacing sessions out).',
    app: 'Ismétlés is one FSRS-scheduled queue: vocabulary in context, grammar items you missed, verb and ending slips, dictation sentences (some in a real speaker’s voice) and corrections from your writing. A new word is shown once before it is asked for: you can’t recall what you never saw.',
    refs: [['Dunlosky et al. (2013), Psychological Science in the Public Interest', 'https://www.psychologicalscience.org/observer/which-study-strategies-make-the-grade-2'], ['FSRS algorithm (open-spaced-repetition)', 'https://github.com/open-spaced-repetition']],
  },
  {
    title: 'Interpret before you produce',
    claim: 'Learners tend to process meaning through vocabulary and ignore endings. VanPatten & Cadierno (1993) found that “structured input” activities, where you must attend to the form to understand who did what, improved both comprehension and production. In Hungarian the endings carry exactly that information: Pétert látja Anna means Anna sees Péter.',
    app: 'Every grammar topic has an Interpret step between the explanation and the practice: decide what a sentence means using only the ending (-t, -ban/-ba, the definite form).',
    refs: [['VanPatten & Cadierno (1993), Studies in Second Language Acquisition', 'https://faculty.weber.edu/tmathews/SLI/Readings/VanPatten%20&%20Cadierno%201993.pdf']],
  },
  {
    title: 'Mix confusable structures',
    claim: 'Blocked practice feels easier but is forgotten faster. Mixing problem types improves long-term retention because you have to choose which rule applies, which is exactly the problem in real use (Nakata & Suzuki, 2019; Pan et al., 2019).',
    app: 'Mixed practice and contrast drills interleave the endings that are easy to confuse (-ban/-ba/-ból, -on/-ra/-ról, -nál/-hoz/-tól) and the verb forms (indefinite, definite, past, -lak/-lek).',
    refs: [['Nakata & Suzuki (2019), The Modern Language Journal 103(3)', null], ['Pan et al. (2019), Journal of Educational Psychology 111(7)', null]],
  },
  {
    title: 'Balance the four strands',
    claim: 'Paul Nation argues a course should give roughly equal time to meaning-focused input, meaning-focused output, language-focused study and fluency development. Self-taught learners typically overdo the third.',
    app: 'Every activity is tagged with a strand and timed. The daily plan always contains all four, gives extra time to whichever is behind this week, and the beginner’s road keeps the A0 essentials in order.',
    refs: [['Nation (2007), “The four strands”, Innovation in Language Learning and Teaching', null]],
  },
  {
    title: 'Learn to listen, with real voices',
    claim: 'Vandergrift and Goh’s metacognitive sequence teaches the process of listening: predict, listen, verify, listen again, check, reflect. For real speech, same-language subtitles help you tune in to an unfamiliar way of speaking, while native-language subtitles get in the way (Mitterer & McQueen, 2009).',
    app: 'Graded dialogues go through the full listening cycle. Valódi magyar brings new episodes from Hungarian podcasts and channels for learners every few hours, plays them with Hungarian subtitles, slow-down and repeat, and works line by line where a show publishes a transcript.',
    refs: [['Vandergrift & Goh (2012), Teaching and Learning Second Language Listening', null], ['Mitterer & McQueen (2009), PLoS ONE 4(11)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2775720']],
  },
  {
    title: 'Output, feedback and fluency',
    claim: 'Producing language makes you notice what you can’t yet say (Swain); corrective feedback works, and prompts that push self-repair help (Lyster & Saito, 2010). Repeating a talk with less time each round (Nation’s 4/3/2) and shadowing build speed with what you already know.',
    app: 'The writing checker targets the typical mistakes of learners of Hungarian with hints first; the AI tutor (optional) gives a full review. Speaking has pronunciation units with minimal pairs, shadowing, 4/3/2, role-plays and a conversation partner.',
    refs: [['Lyster & Saito (2010), Studies in Second Language Acquisition 32', 'https://escholarship.mcgill.ca/downloads/6w924g64b'], ['de Jong & Perfetti (2011), Language Learning', 'https://www.lrdc.pitt.edu/perfettilab/pubpdfs/de%20Jong%20Language%20Learning.pdf']],
  },
];

export async function render(root) {
  mount(root,
    h('div', { class: 'page-head' }, h('h1', 'Why it works'), h('p', { class: 'lead' }, 'Each part of this trainer is built on a finding from second-language acquisition or cognitive psychology, or on what makes Hungarian different. Here is the claim, what the app does with it, and where to read more.')),
    P.map((p) => card(h('h3', p.title), h('p', null, p.claim), h('p', null, h('b', 'In the app: '), p.app),
      h('p', { class: 'small muted' }, p.refs.map(([t, url], i) => [i ? ' · ' : '', url ? h('a', { href: url, target: '_blank', rel: 'noopener' }, t) : t])))),
    card(h('h3', 'Honest limits'),
      h('ul', null,
        h('li', null, 'This is a first version. The explanations, example sentences and dialogues were written for this app and checked carefully, but not yet by a native-speaker teacher. If something sounds odd, it may be wrong.'),
        h('li', null, 'The engine knows about 130 nouns and 80 verbs by their principal parts; other words are formed by the regular rules, which irregular words break. The checker only flags what it is confident about, so it misses many mistakes.'),
        h('li', null, 'Speech recognition checks whether a machine understood you, a proxy for intelligibility, not a pronunciation score. The synthetic voice is clear but not natural speech.'),
        h('li', null, 'The real-listening shows are for learners, from beginner to upper-intermediate. Native-level material (news, podcasts, series) will be the next step.'),
        h('li', null, 'No app replaces talking to people. Use the role-plays and the AI partner to prepare, then find a tutor, a language exchange or Hungarian friends.'))));
}
