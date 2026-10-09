// Kiu 橋仔, the bridge-keeper. Same voice and content as the website bot (chat.js), plus app actions.
// Scripted, runs on the device; every fact comes from the programme content.
import type { Lang, SkillId, Text } from './content';

export type KiuAction = { label: Text; route: string; params?: Record<string, string> };
export type KiuMessage = { id: string; who: 'kiu' | 'me'; text: string; actions?: KiuAction[] };
export type KiuContext = { mode: 'post' | 'plank' | 'scene' | null; plank: number; scene: number | null; lastScene: number | null };
export type KiuEffect = { type: 'log'; skill: SkillId } | { type: 'lang'; lang: Lang };
export type KiuState = { lang: Lang; name: string; week: number; planksLaid: number; reflectionDone: boolean; checkinOpen: boolean };

type Plank = { skill: SkillId; title: Text; body: Text };
type Scene = { teaser: Text; setup: Text; A: Text; B: Text; C: Text };

const PLANKS: Plank[] = [
  { skill: 'pause', title: { en: 'Pause before you answer', zh: '答之前停一停' }, body: { en: 'In one tense moment this week, stop for a breath and ask yourself what your child might be feeling. You don’t have to fix anything yet. Just notice.', zh: '今個星期揀一個緊張時刻，先停一停、吸一啖氣，諗吓仔女當刻可能有咩感受。唔使即刻解決，留意到就夠。' } },
  { skill: 'effort', title: { en: 'Name one effort', zh: '讚一個努力' }, body: { en: 'Every day, praise one specific thing your child tried. “You kept going on that maths question” sticks better than “good job”.', zh: '每日具體咁讚一樣佢試過嘅嘢。「你嗰條數堅持做到尾」會比「好叻」更入心。' } },
  { skill: 'pause', title: { en: 'Keep one calm-down move ready', zh: '準備一招令自己冷靜' }, body: { en: 'Pick one thing that steadies you: a slow breath, a glass of water, a walk to the window. Use it once this week when stress rises, before you respond.', zh: '揀一樣幫到你定神嘅嘢：慢慢吸一啖氣、飲杯水、行去窗口望吓。今個星期壓力上嚟嗰陣，回應之前用一次。' } },
  { skill: 'listen', title: { en: 'Listen without fixing', zh: '淨係聽，唔使搞掂' }, body: { en: 'Have one conversation where you give no advice at all. Ask, nod, and say back what you heard. That’s the whole job.', zh: '今個星期試一次完全唔俾意見嘅傾偈。問、點頭、將你聽到嘅講返出嚟，咁就得。' } },
  { skill: 'listen', title: { en: 'When they say “nothing’s wrong”', zh: '當佢話「冇嘢呀」' }, body: { en: 'Give space and don’t push right then. Check in later, calmly, and tell them you’re there to listen.', zh: '俾啲空間，嗰下唔好追問。遲啲平靜咁再關心吓，話俾佢知你隨時願意聽。' } },
];

