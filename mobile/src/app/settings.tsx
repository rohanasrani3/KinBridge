import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import type { Lang } from '@/content';
import { useT } from '@/i18n';
import { useStore } from '@/store';
import { colors, fonts } from '@/theme';
import { Body, Button, Card, Field, H1, Screen, TopBar, styles } from '@/ui';

export default function Settings() {
  const { data, update } = useStore();
  const { t, lang } = useT();
  const [name, setName] = useState(data.profile?.name ?? '');
  const [goal, setGoal] = useState(data.profile?.goal ?? '');
  const [confirmReset, setConfirmReset] = useState(false);

  function saveProfile(patch: { name?: string; goal?: string }) {
    update((d) => (d.profile ? { ...d, profile: { ...d.profile, ...patch } } : d));
  }

  function reset() {
    if (!confirmReset) return setConfirmReset(true);
    update((d) => ({ lang: d.lang, profile: null, logs: [], reflections: [], checkins: {} }));
    router.replace('/onboarding');
  }

  return (
    <Screen edges={['top', 'bottom']} header={<TopBar title={t('settings')} icon="arrow-left" onBack={() => router.back()} />} contentStyle={{ gap: 22 }}>
      <H1>{t('settings')}</H1>

      <View style={{ gap: 10 }}>
        <Text style={styles.label}>{t('language')}</Text>
        <View style={{ flexDirection: 'row', borderWidth: 1.5, borderColor: colors.green, borderRadius: 999, overflow: 'hidden' }}>
          {(['en', 'zh'] as Lang[]).map((l) => (
            <Pressable
              key={l}
              onPress={() => update((d) => ({ ...d, lang: l }))}
              accessibilityRole="radio"
              accessibilityState={{ checked: lang === l }}
              style={{ flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: lang === l ? colors.green : 'transparent' }}
            >
              <Text style={{ fontFamily: fonts.bodySemi, fontSize: 16, color: lang === l ? colors.ground : colors.green }}>{l === 'en' ? 'English' : '中文'}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Field
        label={t('name')}
        value={name}
        onChangeText={(s) => {
          setName(s);
          if (s.trim()) saveProfile({ name: s.trim() });
        }}
      />
      <Field
        label={t('goal')}
        value={goal}
        onChangeText={(s) => {
          setGoal(s);
          saveProfile({ goal: s.trim() });
        }}
        multiline
      />

      <Card tone="sage" style={{ gap: 8 }}>
        <Text style={{ fontFamily: fonts.bodySemi, fontSize: 16, color: colors.ink }}>{t('support')}</Text>
        <Body style={{ fontSize: 15 }}>{t('safety')}</Body>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button label="999" icon="phone" onPress={() => Linking.openURL('tel:999')} style={{ flex: 1 }} />
          <Button label="18111" icon="phone" variant="ghost" onPress={() => Linking.openURL('tel:18111')} style={{ flex: 1 }} />
        </View>
      </Card>

      <View style={{ gap: 10 }}>
        <Body muted style={{ fontSize: 14 }}>
          {t('dataNote')}
        </Body>
        <Button label={confirmReset ? t('resetConfirm') : t('resetData')} variant="ghost" onPress={reset} style={confirmReset ? { borderColor: colors.accent } : undefined} />
      </View>
    </Screen>
  );
}
