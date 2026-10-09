import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useT } from '@/i18n';
import { MEASURES, type MeasureId, type Phase } from '@/measures';
import { useStore } from '@/store';
import { colors, fonts } from '@/theme';
import { Bar, BridgeLogo, Body, Button, Choice, Eyebrow, H1, Screen, TopBar } from '@/ui';

export default function CheckinRun() {
  const params = useLocalSearchParams<{ measure: string; phase: string }>();
  const m = MEASURES[params.measure as MeasureId];
  const phase: Phase = params.phase === 'after' ? 'after' : 'before';
  const { data, update } = useStore();
  const { t, tx } = useT();

  const answers = data.checkins[phase]?.[m?.id] ?? {};
  const firstUnanswered = m ? m.items.findIndex((i) => answers[i.id] == null) : 0;
  const [index, setIndex] = useState(firstUnanswered === -1 ? 0 : firstUnanswered);
  const [finished, setFinished] = useState(false);

  if (!m) return null;
  const item = m.items[index];
  const value = answers[item.id];

  function answer(v: number) {
    update((d) => ({
      ...d,
      checkins: { ...d.checkins, [phase]: { ...d.checkins[phase], [m.id]: { ...d.checkins[phase]?.[m.id], [item.id]: v } } },
    }));
  }

  function next() {
    if (index < m.items.length - 1) setIndex(index + 1);
    else setFinished(true);
  }

  if (finished) {
    return (
      <Screen edges={['top', 'bottom']} scroll={false} contentStyle={{ justifyContent: 'center', alignItems: 'center', gap: 20 }} footer={<Button label={t('backToCheckins')} onPress={() => router.back()} />}>
        <View style={{ width: 88, height: 88, borderRadius: 28, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
          <BridgeLogo size={52} color={colors.ground} />
        </View>
        <H1 style={{ textAlign: 'center' }}>{t('checkinDone')}</H1>
        <Body muted style={{ textAlign: 'center' }}>
          {t('checkinPrivacy')}
        </Body>
      </Screen>
    );
  }

  return (
    <Screen
      edges={['top', 'bottom']}
      header={
        <View>
          <TopBar title={tx(m.title)} onBack={() => router.back()} right={<Body muted style={{ fontSize: 14, paddingRight: 12 }}>{`${index + 1} / ${m.items.length}`}</Body>} />
          <View style={{ paddingHorizontal: 20, paddingTop: 4 }}>
            <Bar value={(index + 1) / m.items.length} />
          </View>
        </View>
      }
      footer={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button label={t('back')} variant="ghost" onPress={() => setIndex(index - 1)} disabled={index === 0} style={{ flex: 1 }} />
          <Button label={index === m.items.length - 1 ? t('finish') : t('next')} onPress={next} disabled={value == null} style={{ flex: 1 }} />
        </View>
      }
      contentStyle={{ gap: 24, paddingTop: 28 }}
    >
      <View style={{ gap: 12 }}>
        <Eyebrow>{t('howMuchAgree')}</Eyebrow>
        <Text accessibilityRole="header" style={{ fontFamily: fonts.display, fontSize: 26, lineHeight: 33, color: item.pending ? colors.muted : colors.ink }}>
          {tx(item.text)}
        </Text>
      </View>
      <View style={{ gap: 10 }} accessibilityRole="radiogroup">
        {m.options.map((o, i) => (
          <Choice key={i} label={tx(o)} selected={value === i + 1} onPress={() => answer(i + 1)} />
        ))}
      </View>
      <Body muted style={{ fontSize: 14 }}>
        {t('noWrong')}
      </Body>
    </Screen>
  );
}
