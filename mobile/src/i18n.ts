import { useStore } from './store';
import type { Lang, Text } from './content';

const S = {
  // Onboarding
  welcomeTitle: { en: 'Practise a little every day. See what changes.', zh: '每日練習少少，睇吓有咩改變。' },
  welcomeBody: {
    en: 'For parents in Parenting Foundations. Log the skills you try at home, reflect once a week, and compare your check-ins before and after the course.',
    zh: '畀參加 Parenting Foundations 嘅家長使用。記錄你喺屋企試過嘅技巧、每星期反思一次，再比較課程前後嘅檢查結果。',
  },
  language: { en: 'Language · 語言', zh: '語言 · Language' },
  name: { en: 'What should we call you?', zh: '我哋點稱呼你？' },
  code: { en: 'Enrolment code', zh: '報名編號' },
  codeHelp: { en: 'It’s in your welcome message once your place is confirmed.', zh: '確認名額後，歡迎訊息入面會有。' },
  goal: { en: 'By the end of the programme, I would like to be able to…', zh: '課程完結時，我希望可以…' },
  goalHelp: { en: 'The same goal you wrote on your intake form. You can change it later.', zh: '同你登記表格上寫嘅目標一樣，之後可以改。' },
  continue: { en: 'Continue', zh: '繼續' },
  notEnrolled: { en: 'Not enrolled yet? Get the intake form', zh: '未報名？下載登記表格' },
  safety: {
    en: 'KinBridge is parenting education, not therapy or a crisis service. In an emergency call 999. For 24-hour support call 18111.',
    zh: '親橋提供家長教育，唔係治療或危機服務。緊急情況請致電 999。24 小時支援熱線：18111。',
  },
  // Tabs
  tabToday: { en: 'Today', zh: '今日' },
  tabPractice: { en: 'Practice', zh: '練習' },
  tabProgress: { en: 'Progress', zh: '進度' },
  tabKiu: { en: 'Kiu', zh: '橋仔' },
  // Today
  week: { en: 'Week {n} of {t}', zh: '第 {n} 週（共 {t} 週）' },
  weekShort: { en: 'Week {n}', zh: '第 {n} 週' },
  morning: { en: 'Good morning', zh: '早晨' },
  afternoon: { en: 'Good afternoon', zh: '午安' },
  evening: { en: 'Good evening', zh: '晚上好' },
  todayGoal: { en: 'Today’s home goal', zh: '今日家居目標' },
  didIt: { en: 'I did it', zh: '做咗' },
  doneToday: { en: 'Logged', zh: '已記錄' },
  addDetails: { en: 'Add details', zh: '補充細節' },
  thisWeek: { en: 'This week', zh: '今個星期' },
  practiceDays: { en: '{n} practice days', zh: '練習咗 {n} 日' },
  practiceDay1: { en: '1 practice day', zh: '練習咗 1 日' },
  reflection: { en: 'Weekly reflection', zh: '每週反思' },
  reflectionDue: { en: 'About 2 minutes · due Sunday', zh: '大約 2 分鐘 · 星期日前完成' },
  reflectionDone: { en: 'Done for this week', zh: '今個星期已完成' },
  nextSession: { en: 'Next session', zh: '下一堂' },
  lesson: { en: 'Lesson {n}', zh: '第 {n} 課' },
  logPractice: { en: 'Log practice', zh: '記錄練習' },
  // Log
  whatPractised: { en: 'What did you practise?', zh: '你練習咗咩？' },
  howItWent: { en: 'How did it go?', zh: '效果點樣？' },
  hard: { en: 'Hard', zh: '困難' },
  ok: { en: 'Okay', zh: '一般' },
  well: { en: 'Went well', zh: '順利' },
  whatHappened: { en: 'What happened?', zh: '發生咩事？' },
  optional: { en: '(optional)', zh: '（可選）' },
  privacyNote: { en: 'Please leave out your child’s name and school.', zh: '請唔好寫孩子嘅名同學校。' },
  when: { en: 'When', zh: '時間' },
  now: { en: 'Just now', zh: '啱啱' },
  earlier: { en: 'Earlier today', zh: '今日較早' },
  yesterday: { en: 'Yesterday', zh: '尋日' },
  save: { en: 'Save entry', zh: '儲存' },
  pickSkill: { en: 'Pick at least one skill.', zh: '請揀最少一項技巧。' },
  close: { en: 'Close', zh: '關閉' },
  back: { en: 'Back', zh: '返回' },
  // Practice tab
  practiceTitle: { en: 'Practice', zh: '練習' },
  noLogs: { en: 'Nothing logged yet. Tap Log practice after you try a skill at home.', zh: '仲未有記錄。喺屋企試完技巧後，撳「記錄練習」。' },
  today: { en: 'Today', zh: '今日' },
  delete: { en: 'Delete', zh: '刪除' },
  // Reflection
  reflectionTitle: { en: 'Week {n} reflection', zh: '第 {n} 週反思' },
  step: { en: '{n} of 3', zh: '{n} / 3' },
  mostHelpful: { en: 'Which skill helped most this week?', zh: '今個星期邊項技巧最有用？' },
  fromLogs: { en: 'From the practice you logged.', zh: '根據你嘅練習記錄。' },
  noLogsWeek: { en: 'You haven’t logged practice this week, so here are all the skills.', zh: '今個星期未有記錄，所以列出全部技巧。' },
  loggedTimes: { en: 'Logged {n} times', zh: '記錄咗 {n} 次' },
  loggedOnce: { en: 'Logged once', zh: '記錄咗 1 次' },
  whyHelpful: { en: 'What made it helpful?', zh: '點解有用？' },
  goalProgress: { en: 'How close are you to your goal?', zh: '你離目標有幾近？' },
  yourGoal: { en: 'Your goal', zh: '你嘅目標' },
  noGoal: { en: 'Add your goal in Settings to track it here.', zh: '喺設定加入目標，就可以喺度追蹤。' },
  nextFocus: { en: 'Which skill will you focus on next week?', zh: '下星期想專注邊項技巧？' },
  obstacle: { en: 'What might get in the way?', zh: '有咩可能阻住你？' },
  next: { en: 'Next', zh: '下一步' },
  finish: { en: 'Finish', zh: '完成' },
  // Check-ins
  checkins: { en: 'Check-ins', zh: '檢查' },
  checkinsBody: { en: 'Two short questionnaires, once before Lesson 1 and again after Lesson 4, so you can see what changed.', zh: '兩份簡短問卷：第一課前做一次，第四課後再做一次，睇吓有咩改變。' },
  before: { en: 'Before Lesson 1', zh: '第一課前' },
  after: { en: 'After Lesson 4', zh: '第四課後' },
  done: { en: 'Done', zh: '已完成' },
  openNow: { en: 'Open now', zh: '而家可以做' },
  opensWeek: { en: 'Opens in week {n}', zh: '第 {n} 週開放' },
  answered: { en: '{n} of {t} answered', zh: '已答 {n} / {t}' },
  start: { en: 'Start', zh: '開始' },
  continueQ: { en: 'Continue', zh: '繼續' },
  checkinPrivacy: { en: 'Only the programme team sees your answers. This is not a diagnosis or clinical assessment.', zh: '只有課程團隊會睇到你嘅答案。呢個唔係診斷或臨床評估。' },
  howMuchAgree: { en: 'How much do you agree?', zh: '你有幾同意？' },
  noWrong: { en: 'There are no right or wrong answers. Your progress saves as you go.', zh: '冇對錯之分。進度會自動儲存。' },
  checkinDone: { en: 'Thank you. That’s this check-in done.', zh: '多謝！呢份問卷完成咗。' },
  backToCheckins: { en: 'Back to check-ins', zh: '返回檢查' },
  // Progress
  progressTitle: { en: 'Your progress', zh: '你嘅進度' },
  beforeAfter: { en: 'Before and after the course', zh: '課程前後' },
  up: { en: 'Up', zh: '上升' },
  down: { en: 'Down', zh: '下降' },
  same: { en: 'No change', zh: '冇變' },
  lowerBetter: { en: 'Lower is better here.', zh: '呢項越低越好。' },
  noCheckins: { en: 'Complete your first check-in to see this.', zh: '完成第一次檢查後就會見到。' },
  afterPending: { en: 'Your after-course results appear once you finish the Lesson 4 check-in.', zh: '完成第四課後嘅檢查，就會見到課程後結果。' },
  practice: { en: 'Practice', zh: '練習' },
  entriesDays: { en: '{n} entries on {d} days', zh: '{d} 日內共 {n} 次記錄' },
  last4: { en: 'Last 4 weeks', zh: '最近 4 星期' },
  reflections: { en: 'Reflections', zh: '反思' },
  mostHelpfulShort: { en: 'Most helpful: {s}', zh: '最有用：{s}' },
  // Settings
  settings: { en: 'Settings', zh: '設定' },
  resetData: { en: 'Delete all my data on this phone', zh: '刪除呢部手機上嘅所有資料' },
  resetConfirm: { en: 'Tap again to delete everything', zh: '再撳一次確認刪除' },
  dataNote: { en: 'Your logs, reflections and check-ins are stored on this phone.', zh: '你嘅記錄、反思同問卷答案儲存喺呢部手機。' },
  support: { en: 'Need help now?', zh: '即時需要幫助？' },
} satisfies Record<string, Text>;

export type Key = keyof typeof S;

export function translate(lang: Lang, key: Key, vars?: Record<string, string | number>) {
  let s = S[key][lang];
  if (vars) for (const k of Object.keys(vars)) s = s.split(`{${k}}`).join(String(vars[k]));
  return s;
}

export function useT() {
  const { data } = useStore();
  const lang = data.lang;
  return {
    lang,
    t: (key: Key, vars?: Record<string, string | number>) => translate(lang, key, vars),
    tx: (text: Text) => text[lang],
  };
}
