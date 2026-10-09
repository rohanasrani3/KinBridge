// Programme content. Lessons and home goals come from the website's programme page;
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

export const LESSONS: { title: Text; goal: Text; tip: Text; skill: SkillId }[] = [
  {
    title: { en: 'Understanding Your Child’s Changing Needs', zh: '了解孩子不斷轉變的需要' },
    goal: { en: 'Pause and ask what your child might be feeling.', zh: '停一停，諗吓孩子當刻可能有咩感受。' },
    tip: { en: 'In one tense moment today, stop for a breath first. You don’t have to fix anything yet.', zh: '今日揀一個緊張時刻，先吸一啖氣。唔使即刻解決任何嘢。' },
    skill: 'pause',
  },
  {
    title: { en: 'Encouraging Positive Behaviour', zh: '鼓勵正面行為' },
    goal: { en: 'Praise one specific effort.', zh: '具體咁讚一個努力。' },
    tip: { en: '“You kept going on that maths question” sticks better than “good job”.', zh: '「你嗰條數堅持做到尾」會比「好叻」更入心。' },
    skill: 'effort',
  },
  {
    title: { en: 'Managing Stress and Strengthening Family Bonds', zh: '管理壓力，加強親子關係' },
    goal: { en: 'Use one coping strategy when stress rises.', zh: '壓力上嚟時，用一招冷靜方法。' },
    tip: { en: 'A slow breath, a glass of water, a walk to the window. Use it before you respond.', zh: '慢慢吸一啖氣、飲杯水、行去窗口望吓。回應之前先用。' },
    skill: 'pause',
  },
  {
    title: { en: 'Communicating with Empathy', zh: '以同理心溝通' },
    goal: { en: 'One listening conversation: no advice, just understanding.', zh: '一次淨係聆聽嘅傾偈：唔俾意見，只求明白。' },
    tip: { en: 'Ask, nod, and say back what you heard. That’s the whole job.', zh: '問、點頭、將你聽到嘅講返出嚟，咁就得。' },
    skill: 'listen',
  },
];

export const GOAL_STEPS: Text[] = [
  { en: 'Not started', zh: '未開始' },
  { en: 'A little closer', zh: '近咗少少' },
  { en: 'Halfway', zh: '一半' },
  { en: 'Nearly there', zh: '差唔多' },
  { en: 'I can do it now', zh: '而家做到' },
];
