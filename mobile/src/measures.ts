import { config } from './config';
import type { Text } from './content';

// Questionnaires used for the before/after check-ins.
//
// IMPORTANT: only the example items supplied by the team are filled in. Every item marked
// `pending` needs its licensed wording (and licensed Chinese translation) before launch.
// Check item order and response scales against the licensed versions too.

export type MeasureId = 'pacs' | 'bpses';
export type Phase = 'before' | 'after';

export type Item = { id: string; subscale: string; text: Text; pending?: boolean };
export type Subscale = { id: string; label: Text; lowerIsBetter?: boolean };
export type Measure = {
  id: MeasureId;
  title: Text;
  source: string;
  blurb: Text;
  options: Text[]; // scored 1..options.length
  subscales: Subscale[];
  items: Item[];
};

const AGREE5: Text[] = [
  { en: 'Strongly disagree', zh: '非常不同意' },
  { en: 'Moderately disagree', zh: '有點不同意' },
  { en: 'Neither agree nor disagree', zh: '中立' },
  { en: 'Moderately agree', zh: '有點同意' },
  { en: 'Strongly agree', zh: '非常同意' },
];

function pending(prefix: string, subscale: string, label: string, from: number, to: number): Item[] {
  const out: Item[] = [];
  for (let n = from; n <= to; n++) {
    out.push({
      id: `${prefix}${n}`,
      subscale,
      pending: true,
      text: { en: `[${label} statement ${n}: add licensed wording]`, zh: `[${label} 第 ${n} 題：請加入已授權譯本]` },
    });
  }
  return out;
}

export const MEASURES: Record<MeasureId, Measure> = {
  pacs: {
    id: 'pacs',
    title: { en: 'Talking together', zh: '親子溝通' },
    source: 'Parent-Adolescent Communication Scale',
    blurb: {
      en: '20 statements in two parts: open communication, and communication problems.',
      zh: '20 句陳述，分兩部分：開放溝通，同溝通困難。',
    },
    options: AGREE5,
    subscales: [
      { id: 'open', label: { en: 'Open communication', zh: '開放溝通' } },
      { id: 'problems', label: { en: 'Communication problems', zh: '溝通困難' }, lowerIsBetter: true },
    ],
    items: [
      { id: 'open1', subscale: 'open', text: { en: 'When I ask questions, I get honest answers from my child.', zh: '[中文譯本待加入] When I ask questions, I get honest answers from my child.' } },
      { id: 'prob1', subscale: 'problems', text: { en: 'When we are having a problem, I often give my child the silent treatment.', zh: '[中文譯本待加入] When we are having a problem, I often give my child the silent treatment.' } },
      ...pending('open', 'open', 'Open communication', 2, 10),
      ...pending('prob', 'problems', 'Communication problems', 2, 10),
    ],
  },
  bpses: {
    id: 'bpses',
    title: { en: 'Confidence as a parent', zh: '家長信心' },
    source: 'Brief Parental Self-Efficacy Scale',
    blurb: {
      en: '5 statements about knowing what to do, being able to do it, and believing it makes a difference.',
      zh: '5 句陳述：知道點做、做得到，同相信有用。',
    },
    // TODO: confirm the licensed response scale.
    options: AGREE5,
    subscales: [{ id: 'efficacy', label: { en: 'Confidence as a parent', zh: '家長信心' } }],
    items: [
      { id: 'know', subscale: 'efficacy', text: { en: 'Even though I may not always manage it, I know what I need to do with my child.', zh: '[中文譯本待加入] Even though I may not always manage it, I know what I need to do with my child.' } },
      { id: 'able', subscale: 'efficacy', text: { en: 'I am able to do the things that will improve my child’s behaviour.', zh: '[中文譯本待加入] I am able to do the things that will improve my child’s behaviour.' } },
      { id: 'outcome', subscale: 'efficacy', text: { en: 'The things I do make a difference to my child’s behaviour.', zh: '[中文譯本待加入] The things I do make a difference to my child’s behaviour.' } },
      ...pending('bp', 'efficacy', 'Self-efficacy', 4, 5),
    ],
  },
};

export const MEASURE_ORDER: MeasureId[] = ['pacs', 'bpses'];

export type Answers = Record<string, number>;

// Mean answer for a subscale, mapped to 0..1 of the scale range. Null until every item is answered.
export function subscaleScore(m: Measure, subscaleId: string, answers: Answers | undefined): number | null {
  if (!answers) return null;
  const items = m.items.filter((i) => i.subscale === subscaleId);
  const vals = items.map((i) => answers[i.id]);
  if (vals.some((v) => v == null)) return null;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  return (mean - 1) / (m.options.length - 1);
}

export function isComplete(m: Measure, answers: Answers | undefined) {
  return !!answers && m.items.every((i) => answers[i.id] != null);
}

export type Checkins = Partial<Record<Phase, Partial<Record<MeasureId, Answers>>>>;

// The phase a parent should be working on: "before" until it's complete, then "after" once it opens.
export function currentPhase(checkins: Checkins, week: number): { phase: Phase; open: boolean } {
  const beforeDone = MEASURE_ORDER.every((id) => isComplete(MEASURES[id], checkins.before?.[id]));
  if (!beforeDone) return { phase: 'before', open: true };
  return { phase: 'after', open: week >= config.postCheckinWeek };
}
