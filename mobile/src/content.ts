// Programme content. Lessons come from the website's programme page; daily practices follow
// the course feedback (1–3 minute micro-practices, single-tap check-ins);
// skills come from the intake form's "one small action" examples.

export type Lang = 'en' | 'zh';
export type Text = { en: string; zh: string };

export type SkillId = 'listen' | 'effort' | 'pause' | 'request' | 'repair' | 'together' | 'other';

export const SKILLS: { id: SkillId; label: Text }[] = [
  { id: 'listen', label: { en: 'Listen before advice', zh: '先聆聽，後建議' } },
  { id: 'effort', label: { en: 'Acknowledge effort', zh: '肯定努力' } },
  { id: 'pause', label: { en: 'Pause when stressed', zh: '有壓力時先停一停' } },
  { id: 'request', label: { en: 'Make a clear request', zh: '清楚提出要求' } },
  { id: 'repair', label: { en: 'Return to a disagreement calmly', zh: '冷靜地重提分歧' } },
  { id: 'together', label: { en: 'Positive time together', zh: '一起享受正面時光' } },
  { id: 'other', label: { en: 'Something else', zh: '其他' } },
];

export function skillLabel(id: SkillId, lang: Lang) {
  return SKILLS.find((s) => s.id === id)?.label[lang] ?? id;
}

// A micro-practice takes 1–3 minutes. `help` is the smaller first step shown after "Need help".
export type Practice = { id: string; minutes: 1 | 2 | 3; skill: SkillId; text: Text; how: Text; help: Text };