const SCENES: Scene[] = [
  {
    teaser: { en: 'the dictation went badly', zh: '默書默得唔好' },
    setup: { en: '🎭 6:40pm. Your 11-year-old drops their school bag by the door. “Dictation was terrible. Leave me alone.”\n\nWhat do you do?\nA) “How bad? Show me the paper.”\nB) “OK. I’m making tea. Come find me if you want to talk.”\nC) Say nothing and leave it for tonight.', zh: '🎭 晚上 6:40。11 歲嘅仔女一入門就掟低書包：「默書好差呀，唔好理我。」\n\n你會點做？\nA）「差到點？攞張卷俾我睇。」\nB）「好。我沖緊茶，想傾就嚟搵我。」\nC）乜都唔講，今晚由佢。' },
    A: { en: 'Totally understandable, you care how they did. Right now, though, they’re upset, and the paper can wait an hour. Asking how they feel first usually gets you the paper later anyway 📄', zh: '好明白，你緊張佢考成點。不過佢而家好唔開心，張卷遲一個鐘睇都得。先問佢感受，通常遲啲張卷都會自己攞出嚟 📄' },
    B: { en: 'Kiu’s pick 🌉 You’re giving space and leaving the door open. Later, a calm “want to tell me what happened?” often goes further than the paper ever would.', zh: '橋仔之選 🌉 你俾咗空間，又留咗道門。遲啲一句平靜嘅「想唔想講吓發生咩事？」，往往比張卷更有用。' },
    C: { en: 'Space is fine, and sometimes it’s exactly right. Just don’t let tonight turn into never. A quiet “I’m here if you want to talk” before bed keeps the bridge open.', zh: '俾空間冇問題，有時正正係啱嘅。只係唔好由今晚變成永遠唔提。瞓覺前輕輕講句「想傾隨時搵我」，條橋就仲開住。' },
  },
  {
    teaser: { en: '10:30pm and the phone is still on', zh: '十點半仲碌緊手機' },
    setup: { en: '🎭 10:30pm. The family rule is phones away at 10. Your 14-year-old is still scrolling in bed.\n\nWhat do you do?\nA) Take the phone mid-scroll.\nB) “It’s past 10. Five minutes to wrap up, then it charges in the kitchen. Anything good tonight?”\nC) Let it slide. They look happy for once.', zh: '🎭 晚上 10:30。屋企規矩係十點收手機，14 歲嘅仔女仲喺床上碌緊。\n\n你會點做？\nA）即刻收咗部手機。\nB）「過咗十點喇。俾你五分鐘收尾，之後放出廳度叉電。今晚有咩好睇？」\nC）算啦，難得佢咁開心。' },
    A: { en: 'The rule is right, but grabbing the phone usually starts a fight, and nobody remembers the rule after that. A short warning plus the reason keeps the limit without the shouting.', zh: '規矩冇錯，但一手搶走通常會變成嗌交，嗌完之後冇人記得規矩係乜。預早提一提再講埋原因，規矩守到又唔使嗌。' },
    B: { en: 'Kiu’s pick 🌉 A clear rule, a little time to finish, and a warm question at the end. That’s warmth and structure in one sentence.', zh: '橋仔之選 🌉 規矩清楚、俾少少時間收尾、最後仲有句關心。一句說話入面有齊溫暖同規範。' },
    C: { en: 'Kiu gets it, a happy teenager is precious 🥹 But a rule that only works some nights stops being a rule. Try keeping it tomorrow with a friendly five-minute warning.', zh: '橋仔明白，見到青少年開心真係難得 🥹 但如果規矩有時得有時唔得，佢就唔再係規矩。聽日試吓用友善嘅五分鐘提示守返佢。' },
  },
  {
    teaser: { en: 'Chinese homework tears at 9pm', zh: '九點仲喊住做中文功課' },
    setup: { en: '🎭 9pm. Your 8-year-old is crying over Chinese homework. You got home from work twenty minutes ago and you’re running on empty.\n\nWhat do you do?\nA) “Stop crying and just finish it.”\nB) Take one slow breath first, then sit beside them: “This one’s hard. Two lines, then a short break.”\nC) Write it for them so everyone can sleep.', zh: '🎭 晚上 9 點。8 歲嘅仔女做中文功課做到喊。你收工返到屋企先二十分鐘，已經冇晒電。\n\n你會點做？\nA）「唔好喊喇，快啲做埋佢。」\nB）先慢慢吸一啖氣，再坐落佢隔籬：「呢份係難啲。我哋做兩行，之後抖一陣。」\nC）幫佢寫埋，大家早啲瞓。' },
    A: { en: 'When you’re exhausted, that line comes out on its own. Kiu has heard it on many a bridge 😅 Next time, try your calm-down move first. It buys you a few seconds to choose what you say.', zh: '攰到極嗰陣，呢句好自然就衝口而出，橋仔喺好多條橋都聽過 😅 下次試吓先用你嗰招冷靜方法，爭取幾秒時間揀返想講嘅說話。' },
    B: { en: 'Kiu’s pick 🌉 You looked after yourself first, then made a big task small. That helps both of you tonight.', zh: '橋仔之選 🌉 你先照顧好自己，再將大任務拆細。今晚對你哋兩個都好。' },
    C: { en: 'Everyone gets to sleep, which is no small thing! But tomorrow they’ll face the same homework feeling the same way. Small pieces with breaks teach them they can get through it.', zh: '大家有得瞓，都唔係小事！但聽日佢面對同一份功課，感覺都會一樣。拆細做、中間抖吓，可以等佢學識自己捱得過。' },
  },
  {
    teaser: { en: '“You never listen!”', zh: '「你從來都唔聽我講！」' },
    setup: { en: '🎭 Dinner. You ask about the school trip and your 12-year-old snaps: “You never listen to me anyway!”\n\nWhat do you do?\nA) “Of course I listen! I do everything for you.”\nB) “OK. Tell me. I’ll just listen this time.”\nC) “Don’t talk to me in that tone.”', zh: '🎭 食飯時間。你問起學校旅行，12 歲嘅仔女突然爆：「你從來都唔聽我講嘢㗎啦！」\n\n你會點做？\nA）「我點會唔聽！我咩都為你做晒。」\nB）「好，你講。今次我淨係聽。」\nC）「唔准用呢個語氣同我講嘢。」' },
    A: { en: 'It stings, and defending yourself is natural. But then the talk becomes about who’s right. Saying “tell me” lets them make their point by actually being heard.', zh: '聽落好刺耳，想解釋係人之常情。但咁就變咗爭邊個啱。講句「你講」，等佢真係俾人聽到，佢自然唔使再證明。' },
    B: { en: 'Kiu’s pick 🌉 No arguing, no advice, just room to talk. The tone can wait until things are calm.', zh: '橋仔之選 🌉 唔爭拗、唔俾意見，淨係俾佢講。語氣嘅問題，等大家冷靜咗先再傾。' },
    C: { en: 'Tone matters and it’s fair to raise it, later. In the heat of it, they mostly hear “I’m not listening”, which was their point 🙈', zh: '語氣係重要，講出嚟都合理，不過遲啲先講。喺火頭上，佢多數只會聽到「我唔聽你講」，正正就係佢想講嘅嘢 🙈' },
  },
];

