import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { config } from '@/config';
import { useT } from '@/i18n';
import { MEASURES, MEASURE_ORDER, currentPhase, isComplete, type Phase } from '@/measures';
import { programmeWeek, useStore } from '@/store';
import { colors, fonts } from '@/theme';
import { Bar, Body, Card, H1, Icon, Screen, TopBar } from '@/ui';

export default function Checkins() {
  const { data } = useStore();
  const { t, tx } = useT();
  const week = programmeWeek(data.profile);
  const { phase, open } = currentPhase(data.checkins, week);

  const phaseDone = (p: Phase) => MEASURE_ORDER.every((id) => isComplete(MEASURES[id], data.checkins[p]?.[id]));

  return (
    <Screen edges={['top', 'bottom']} header={<TopBar title={t('checkins')} icon="arrow-left" onBack={() => router.back()} />} contentStyle={{ gap: 16 }}>
      <H1>{t('checkins')}</H1>
      <Body>{t('checkinsBody')}</Body>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['before', 'after'] as Phase[]).map((p) => {
          const done = phaseDone(p);
          const active = p === phase && open && !done;
          return (
            <View
              key={p}
              style={{
                flex: 1,
                borderRadius: 16,
                padding: 14,
                gap: 4,
                backgroundColor: done ? colors.green : colors.paper,
                borderWidth: done ? 0 : 1.5,
                borderColor: active ? colors.accent : colors.line,
              }}
            >
              <Text style={{ fontFamily: fonts.body, fontSize: 13, color: done ? colors.onGreen : colors.muted }}>{p === 'before' ? t('before') : t('after')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {done ? <Icon name="check" size={18} color={colors.ground} /> : null}
                <Text style={{ fontFamily: fonts.bodySemi, fontSize: 16, color: done ? colors.ground : active ? colors.accent : colors.muted }}>
                  {done ? t('done') : active ? t('openNow') : t('opensWeek', { n: config.postCheckinWeek })}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {MEASURE_ORDER.map((id) => {
        const m = MEASURES[id];
        const answers = data.checkins[phase]?.[id] ?? {};
        const n = m.items.filter((i) => answers[i.id] != null).length;
        const complete = n === m.items.length;
        const disabled = !open || complete;
        return (
          <Pressable
            key={id}
            disabled={disabled}
            onPress={() => router.push({ pathname: '/checkin/[measure]', params: { measure: id, phase } })}
            accessibilityRole="button"
          >
            <Card style={{ gap: 10, opacity: !open ? 0.6 : 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: id === 'pacs' ? colors.sage : colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={id === 'pacs' ? 'forum-outline' : 'star-outline'} color={id === 'pacs' ? colors.green : colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.bodySemi, fontSize: 17, color: colors.ink }}>{tx(m.title)}</Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.muted }}>{m.source}</Text>
                </View>
              </View>
              <Body style={{ fontSize: 14, lineHeight: 21 }}>{tx(m.blurb)}</Body>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.muted }}>{t('answered', { n, t: m.items.length })}</Text>
                <Text style={{ fontFamily: fonts.bodySemi, fontSize: 15, color: complete ? colors.green : colors.accent }}>
                  {complete ? t('done') : open ? (n > 0 ? t('continueQ') : t('start')) : ''}
                </Text>
              </View>
              <Bar value={n / m.items.length} color={complete ? colors.green : colors.accent} />
            </Card>
          </Pressable>
        );
      })}

      <Body muted style={{ fontSize: 13, lineHeight: 19 }}>
        {t('checkinPrivacy')}
      </Body>
    </Screen>
  );
}
