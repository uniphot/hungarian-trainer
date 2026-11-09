// Real listening sources. Ids match SHOWS in listen.py, which fetches the newest episodes.
export const TIERS = {
  learner: { es: 'Kezdőknek', en: 'Made for learners', note: 'Native speakers talking slowly and simply, on purpose.' },
  bridge: { es: 'Híd', en: 'Bridge', note: 'Natural speech from Hungarian teachers and vloggers: clear, but not simplified.' },
  native: { es: 'Anyanyelvi', en: 'Native', note: 'What you will hear in Hungary: full speed, no help.' },
};

// help: what the show gives you to lean on.
export const SHOWS = [
  { id: 'yt-dori', name: 'Hungarian With Dori', kind: 'video', tier: 'learner', level: 'A1–B1', accent: 'Hungary', help: 'Hungarian subtitles; each episode is labelled with its level', handle: 'HungarianwithDori', why: 'Short, slow stories about everyday life, made for beginners. The best place to start.' },
  { id: 'fluentbox', name: 'Fluentbox Hungarian Podcast', kind: 'audio', tier: 'learner', level: 'A1–A2', accent: 'Hungary', help: 'Slow; simple and normal versions of each story', why: 'Each story comes in a simple version first, then a normal one. Listen to both.' },
  { id: 'simplified', name: 'Simplified Hungarian', kind: 'audio', tier: 'learner', level: 'A2–B1', accent: 'Hungary', help: 'Slow and clear', why: 'Short episodes about Hungarian culture and history in simplified Hungarian.' },
  { id: 'fiction', name: 'Fluent Fiction – Hungarian', kind: 'audio', tier: 'learner', level: 'A2–B1', accent: 'Hungary', help: 'Line-by-line transcript; English retelling', why: 'A short story in Hungarian, then retold sentence by sentence with English. It publishes timed transcripts, so you can study it line by line here.' },
  { id: 'patrik', name: 'Hungarian with Patrik', kind: 'audio', tier: 'bridge', level: 'A2–B2', accent: 'Hungary', help: 'Natural but slow', why: 'A Hungarian teacher talking naturally and slowly about everyday life and his own stories.' },
  { id: 'rackapod', name: 'RackaPod', kind: 'audio', tier: 'bridge', level: 'B1–B2', accent: 'Hungary', help: 'Spontaneous speech', why: 'Unscripted talk on Hungarian culture and literature from a native speaker.' },
  { id: 'yt-sziszi', name: 'Hungarian with Sziszi', kind: 'video', tier: 'bridge', level: 'B1–B2', accent: 'Hungary', help: 'Colloquial; subtitles', handle: 'hungarianwithsziszi', why: 'Everyday, colloquial Hungarian, the way people actually talk to friends.' },
  { id: 'yt-easy', name: 'Easy Hungarian', kind: 'video', tier: 'bridge', level: 'A2–C1', accent: 'Budapest streets', help: 'Hungarian and English subtitles', handle: 'EasyHungarian', why: 'Street interviews in Budapest: many voices, real speed, with subtitles in both languages.' },
];

export const showById = (id) => SHOWS.find((s) => s.id === id);

// Long-form things to watch elsewhere. Streaming catalogues differ by country.
export const SCREEN = [
  { name: 'A film you know by heart, dubbed', where: 'Any streaming service', level: 'A2+', note: 'Hungary dubs most foreign films and series, often very well. Pick one you know almost by heart in another language, so your attention is free for the sounds.' },
  { name: 'Hungarian children’s cartoons', where: 'YouTube, streaming', level: 'A1+', note: 'Slow, clear speech and pictures that carry the meaning: Vuk, Mézga család, Pom Pom meséi. Children’s content is real comprehensible input.' },
  { name: 'One series, every day', where: 'Streaming', level: 'B1+', note: 'Once a series feels possible with Hungarian subtitles, stay with it: the same people and words keep coming back, which is how listening grows.' },
];

export const ELSEWHERE = [
  { name: 'HungarianPod101', url: 'https://www.youtube.com/@HungarianPod101', level: 'A1–B1', note: 'Short lessons and dialogues for beginners, explained in English.' },
  { name: 'Hungarian Daily', url: 'https://creators.spotify.com/pod/profile/hungarian-daily', level: 'A1–A2', note: 'Themed audio lessons with transcripts (no new episodes since 2025, but a large archive).' },
  { name: 'Language Reactor', url: 'https://www.languagereactor.com', level: 'Tool', note: 'A browser extension for YouTube and Netflix on a computer: tap a subtitle word to look it up.' },
];