const L = {
  greet: { en: ['Good morning', 'Good afternoon', 'Good evening'], zh: ['早晨', '午安', '晚上好'] },
  postIntro: { en: 'Kiu here 🧡 You’ve laid {n} planks so far. Here’s what’s on the bridge this week.', zh: '橋仔嚟啦 🧡 你條橋已經有 {n} 塊木板。今個星期有呢啲：' },
  postIntro0: { en: 'Kiu here, your little bridge-keeper 🧡 I swept the planks and found three things for you this week.', zh: '我係守橋嘅橋仔 🧡 啱啱掃完橋板，執到三樣嘢想同你分享。' },
  crossings: { en: '✨ This week’s crossings ✨', zh: '✨ 今個星期過橋小任務 ✨' },
  item1: { en: '1️⃣ 🪵 This week’s plank: {x}\n   ↳ reply 1 to hear more', zh: '1️⃣ 🪵 今週木板：{x}\n   ↳ 回覆 1 了解多啲' },
  item2: { en: '2️⃣ 🎭 A Hong Kong moment: {x}\n   ↳ reply 2 to play it out', zh: '2️⃣ 🎭 香港家庭小場景：{x}\n   ↳ 回覆 2 一齊試吓' },
  item3reflect: { en: '3️⃣ ✍️ Your week {w} reflection is ready. Two minutes, three questions.\n   ↳ reply 3 to start', zh: '3️⃣ ✍️ 第 {w} 週反思準備好喇。兩分鐘、三條問題。\n   ↳ 回覆 3 開始' },
  item3checkin: { en: '3️⃣ 📋 Your check-in is open. A few minutes, and you’ll see what’s changed.\n   ↳ reply 3 to start', zh: '3️⃣ 📋 檢查問卷而家開放。幾分鐘，就睇到有咩改變。\n   ↳ 回覆 3 開始' },
  item3done: { en: '3️⃣ 📈 You’re up to date. Have a look at your progress.\n   ↳ reply 3 to see it', zh: '3️⃣ 📈 你全部完成晒。睇吓你嘅進度。\n   ↳ 回覆 3 去睇' },
  footer: { en: 'Reply plank for a home goal · scene to practise a moment · done when you’ve tried it · 中文 to switch language · help for more.', zh: '回覆「木板」攞家居小目標 · 「場景」練習一個時刻 · 試完回覆「完成」 · English 轉英文 · 「幫助」睇更多。' },
  plank: { en: '🪵 Plank #{n} for your bridge: {title}\n\n{body}\n\nTry it once. When you have, reply done (or tap Log it) and I’ll nail it to the bridge 🔨', zh: '🪵 第 {n} 塊木板：{title}\n\n{body}\n\n試一次。試完回覆「完成」（或者撳「記錄」），橋仔幫你釘落條橋度 🔨' },
  done1: { en: '🔨 Plank laid! Your first one is on the bridge.\n\nKiu did a small happy dance on the railing. Reply plank when you’re ready for the next one.', zh: '🔨 釘好！你第一塊木板已經喺橋上。\n\n橋仔喺欄杆上面跳咗隻開心舞。準備好就回覆「木板」攞下一塊。' },
  doneN: { en: '🔨 Plank laid! That’s {n} on your bridge so far.\n\nKiu did a small happy dance on the railing. Reply plank when you’re ready for the next one.', zh: '🔨 釘好！你條橋而家有 {n} 塊木板。\n\n橋仔喺欄杆上面跳咗隻開心舞。準備好就回覆「木板」攞下一塊。' },
  goReflect: { en: '✍️ Three short questions about your week. Kiu will hold your pen.', zh: '✍️ 三條關於你今個星期嘅簡短問題。橋仔幫你揸住支筆。' },
  goCheckin: { en: '📋 A few minutes of statements to agree or disagree with. No right or wrong answers.', zh: '📋 幾分鐘，揀同唔同意幾句陳述。冇對錯之分。' },
  goProgress: { en: '📈 Here’s how your bridge is looking.', zh: '📈 睇吓你條橋起成點。' },
  replyABC: { en: 'Reply A, B or C', zh: '回覆 A、B 或 C' },
  sceneAgain: { en: 'Want another one? Reply scene.', zh: '想再試一個？回覆「場景」。' },
  help: { en: 'Here’s what Kiu can do:\n• 1, 2 or 3: open an item from the Bridge Post\n• plank: a small home goal\n• scene: practise a real Hong Kong moment\n• done: tell me you tried your plank\n• post: show the Bridge Post again\n• 中文 / English: switch language', zh: '橋仔識做呢啲嘢：\n• 1、2 或 3：打開週報入面嘅項目\n• 木板：家居小目標\n• 場景：練習一個香港家庭時刻\n• 完成：話俾我知你試咗\n• 週報：再睇週報\n• English / 中文：轉語言' },
  thanks: { en: '🧡 Anytime. Kiu will be on the bridge.', zh: '🧡 唔使客氣，橋仔一直喺橋度。' },
  lang: { en: '👍 English it is.', zh: '👍 好，之後用中文同你傾。' },
  unknown: { en: 'Kiu is only a small bridge-keeper and didn’t catch that 🙈 Try 1, 2, 3, plank, scene or help.', zh: '橋仔只係個細細個嘅守橋仔，聽唔明呢句 🙈 試吓回覆 1、2、3、木板、場景或者幫助。' },
  human: { en: 'If it’s a question about your own family, your facilitator will do better than a bot. Bring it to your next session.', zh: '如果係關於你屋企嘅具體問題，導師會答得好過機械人。下一堂可以問吓。' },
  crisis: { en: '💛 That sounds really hard, and Kiu is only a little bot. Please reach a real person now:\n\n• Emergency: 999\n• 24-hour Mental Health Support Hotline: 18111\n• The Samaritan Befrienders Hong Kong: 2389 2222\n\nYou don’t have to sort this out alone.', zh: '💛 聽落好辛苦，而橋仔只係個細細嘅機械人。請即刻搵真人幫手：\n\n• 緊急情況：999\n• 24 小時精神健康支援熱線：18111\n• 香港撒瑪利亞防止自殺會：2389 2222\n\n你唔使一個人面對。' },
};

