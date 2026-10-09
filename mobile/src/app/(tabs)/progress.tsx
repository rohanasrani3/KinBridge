import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { skillLabel, type SkillId } from '@/content';
import { useT } from '@/i18n';
import { MEASURES, MEASURE_ORDER, subscaleScore } from '@/measures';
import { dayKey, useStore } from '@/store';
import { colors, fonts } from '@/theme';
import { Bar, Body, Card, H1, Screen } from '@/ui';

export default function Progress() {
  const { data } = useStore();
  const { t, tx, lang } = useT();

  const rows = MEASURE_ORDER.flatMap((id) =>
    MEASURES[id].subscales.map((s) => ({
      key: `${id}.${s.id}`,
      label: tx(s.label),
      lowerIsBetter: !!s.lowerIsBetter,
      before: subscaleScore(MEASURES[id], s.id, data.checkins.before?.[id]),
      after: subscaleScore(MEASURES[id], s.id, data.checkins.after?.[id]),
    })),
  );
  const anyBefore = rows.some((r) => r.before != null);
  const anyAfter = rows.some((r) => r.after != null);

  // Last 28 days, oldest first.
  const loggedDays = new Set(data.logs.map((l) => dayKey(new Date(l.at))));
  const today = new Date();
  const cells = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (27 - i));
    return loggedDays.has(dayKey(d));
  });

  const counts = new Map<SkillId, number>();
  for (const l of data.logs) for (const s of l.skills) counts.set(s, (counts.get(s) ?? 0) + 1);
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = top[0]?.[1] ?? 1;

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <H1>{t('progressTitle')}</H1>
        <Pressable onPress={() => router.push('/checkins')} accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.bodySemi, fontSize: 15, color: colors.accent }}>{t('checkins')}</Text>
        </Pressable>
      </View>

      <Card style={{ gap: 14 }}>
        <Text style={{ fontFamily: fonts.bodySemi, fontSize: 16, color: colors.ink }}>{t('beforeAfter')}</Text>
        {!anyBefore ? (
          <Pressable onPress={() => router.push('/checkins')} accessibilityRole="link">
            <Body muted>{t('noCheckins')}</Body>
          </Pressable>
        ) : (
          <>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Legend color={colors.before} label={t('before')} />
              <Legend color={colors.green} label={t('after')} />
            </View>
            {rows.map((r) => {
              const change = r.before != null && r.after != null ? r.after - r.before : null;
              const dir = change == null ? '' : Math.abs(change) < 0.01 ? t('same') : change > 0 ? t('up') : t('down');
              return (
                <View key={r.key} style={{ gap: 6 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.ink }}>{r.label}</Text>
                    <Text style={{ fontFamily: fonts.bodySemi, fontSize: 15, color: colors.green }}>{dir}</Text>
                  </View>
                  <Bar value={r.before ?? 0} color={colors.before} track={colors.sand} height={10} />
                  {r.after != null ? <Bar value={r.after} color={colors.green} track={colors.sand} height={10} /> : null}
                  {r.lowerIsBetter ? <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.muted }}>{t('lowerBetter')}</Text> : null}
                </View>
              );
            })}
            {!anyAfter ? <Body muted style={{ fontSize: 14 }}>{t('afterPending')}</Body> : null}
          </>
        )}
      </Card>

      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: fonts.bodySemi, fontSize: 16, color: colors.ink }}>{t('practice')}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.muted }}>{t('entriesDays', { n: data.logs.length, d: loggedDays.size })}</Text>
        </View>
        <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.muted }}>{t('last4')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
          {cells.map((on, i) => (
            <View key={i} style={{ width: '12.4%', height: 22, borderRadius: 5, backgroundColor: on ? colors.green : colors.sand }} />
          ))}
        </View>
        {top.map(([id, n]) => (
          <View key={id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ width: 150, fontFamily: fonts.body, fontSize: 14, color: colors.ink }} numberOfLines={1}>
              {skillLabel(id, lang)}
            </Text>
            <View style={{ flex: 1 }}>
              <Bar value={n / max} height={8} track="transparent" />
            </View>
            <Text style={{ width: 24, textAlign: 'right', fontFamily: fonts.bodySemi, fontSize: 14, color: colors.ink }}>{n}</Text>
          </View>
        ))}
      </Card>

      {data.reflections.length ? (
        <Card style={{ gap: 8 }}>
          <Text style={{ fontFamily: fonts.bodySemi, fontSize: 16, color: colors.ink }}>{t('reflections')}</Text>
          {[...data.reflections]
            .sort((a, b) => a.week - b.week)
            .map((r) => (
              <Body key={r.week} style={{ fontSize: 15 }}>
                {t('weekShort', { n: r.week })}
                {r.skill ? ` · ${t('mostHelpfulShort', { s: skillLabel(r.skill, lang) })}` : ''}
              </Body>
            ))}
        </Card>
      ) : null}
    </Screen>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: color }} />
      <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.muted }}>{label}</Text>
    </View>
  );
}