export const LESSONS: { title: Text; practices: Practice[] }[] = [
  {
    title: { en: 'Understanding Your Child’s Changing Needs', zh: '了解孩子不斷轉變的需要' },
    practices: [
      { id: 'l1a', minutes: 1, skill: 'pause', text: { en: 'Before you reply in a tense moment, take one breath.', zh: '緊張時刻回應之前，先吸一啖氣。' }, how: { en: 'One slow breath buys you a second to choose your words.', zh: '慢慢吸一啖氣，俾自己一秒時間揀用字。' }, help: { en: 'Hard to remember in the moment? Pick one time, like homework, and only pause then.', zh: '當刻好難記得？揀一個時段，例如做功課時，淨係嗰陣停一停。' } },
      { id: 'l1b', minutes: 1, skill: 'pause', text: { en: 'Guess what your child is feeling right now, and name it to yourself.', zh: '估吓孩子而家有咩感受，喺心入面講出嚟。' }, how: { en: 'Tired? Worried? Embarrassed? You don’t need to be right.', zh: '攰？擔心？尷尬？唔使估中。' }, help: { en: 'Start with their body: shoulders, face, voice. Those clues are enough.', zh: '由身體開始睇：膊頭、表情、聲線，咁就夠線索。' } },
      { id: 'l1c', minutes: 2, skill: 'together', text: { en: 'Ask one question about their day that isn’t about marks.', zh: '問一條唔關分數事嘅問題，關心佢今日。' }, how: { en: '“What was the best part of today?” works well.', zh: '「今日最開心係咩？」通常幾好用。' }, help: { en: 'If they shrug, share one small thing from your own day first.', zh: '如果佢聳聳膊，你可以先分享自己今日一件小事。' } },
      { id: 'l1d', minutes: 1, skill: 'pause', text: { en: 'Notice one thing about your child that’s changed this year.', zh: '留意孩子今年一樣改變咗嘅嘢。' }, how: { en: 'A new interest, friend, worry or habit. Just notice it.', zh: '新興趣、新朋友、新擔心或者新習慣，留意到就得。' }, help: { en: 'Think back to this time last year. What did they talk about then?', zh: '諗返去年呢個時候，佢成日講咩？' } },
    ],
  },
  {
    title: { en: 'Encouraging Positive Behaviour', zh: '鼓勵正面行為' },
    practices: [
      { id: 'l2a', minutes: 1, skill: 'effort', text: { en: 'Praise one specific thing your child tried today.', zh: '具體咁讚一樣孩子今日試過嘅嘢。' }, how: { en: '“You kept going on that question” sticks better than “good job”.', zh: '「你嗰條題目堅持做到尾」會比「好叻」更入心。' }, help: { en: 'Can’t spot an effort? Praise something small, like getting ready on time.', zh: '搵唔到努力？讚啲細嘢都得，例如準時出門。' } },
      { id: 'l2b', minutes: 1, skill: 'request', text: { en: 'Make one clear, calm request, then thank them when it’s done.', zh: '平靜咁提出一個清楚要求，做完之後多謝佢。' }, how: { en: 'Short and specific: “Bag in your room before dinner, please.”', zh: '簡短具體：「食飯前將書包放返入房，唔該。」' }, help: { en: 'Say it once, close by, at eye level, not from another room.', zh: '行近啲、望住佢講一次，唔好隔住間房嗌。' } },
      { id: 'l2c', minutes: 1, skill: 'effort', text: { en: 'Notice an effort, not a result, and tell them.', zh: '留意一個努力（唔係結果），話俾佢知。' }, how: { en: '“I saw you start your revision without being asked.”', zh: '「我見到你冇人提都自己開始溫書。」' }, help: { en: 'Look for starting, trying again, or asking for help. All count.', zh: '開始做、再試一次、開口求助，全部都算。' } },
      { id: 'l2d', minutes: 2, skill: 'together', text: { en: 'Spend two minutes on something they enjoy, their choice.', zh: '花兩分鐘陪佢做佢鍾意嘅嘢，由佢揀。' }, how: { en: 'A song, a video, a game. Follow their lead.', zh: '一首歌、一段片、一個遊戲。跟住佢嘅節奏。' }, help: { en: 'Just sit nearby while they do it and ask one question about it.', zh: '佢做緊嘅時候坐喺隔籬，問一條相關問題就得。' } },
    ],
  },
  {
    title: { en: 'Managing Stress and Strengthening Family Bonds', zh: '管理壓力，加強親子關係' },
    practices: [
      { id: 'l3a', minutes: 1, skill: 'pause', text: { en: 'When stress rises, take three slow breaths before you respond.', zh: '壓力上嚟時，回應之前慢慢吸三啖氣。' }, how: { en: 'In for four, out for six. Then decide what to say.', zh: '吸氣數四下，呼氣數六下，然後先決定講咩。' }, help: { en: 'Even one breath counts. Try it at a calm moment first.', zh: '一啖氣都算。可以先喺平靜時試吓。' } },
      { id: 'l3b', minutes: 2, skill: 'pause', text: { en: 'Rate your stress out of 10 before you walk in the door.', zh: '入門之前，為自己嘅壓力打分（10 分滿分）。' }, how: { en: 'Above 6? Take two minutes for yourself first.', zh: '超過 6 分？先俾自己兩分鐘。' }, help: { en: 'Two minutes can be a glass of water or a short walk around the block.', zh: '兩分鐘可以係飲杯水，或者喺樓下行一個圈。' } },
      { id: 'l3c', minutes: 2, skill: 'together', text: { en: 'Share one small good moment: a snack, a joke, a song.', zh: '一齊分享一個小小開心時刻：小食、笑話、一首歌。' }, how: { en: 'No lesson attached. Just enjoy it together.', zh: '唔使講道理，一齊享受就得。' }, help: { en: 'Pick something you already do, like dinner, and add one joke.', zh: '揀一樣本來就會做嘅事，例如食飯，加一個笑話。' } },
      { id: 'l3d', minutes: 1, skill: 'repair', text: { en: 'If you raised your voice today, say sorry for the tone.', zh: '如果今日大聲咗，為語氣講聲對唔住。' }, how: { en: '“Sorry I shouted. I was stressed, and it wasn’t your fault.”', zh: '「對唔住我頭先大聲咗。我壓力大，唔係你嘅錯。」' }, help: { en: 'A short note or message counts if saying it feels too hard.', zh: '如果當面講好難，寫張紙仔或者傳個訊息都算。' } },
    ],
  },
  {
    title: { en: 'Communicating with Empathy', zh: '以同理心溝通' },
    practices: [
      { id: 'l4a', minutes: 3, skill: 'listen', text: { en: 'Listen for three minutes without giving advice.', zh: '聽佢講三分鐘，唔俾意見。' }, how: { en: 'If you feel the urge to fix it, ask “And then what happened?”', zh: '忍唔住想幫佢解決？改問「跟住點呀？」' }, help: { en: 'Try it in the car or while walking. Side by side is easier than face to face.', zh: '試吓喺車上或者行路時傾，並排坐比面對面容易。' } },
      { id: 'l4b', minutes: 1, skill: 'listen', text: { en: 'Say back one thing you heard: “So you felt…”', zh: '將你聽到嘅講返一樣出嚟：「即係你覺得……」' }, how: { en: 'You don’t have to agree. Just show you heard it.', zh: '唔使同意，只要表示你聽到。' }, help: { en: 'Repeating their last few words is a good start.', zh: '重複佢最後幾隻字，已經係好開始。' } },
      { id: 'l4c', minutes: 2, skill: 'repair', text: { en: 'Go back to one disagreement calmly: “Can we try that again?”', zh: '冷靜咁重提一次分歧：「我哋可唔可以再傾過？」' }, how: { en: 'Wait until you’re both calm, then start with what you want to understand.', zh: '等大家都冷靜咗，先講你想明白嘅嘢。' }, help: { en: 'Pick a small disagreement first, not the biggest one.', zh: '先揀一個細啲嘅分歧，唔好揀最大嗰個。' } },
      { id: 'l4d', minutes: 1, skill: 'listen', text: { en: 'Ask: “Do you want help, or do you just want me to listen?”', zh: '問佢：「你想我幫手，定係淨係想我聽？」' }, how: { en: 'Then do what they choose.', zh: '然後跟佢揀嘅去做。' }, help: { en: 'If they say “just listen”, nod and say “That sounds hard.”', zh: '如果佢話「淨係聽」，點點頭講句「聽落好難受。」' } },
    ],
  },
];