export const ACTION_LABELS = {
  log: { en: 'Log it', zh: '記錄' },
  reflect: { en: 'Start reflection', zh: '開始反思' },
  checkin: { en: 'Open check-ins', zh: '打開檢查' },
  progress: { en: 'See progress', zh: '睇進度' },
  call999: { en: 'Call 999', zh: '致電 999' },
  call18111: { en: 'Call 18111', zh: '致電 18111' },
  chips: {
    post: { en: ['1', '2', '3', 'help'], zh: ['1', '2', '3', '幫助'] },
    scene: { en: ['A', 'B', 'C'], zh: ['A', 'B', 'C'] },
    base: { en: ['plank', 'scene', 'post', '中文'], zh: ['木板', '場景', '週報', 'English'] },
  },
};

const KEYS: Record<string, string[]> = {
  post: ['post', 'bridge post', 'menu', '週報', '周報'],
  plank: ['plank', 'goal', 'home goal', '木板', '目標'],
  scene: ['scene', 'practice', 'practise', '場景'],
  done: ['done', 'did it', 'tried it', 'i did it', '完成', '做咗', '試咗'],
  help: ['help', '?', '幫助', '幫手', '選單'],
  hello: ['hi', 'hello', 'hey', 'hi kiu', 'start', '你好', '哈囉', '開始', '橋仔'],
  thanks: ['thanks', 'thank you', 'thx', 'ty', '多謝', '唔該', '謝謝'],
  zh: ['中文', '繁體', '廣東話', '粵語', 'cantonese', 'chinese'],
  en: ['english', 'eng', '英文'],
};
const CRISIS_RE = /suicid|kill (my|him|her|them)sel|end (my|his|her|their) life|want to die|self[- ]?harm|hurt(ing)? (my|him|her|them)sel|abus(e|ed|ing)|not safe|emergency|自殺|想死|輕生|自殘|傷害自己|虐待|唔安全|不安全|緊急/i;

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k]));
let seq = 0;
const msg = (text: string, actions?: KiuAction[]): KiuMessage => ({ id: `${Date.now()}-${seq++}`, who: 'kiu', text, actions });

