import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { config } from '@/config';
import { LESSONS } from '@/content';
import { useT } from '@/i18n';
import { dayKey, newId, programmeWeek, useStore, weekStart } from '@/store';
import { colors, fonts } from '@/theme';
import { Body, Button, Card, Eyebrow, H1, Icon, Screen } from '@/ui';

export default function Today() {
  const { data, update } = useStore();
  const { t, tx, lang } = useT();
  const now = new Date();
  const week = programmeWeek(data.profile, now);
  const lesson = LESSONS[week - 1];
  const hour = now.getHours();
  const greet = hour < 12 ? t('morning') : hour < 18 ? t('afternoon') : t('evening');

  const todayKey = dayKey(now);
  const loggedDays = new Set(data.logs.map((l) => dayKey(new Date(l.at))));
  const goalDoneToday = data.logs.some((l) => dayKey(new Date(l.at)) === todayKey && l.skills.includes(lesson.skill));

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

  function quickLog() {
    update((d) => ({ ...d, logs: [{ id: newId(), at: new Date().toISOString(), skills: [lesson.skill] }, ...d.logs] }));
  }

  return (
    <View style={{ flex: 1 }}>
      <Screen contentStyle={{ paddingBottom: 110, gap: 16 }}>
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

        <Card tone="green" style={{ borderRadius: 24, padding: 22 }}>
          <Eyebrow color={colors.peach}>{t('todayGoal')}</Eyebrow>
          <Text style={{ fontFamily: fonts.display, fontSize: 24, lineHeight: 30, color: colors.ground }}>{tx(lesson.goal)}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.onGreen }}>{tx(lesson.tip)}</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
            <Button
              label={goalDoneToday ? t('doneToday') : t('didIt')}
              icon={goalDoneToday ? 'check' : undefined}
              variant="light"
              onPress={quickLog}
              disabled={goalDoneToday}
              style={{ flex: 1, minHeight: 48 }}
            />
            <Button label={t('addDetails')} variant="outlineLight" onPress={() => router.push({ pathname: '/log', params: { skill: lesson.skill } })} style={{ flex: 1, minHeight: 48 }} />
          </View>
        </Card>

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

      <View style={{ position: 'absolute', right: 20, bottom: 20 }}>
        <Button label={t('logPractice')} icon="plus" variant="accent" onPress={() => router.push('/log')} style={{ borderRadius: 18, minHeight: 56, elevation: 4 }} />
      </View>
    </View>
  );
}
