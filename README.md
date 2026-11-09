# Alaposan — Hungarian in depth

A self-contained website for learning Hungarian on your own, from zero. It is built around what second-language research says works (spaced retrieval, Nation’s four strands, processing instruction, interleaving, metacognitive listening, hint-first feedback) and around what makes Hungarian different: its regular spelling, vowel harmony and stacked endings. It also builds on the languages the learner already knows (Russian, English, Italian). The in-app **Why it works** page explains each choice with references.

It is a sibling of the Spanish trainer “A fondo” and shares its machinery.

## Run it

```bash
python3 serve.py
```

This opens `http://localhost:8780`. Use **Chrome, Edge or Safari**: speech recognition only works in those browsers, and only over `localhost`/https. No install or build step; the only dependency is Python 3.

For audio, the device needs a Hungarian voice. On Apple devices go to Settings → Accessibility → Spoken Content → Voices → Hungarian (Tünde); on Android, Google Text-to-speech → Hungarian.

### On your phone

The app is published on GitHub Pages by `.github/workflows/pages.yml` on every push to `main`, and every 3 hours to refresh `listen.json`. Open the Pages address and add it to the Home Screen. On iPhone, turn “Open as Web App” off if you want speech recognition, which iOS doesn’t give Home Screen web apps. Progress is stored per device and browser; use Beállítások → Your data → Export backup / Import backup to move it.

## What’s inside

| Module | What it does |
|---|---|
| **Ma** (today) | The beginner’s road (read → count → first 100 words → core grammar → an hour of real listening), and a daily plan balanced across the four strands. |
| **Olvasás** (sounds & letters) | An alphabet chart and 10 units of letter–sound pairs, with notes comparing each sound to Russian, Italian and English. Each unit drills them four ways: hear → pick the spelling, minimal pairs, hear → write, read aloud with speech recognition. |
| **Nyelvtan** (grammar) | 19 topics from A1 to B1, 221 hand-written items, each topic: explanation → interpret-first activities → practice, with notes for the learner’s languages. Two unlimited trainers driven by the engine: **endings** (cases, plural, possessive, with vowel harmony and stem changes) and **conjugation** (present and past, indefinite and definite). |
| **Számok** (numbers) | How numbers, ordinals, prices, dates and clock times are built, and unlimited generated drills in both directions. |
| **Hallás** (listening) | 10 dialogues and monologues through the metacognitive listening cycle, dictation, and *Valódi magyar*: new episodes from 8 learner podcasts and channels, with slow-down, repeat, Hungarian subtitles and, where the show publishes one (Fluent Fiction), a line-by-line transcript with dictation on the real voice. |
| **Beszéd** (speaking) | Pronunciation units (length, ö/ü, s/sz, gy/ty/ny, double consonants, r, question melody), shadowing, 4/3/2 fluency, 6 guided role-plays, and an optional AI conversation partner. |
| **Írás** (writing) | 7 tasks with live requirements, a built-in checker for the typical mistakes of learners of Hungarian (a/az, plural after numbers, van, -t, definite vs indefinite, vowel harmony, Budapesten, capitals), the browser’s Hungarian spell-check, optional AI feedback, journal, quick-writes and dictogloss. |
| **Ismétlés** (review) | One FSRS queue: 242 core words in context (each shown once before it is asked for, with Slavic and Italian loanwords marked), missed grammar items, verb and ending slips, dictation sentences. |

## The Hungarian engine

`js/core/hu.js` handles letters (digraphs like cs, gy, sz, dzs and their long forms), vowel harmony and vowel length. `js/core/morph.js` builds noun forms (plural, object, 14 cases, possessive) and verb forms (present and past, indefinite and definite, -lak/-lek, infinitive) from each word’s principal parts in `js/data/lexicon.js`, and falls back to the regular rules for other words. It also works backwards: tapping *házban* shows *ház* + -ban (“in”).

All forms the engine produces for the 228 listed words were compared with Wiktionary’s inflection tables and match. `npm test` runs 194 engine checks, the checker tests, content-integrity checks, FSRS and transcript tests.

## Optional online features

- **Real listening**: `listen.py` fetches a fixed list of podcast and YouTube feeds (served at `/api/listen`; on the published site the workflow writes `listen.json`). It keeps only titles and links: audio streams from each show’s host, video plays in YouTube’s embedded player, transcripts are read directly from the podcast host.
- **AI tutor**: paste your own Anthropic API key in Settings for writing feedback, a conversation partner, spoken-monologue feedback, “Ask why” on exercises and extra exercises. The key stays in the browser.

## Vowel length

A missing length mark (a for á, o for ő…) is accepted and shown as a length note, not counted as a mistake, unless Settings → Strict vowel length is on. ö and ü are different letters from o and u, so writing them as o/u is always a mistake. The reading units on vowel length always check it.

## Limits

This is a first version. The explanations, sentences and dialogues were written for the app and checked carefully, but not yet by a native-speaker teacher. The engine knows about 130 nouns and 80 verbs by their principal parts; the rules can get irregular words wrong.