export function initialContext(week: number): KiuContext {
  return { mode: 'post', plank: Math.min(PLANKS.length, week) - 1, scene: null, lastScene: null };
}

export function bridgePost(s: KiuState): KiuMessage {
  const lang = s.lang;
  const h = new Date().getHours();
  const greet = L.greet[lang][h < 12 ? 0 : h < 18 ? 1 : 2];
  const plank = PLANKS[Math.min(PLANKS.length, s.week) - 1];
  const scene = SCENES[(s.week - 1) % SCENES.length];
  const item3 = !s.reflectionDone ? fill(L.item3reflect[lang], { w: s.week }) : s.checkinOpen ? L.item3checkin[lang] : L.item3done[lang];
  const sep = lang === 'zh' ? '！' : '! ';
  const text = [
    '+-+ 🌉 KinBridge Bridge Post +-+',
    `${greet}${lang === 'zh' ? '，' : ', '}${s.name}${sep}${s.planksLaid ? fill(L.postIntro[lang], { n: s.planksLaid }) : L.postIntro0[lang]}`,
    '',
    L.crossings[lang],
    fill(L.item1[lang], { x: plank.title[lang] }),
    fill(L.item2[lang], { x: scene.teaser[lang] }),
    item3,
    '',
    L.footer[lang],
  ].join('\n');
  return msg(text);
}

function item3Action(s: KiuState): KiuAction {
  if (!s.reflectionDone) return { label: ACTION_LABELS.reflect, route: '/reflection' };
  if (s.checkinOpen) return { label: ACTION_LABELS.checkin, route: '/checkins' };
  return { label: ACTION_LABELS.progress, route: '/progress' };
}

