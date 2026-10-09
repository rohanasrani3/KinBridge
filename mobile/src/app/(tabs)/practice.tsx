import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { skillLabel } from '@/content';
import { useT, type Key } from '@/i18n';
import { dayKey, useStore, type LogEntry } from '@/store';
import { colors, fonts } from '@/theme';
import { Body, Button, Card, H1, Icon, Screen, type IconName } from '@/ui';

const OUTCOME_ICON: Record<string, { icon: IconName; key: Key }> = {
  hard: { icon: 'emoticon-sad-outline', key: 'hard' },
  ok: { icon: 'emoticon-neutral-outline', key: 'ok' },
  well: { icon: 'emoticon-happy-outline', key: 'well' },
};

export default function Practice() {
  const { data, update } = useStore();
  const { t, lang } = useT();
  const locale = lang === 'zh' ? 'zh-HK' : 'en-GB';

  const groups: { key: string; date: Date; items: LogEntry[] }[] = [];
  for (const l of [...data.logs].sort((a, b) => b.at.localeCompare(a.at))) {
    const d = new Date(l.at);
    const key = dayKey(d);
    const g = groups.find((x) => x.key === key);
    if (g) g.items.push(l);
    else groups.push({ key, date: d, items: [l] });
  }
  const todayKey = dayKey(new Date());

  function remove(id: string) {
    update((d) => ({ ...d, logs: d.logs.filter((l) => l.id !== id) }));
  }

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <H1>{t('practiceTitle')}</H1>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button label={t('logPractice')} icon="plus" onPress={() => router.push('/log')} style={{ flex: 1, paddingHorizontal: 12 }} />
        <Button label={t('reflection')} variant="ghost" onPress={() => router.push('/reflection')} style={{ flex: 1, paddingHorizontal: 12 }} />
      </View>

      {groups.length === 0 ? <Body muted>{t('noLogs')}</Body> : null}

      {groups.map((g) => (
        <View key={g.key} style={{ gap: 8 }}>
          <Text style={{ fontFamily: fonts.bodySemi, fontSize: 14, color: colors.muted }}>
            {g.key === todayKey ? t('today') : g.date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
          {g.items.map((l) => {
            const o = l.outcome ? OUTCOME_ICON[l.outcome] : null;
            return (
              <Card key={l.id} style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                  <Text style={{ flex: 1, fontFamily: fonts.bodySemi, fontSize: 16, color: colors.ink }}>{l.skills.map((s) => skillLabel(s, lang)).join(' · ')}</Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.muted }}>
                    {new Date(l.at).toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })}
                  </Text>
                </View>
                {o ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Icon name={o.icon} size={18} color={colors.ink2} />
                    <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.ink2 }}>{t(o.key)}</Text>
                  </View>
                ) : null}
                {l.note ? <Body style={{ fontSize: 15, lineHeight: 22 }}>{l.note}</Body> : null}
                <Pressable onPress={() => remove(l.id)} accessibilityRole="button" style={{ alignSelf: 'flex-end', minHeight: 36, justifyContent: 'center', paddingHorizontal: 4 }}>
                  <Text style={{ fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.accent }}>{t('delete')}</Text>
                </Pressable>
              </Card>
            );
          })}
        </View>
      ))}
    </Screen>
  );
}
