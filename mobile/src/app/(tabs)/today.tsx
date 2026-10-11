import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { config } from '@/config';
import { LESSONS, practiceFor } from '@/content';
import { useT, type Key } from '@/i18n';
import { dayKey, programmeWeek, setDailyCheck, useStore, weekStart, type CheckStatus } from '@/store';
import { colors, fonts } from '@/theme';
import { Body, Button, Card, Eyebrow, H1, Icon, Screen, type IconName } from '@/ui';

const ANSWERS: { status: CheckStatus; key: Key; icon: IconName }[] = [
  { status: 'tried', key: 'tried', icon: 'check-circle-outline' },
  { status: 'help', key: 'needHelp', icon: 'lifebuoy' },
  { status: 'missed', key: 'missed', icon: 'calendar-remove-outline' },
];

export default function Today() {
  const { data, update } = useStore();
  const { t, tx, lang } = useT();
  const now = new Date();
  const week = programmeWeek(data.profile, now);
  const practice = practiceFor(week, now);
  const hour = now.getHours();
  const greet = hour < 12 ? t('morning') : hour < 18 ? t('afternoon') : t('evening');

  const todayKey = dayKey(now);
  const todayCheck = data.checks.find((c) => c.day === todayKey);
  const loggedDays = new Set(data.logs.map((l) => dayKey(new Date(l.at))));

  const monday = weekStart(now);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
  const practiceDays = days.filter((d) => loggedDays.has(dayKey(d))).length;
  const dayLetters = lang === 'zh' ? ['一', '二', '三', '四', '五', '六', '日'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const reflectionDone = data.reflections.some((r) => r.week === week);
  const nextLesson = week < LESSONS.length ? week + 1 : null;

  function answer(status: CheckStatus) {
    update((d) => setDailyCheck(d, practice, status));
  }

  return (
    <View style={{ flex: 1 }}>
      <Screen contentStyle={{ gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ gap: 2, flex: 1 }}>
            <Eyebrow>{t('week', { n: week, t: config.programmeWeeks })}</Eyebrow>
            <H1>
              {greet}
              {lang === 'zh' ? '，' : ', '}
              {data.profile?.name}
            </H1>
          </View>
          <Pressable
            onPress={() => router.push('/settings')}
            accessibilityRole="button"
            accessibilityLabel={t('settings')}
            style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="account-outline" />
          </Pressable>
        </View>

        <Card tone="green" style={{ borderRadius: 24, padding: 22, gap: 12 }}>
          <Eyebrow color={colors.peach}>{t('todayPractice', { n: practice.minutes })}</Eyebrow>
          <Text style={{ fontFamily: fonts.display, fontSize: 24, lineHeight: 30, color: colors.ground }}>{tx(practice.text)}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.onGreen }}>{tx(practice.how)}</Text>
          <Text style={{ fontFamily: fonts.bodySemi, fontSize: 15, color: colors.ground, marginTop: 6 }}>{t('didYouTry')}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }} accessibilityRole="radiogroup">
            {ANSWERS.map((a) => {
              const on = todayCheck?.status === a.status;
              return (
                <Pressable
                  key={a.status}
                  onPress={() => answer(a.status)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  style={{
                    flex: 1,
                    minHeight: 68,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    paddingHorizontal: 4,
                    backgroundColor: on ? colors.ground : 'transparent',
                    borderWidth: 1.5,
                    borderColor: on ? colors.ground : colors.onGreen,
                  }}
                >
                  <Icon name={a.icon} size={22} color={on ? colors.green : colors.ground} />
                  <Text style={{ fontFamily: fonts.bodySemi, fontSize: 13, textAlign: 'center', color: on ? colors.ink : colors.ground }}>{t(a.key)}</Text>
                </Pressable>
              );
            })}
          </View>
          {todayCheck?.status === 'tried' ? <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.onGreen }}>{t('triedMsg')}</Text> : null}
          {todayCheck?.status === 'missed' ? <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.onGreen }}>{t('missedMsg')}</Text> : null}
        </Card>

        {todayCheck?.status === 'help' ? (
          <Card style={{ gap: 10, borderColor: colors.accent, borderWidth: 1.5 }}>
            <Eyebrow>{t('helpTitle')}</Eyebrow>
            <Body>{tx(practice.help)}</Body>
            <Body muted style={{ fontSize: 14 }}>
              {t('facilitator')}: {tx(config.facilitatorContact)}
            </Body>
            <Button label={t('askKiu')} icon="chat-outline" variant="ghost" onPress={() => router.push('/kiu')} />
          </Card>
        ) : null}

        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fonts.bodySemi, fontSize: 16, color: colors.ink }}>{t('thisWeek')}</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.muted }}>{practiceDays === 1 ? t('practiceDay1') : t('practiceDays', { n: practiceDays })}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {days.map((d, i) => {
              const key = dayKey(d);
              const done = loggedDays.has(key);
              const isToday = key === todayKey;
              const future = d > now && !isToday;
              return (
                <View key={key} style={{ alignItems: 'center', gap: 6 }} accessible accessibilityLabel={`${d.toDateString()}: ${done ? 'practised' : 'no practice logged'}`}>
                  <Text style={{ fontFamily: isToday ? fonts.bodySemi : fonts.body, fontSize: 12, color: isToday ? colors.ink : colors.muted }}>{dayLetters[i]}</Text>
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: done ? colors.green : future ? colors.sand : 'transparent',
                      borderWidth: done || future ? 0 : isToday ? 2 : 1.5,
                      borderColor: isToday ? colors.accent : colors.outline,
                      borderStyle: isToday ? 'solid' : 'dashed',
                    }}
                  />
                </View>
              );
            })}
          </View>
          <Pressable onPress={() => router.push('/log')} accessibilityRole="button" style={{ minHeight: 40, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="plus" size={18} color={colors.accent} />
            <Text style={{ fontFamily: fonts.bodySemi, fontSize: 15, color: colors.accent }}>{t('logMore')}</Text>
          </Pressable>
        </Card>

        <Pressable onPress={() => router.push('/reflection')} accessibilityRole="button">
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: reflectionDone ? colors.sage : colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={reflectionDone ? 'check' : 'pencil-outline'} color={reflectionDone ? colors.green : colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bodySemi, fontSize: 16, color: colors.ink }}>{t('reflection')}</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.muted }}>{reflectionDone ? t('reflectionDone') : t('reflectionDue')}</Text>
            </View>
            <Icon name="chevron-right" color={colors.muted} />
          </Card>
        </Pressable>

        {nextLesson ? (
          <Card tone="sage" style={{ gap: 4 }}>
            <Eyebrow color={colors.green}>{t('nextSession')}</Eyebrow>
            <Text style={{ fontFamily: fonts.bodySemi, fontSize: 16, color: colors.ink }}>
              {t('lesson', { n: nextLesson })} · {tx(LESSONS[nextLesson - 1].title)}
            </Text>
            <Body style={{ fontSize: 14 }}>{tx(config.nextSession)}</Body>
          </Card>
        ) : null}
      </Screen>
    </View>
  );
}