export function respond(raw: string, ctx: KiuContext, s: KiuState): { messages: KiuMessage[]; ctx: KiuContext; chips: keyof typeof ACTION_LABELS.chips; effect?: KiuEffect } {
  const lang = s.lang;
  const text = raw.trim().replace(/[「」"']/g, '').replace(/[！!。.，,]+$/, '');
  const norm = text.toLowerCase().replace(/[１２３]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
  const is = (k: string) => KEYS[k].includes(norm);

  const plankMsg = (i: number) => {
    const p = PLANKS[i];
    return msg(fill(L.plank[lang], { n: s.planksLaid + 1, title: p.title[lang], body: p.body[lang] }), [
      { label: ACTION_LABELS.log, route: '/log', params: { skill: p.skill } },
    ]);
  };
  const sceneMsg = (i: number) => msg(`${SCENES[i].setup[lang]}\n\n${L.replyABC[lang]}`);

  if (CRISIS_RE.test(text)) {
    return {
      messages: [msg(L.crisis[lang], [{ label: ACTION_LABELS.call999, route: 'tel:999' }, { label: ACTION_LABELS.call18111, route: 'tel:18111' }])],
      ctx,
      chips: 'base',
    };
  }

  if (ctx.mode === 'scene' && ctx.scene != null && /^[abc]$/.test(norm)) {
    const sc = SCENES[ctx.scene];
    const key = norm.toUpperCase() as 'A' | 'B' | 'C';
    return { messages: [msg(`${sc[key][lang]}\n\n${L.sceneAgain[lang]}`)], ctx: { ...ctx, mode: null }, chips: 'base' };
  }

  if (/^[123]$/.test(norm)) {
    if (norm === '1') {
      const i = Math.min(PLANKS.length, s.week) - 1;
      return { messages: [plankMsg(i)], ctx: { ...ctx, mode: 'plank', plank: i }, chips: 'base' };
    }
    if (norm === '2') {
      const i = (s.week - 1) % SCENES.length;
      return { messages: [sceneMsg(i)], ctx: { ...ctx, mode: 'scene', scene: i, lastScene: i }, chips: 'scene' };
    }
    const go = !s.reflectionDone ? L.goReflect : s.checkinOpen ? L.goCheckin : L.goProgress;
    return { messages: [msg(go[lang], [item3Action(s)])], ctx: { ...ctx, mode: null }, chips: 'base' };
  }

  if (is('zh') || is('en')) {
    const next: Lang = is('zh') ? 'zh' : 'en';
    return { messages: [msg(L.lang[next]), bridgePost({ ...s, lang: next })], ctx: { ...ctx, mode: 'post' }, chips: 'post', effect: { type: 'lang', lang: next } };
  }
  if (is('hello') || is('post')) return { messages: [bridgePost(s)], ctx: { ...ctx, mode: 'post' }, chips: 'post' };
  if (is('plank')) {
    const i = ctx.mode === 'plank' ? (ctx.plank + 1) % PLANKS.length : ctx.plank;
    return { messages: [plankMsg(i)], ctx: { ...ctx, mode: 'plank', plank: i }, chips: 'base' };
  }
  if (is('scene')) {
    const i = ctx.lastScene == null ? (s.week - 1) % SCENES.length : (ctx.lastScene + 1 + Math.floor(Math.random() * (SCENES.length - 1))) % SCENES.length;
    return { messages: [sceneMsg(i)], ctx: { ...ctx, mode: 'scene', scene: i, lastScene: i }, chips: 'scene' };
  }
  if (is('done')) {
    const n = s.planksLaid + 1;
    return {
      messages: [msg(n === 1 ? L.done1[lang] : fill(L.doneN[lang], { n }))],
      ctx: { ...ctx, mode: 'plank' },
      chips: 'base',
      effect: { type: 'log', skill: PLANKS[ctx.plank].skill },
    };
  }
  if (is('help')) return { messages: [msg(L.help[lang])], ctx: { ...ctx, mode: null }, chips: 'base' };
  if (is('thanks')) return { messages: [msg(L.thanks[lang])], ctx, chips: 'base' };

  return { messages: [msg(L.unknown[lang] + (text.length > 40 ? `\n\n${L.human[lang]}` : ''))], ctx, chips: 'base' };
}