// Today's practice: rotates through the lesson's practices day by day.
export function practiceFor(week: number, date = new Date()): Practice {
  const lesson = LESSONS[Math.min(LESSONS.length, Math.max(1, week)) - 1];
  const dayIndex = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 86400000);
  return lesson.practices[dayIndex % lesson.practices.length];
}

// Tap options for the weekly reflection, so nobody has to type.
export const HELPED_TAGS: { id: string; label: Text }[] = [
  { id: 'quick', label: { en: 'It was quick', zh: '好快做到' } },
  { id: 'child', label: { en: 'My child responded', zh: '孩子有反應' } },
  { id: 'calm', label: { en: 'I felt calmer', zh: '我冷靜咗' } },
  { id: 'routine', label: { en: 'It fit our routine', zh: '啱我哋嘅生活節奏' } },
];

export const OBSTACLE_TAGS: { id: string; label: Text }[] = [
  { id: 'time', label: { en: 'Not enough time', zh: '時間唔夠' } },
  { id: 'stress', label: { en: 'Feeling stressed', zh: '壓力大' } },
  { id: 'mood', label: { en: 'Child not in the mood', zh: '孩子冇心情' } },
  { id: 'forgot', label: { en: 'I forgot', zh: '唔記得咗' } },
  { id: 'none', label: { en: 'Nothing so far', zh: '暫時冇' } },
];

export const GOAL_STEPS: Text[] = [
  { en: 'Not started', zh: '未開始' },
  { en: 'A little closer', zh: '近咗少少' },
  { en: 'Halfway', zh: '一半' },
  { en: 'Nearly there', zh: '差唔多' },
  { en: 'I can do it now', zh: '而家做到' },
];
