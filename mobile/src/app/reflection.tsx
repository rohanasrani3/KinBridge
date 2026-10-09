import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { GOAL_STEPS, SKILLS, skillLabel, type SkillId } from '@/content';
import { useT } from '@/i18n';
import { logsInWeek, programmeWeek, useStore } from '@/store';
import { Bar, Body, Button, Card, Choice, Eyebrow, Field, H1, Screen, TopBar } from '@/ui';

export default function ReflectionScreen() {
  const { data, update } = useStore();
  const { t, tx, lang } = useT();
  const week = programmeWeek(data.profile);
  const existing = data.reflections.find((r) => r.week === week);

  const [step, setStep] = useState(1);
  const [skill, setSkill] = useState<SkillId | undefined>(existing?.skill);
  const [why, setWhy] = useState(existing?.why ?? '');
  const [goalStep, setGoalStep] = useState<number | undefined>(existing?.goalStep);
  const [nextSkill, setNextSkill] = useState<SkillId | undefined>(existing?.nextSkill);
  const [obstacle, setObstacle] = useState(existing?.obstacle ?? '');

  // Skills logged this week, most used first.
  const counts = new Map<SkillId, number>();
  for (const l of logsInWeek(data.logs)) for (const s of l.skills) counts.set(s, (counts.get(s) ?? 0) + 1);
  const used = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const options: { id: SkillId; n?: number }[] = used.length ? used.map(([id, n]) => ({ id, n })) : SKILLS.filter((s) => s.id !== 'other').map((s) => ({ id: s.id }));

  function finish() {
    const r = { week, at: new Date().toISOString(), skill, why: why.trim() || undefined, goalStep, nextSkill, obstacle: obstacle.trim() || undefined };
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
          <Field label={`${t('whyHelpful')} ${t('optional')}`} value={why} onChangeText={setWhy} multiline />
        </>
      ) : null}

      {step === 2 ? (
        <>
          <H1 style={{ fontSize: 26, lineHeight: 31 }}>{t('goalProgress')}</H1>
          {data.profile?.goal ? (
            <Card style={{ gap: 4 }}>
              <Eyebrow>{t('yourGoal')}</Eyebrow>
              <Body>“{data.profile.goal}”</Body>
            </Card>
          ) : (
            <Body muted>{t('noGoal')}</Body>
          )}
          {data.profile?.goal ? (
            <View style={{ gap: 10 }} accessibilityRole="radiogroup">
              {GOAL_STEPS.map((g, i) => (
                <Choice key={i} label={tx(g)} selected={goalStep === i} onPress={() => setGoalStep(i)} />
              ))}
            </View>
          ) : null}
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
          <Field label={`${t('obstacle')} ${t('optional')}`} value={obstacle} onChangeText={setObstacle} multiline />
        </>
      ) : null}
    </Screen>
  );
}
