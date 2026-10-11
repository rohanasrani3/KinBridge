import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { GOAL_STEPS, HELPED_TAGS, OBSTACLE_TAGS, SKILLS, skillLabel, type SkillId } from '@/content';
import { useT } from '@/i18n';
import { logsInWeek, programmeWeek, useStore } from '@/store';
import { Bar, Body, Button, Card, Chip, Choice, Eyebrow, H1, Screen, TopBar, styles } from '@/ui';

// Weekly reflection: about 5 minutes, all taps, no typing.
export default function ReflectionScreen() {
  const { data, update } = useStore();
  const { t, tx, lang } = useT();
  const week = programmeWeek(data.profile);
  const existing = data.reflections.find((r) => r.week === week);

  const [step, setStep] = useState(1);
  const [skill, setSkill] = useState<SkillId | undefined>(existing?.skill);
  const [helped, setHelped] = useState<string[]>(existing?.helped ?? []);
  const [goalStep, setGoalStep] = useState<number | undefined>(existing?.goalStep);
  const [nextSkill, setNextSkill] = useState<SkillId | undefined>(existing?.nextSkill);
  const [obstacles, setObstacles] = useState<string[]>(existing?.obstacles ?? []);

  // Skills logged this week, most used first.
  const counts = new Map<SkillId, number>();
  for (const l of logsInWeek(data.logs)) for (const s of l.skills) counts.set(s, (counts.get(s) ?? 0) + 1);
  const used = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const options: { id: SkillId; n?: number }[] = used.length ? used.map(([id, n]) => ({ id, n })) : SKILLS.filter((s) => s.id !== 'other').map((s) => ({ id: s.id }));

  const toggle = (list: string[], set: (l: string[]) => void, id: string) => set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  function finish() {
    const r = { week, at: new Date().toISOString(), skill, helped, goalStep, nextSkill, obstacles };
    update((d) => ({ ...d, reflections: [...d.reflections.filter((x) => x.week !== week), r] }));
    router.back();
  }

  const canNext = step === 1 ? !!skill : step === 2 ? goalStep != null || !data.profile?.goal : true;

  return (
    <Screen
      edges={['top', 'bottom']}
      header={
        <View>
          <TopBar
            title={t('reflectionTitle', { n: week })}
            icon={step === 1 ? 'close' : 'arrow-left'}
            onBack={() => (step === 1 ? router.back() : setStep(step - 1))}
            right={<Body muted style={{ fontSize: 14, paddingRight: 12 }}>{t('step', { n: step })}</Body>}
          />
          <View style={{ paddingHorizontal: 20, paddingTop: 4 }}>
            <Bar value={step / 3} />
          </View>
        </View>
      }
      footer={<Button label={step === 3 ? t('finish') : t('next')} onPress={() => (step === 3 ? finish() : setStep(step + 1))} disabled={!canNext} />}
      contentStyle={{ gap: 20, paddingTop: 24 }}
    >
      {step === 1 ? (
        <>
          <View style={{ gap: 6 }}>
            <H1 style={{ fontSize: 26, lineHeight: 31 }}>{t('mostHelpful')}</H1>
            <Body muted style={{ fontSize: 15 }}>{used.length ? t('fromLogs') : t('noLogsWeek')}</Body>
          </View>
          <View style={{ gap: 10 }} accessibilityRole="radiogroup">
            {options.map((o) => (
              <Choice
                key={o.id}
                label={skillLabel(o.id, lang)}
                sub={o.n == null ? undefined : o.n === 1 ? t('loggedOnce') : t('loggedTimes', { n: o.n })}
                selected={skill === o.id}
                onPress={() => setSkill(o.id)}
              />
            ))}
          </View>
          <TagGroup label={t('whatWorked')} hint={t('tapAny')} tags={HELPED_TAGS} selected={helped} onToggle={(id) => toggle(helped, setHelped, id)} tx={tx} />
        </>
      ) : null}

      {step === 2 ? (
        <>
          <H1 style={{ fontSize: 26, lineHeight: 31 }}>{t('goalProgress')}</H1>
          {data.profile?.goal ? (
            <>
              <Card style={{ gap: 4 }}>
                <Eyebrow>{t('yourGoal')}</Eyebrow>
                <Body>“{data.profile.goal}”</Body>
              </Card>
              <View style={{ gap: 10 }} accessibilityRole="radiogroup">
                {GOAL_STEPS.map((g, i) => (
                  <Choice key={i} label={tx(g)} selected={goalStep === i} onPress={() => setGoalStep(i)} />
                ))}
              </View>
            </>
          ) : (
            <Body muted>{t('noGoal')}</Body>
          )}
        </>
      ) : null}

      {step === 3 ? (
        <>
          <H1 style={{ fontSize: 26, lineHeight: 31 }}>{t('nextFocus')}</H1>
          <View style={{ gap: 10 }} accessibilityRole="radiogroup">
            {SKILLS.filter((s) => s.id !== 'other').map((s) => (
              <Choice key={s.id} label={tx(s.label)} selected={nextSkill === s.id} onPress={() => setNextSkill(s.id)} />
            ))}
          </View>
          <TagGroup label={t('obstacle')} hint={t('tapAny')} tags={OBSTACLE_TAGS} selected={obstacles} onToggle={(id) => toggle(obstacles, setObstacles, id)} tx={tx} />
        </>
      ) : null}
    </Screen>
  );
}

function TagGroup({
  label,
  hint,
  tags,
  selected,
  onToggle,
  tx,
}: {
  label: string;
  hint: string;
  tags: { id: string; label: { en: string; zh: string } }[];
  selected: string[];
  onToggle: (id: string) => void;
  tx: (t: { en: string; zh: string }) => string;
}) {
  return (
    <View style={{ gap: 10 }}>
      <View>
        <Text style={[styles.label, { fontSize: 16 }]}>{label}</Text>
        <Text style={styles.help}>{hint}</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {tags.map((tag) => (
          <Chip key={tag.id} label={tx(tag.label)} selected={selected.includes(tag.id)} onPress={() => onToggle(tag.id)} />
        ))}
      </View>
    </View>
  );
}
