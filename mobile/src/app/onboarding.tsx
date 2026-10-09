import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { config } from '@/config';
import type { Lang } from '@/content';
import { useT } from '@/i18n';
import { useStore } from '@/store';
import { colors, fonts } from '@/theme';
import { BridgeLogo, Body, Button, Field, H1, Screen, styles } from '@/ui';

export default function Onboarding() {
  const { update } = useStore();
  const { t, lang } = useT();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [goal, setGoal] = useState('');

  // TODO: verify the code against the enrolment list once there is a backend.
  const canContinue = name.trim().length > 0 && code.trim().length >= 4;

  function setLang(l: Lang) {
    update((d) => ({ ...d, lang: l }));
  }

  function finish() {
    update((d) => ({
      ...d,
      profile: { name: name.trim(), code: code.trim().toUpperCase(), goal: goal.trim(), startedAt: new Date().toISOString() },
    }));
    router.replace('/today');
  }

  return (
    <Screen
      edges={['top', 'bottom']}
      contentStyle={{ paddingTop: 32, gap: 24 }}
      footer={
        <View style={{ gap: 14 }}>
          <Button label={t('continue')} onPress={finish} disabled={!canContinue} />
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(config.intakeFormUrl)} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', color: colors.accent, fontFamily: fonts.bodyMedium, fontSize: 15 }}>{t('notEnrolled')}</Text>
          </Pressable>
        </View>
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
          <BridgeLogo size={34} color={colors.ground} />
        </View>
        <Text style={{ fontFamily: fonts.displayBold, fontSize: 26, color: colors.ink }}>KinBridge</Text>
        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.green }}>親橋</Text>
      </View>

      <View style={{ gap: 12 }}>
        <H1 style={{ fontSize: 34, lineHeight: 39 }}>{t('welcomeTitle')}</H1>
        <Body>{t('welcomeBody')}</Body>
      </View>

      <View style={{ gap: 10 }}>
        <Text style={styles.label}>{t('language')}</Text>
        <View style={{ flexDirection: 'row', borderWidth: 1.5, borderColor: colors.green, borderRadius: 999, overflow: 'hidden' }}>
          {(['en', 'zh'] as Lang[]).map((l) => (
            <Pressable
              key={l}
              onPress={() => setLang(l)}
              accessibilityRole="radio"
              accessibilityState={{ checked: lang === l }}
              style={{ flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: lang === l ? colors.green : 'transparent' }}
            >
              <Text style={{ fontFamily: fonts.bodySemi, fontSize: 16, color: lang === l ? colors.ground : colors.green }}>{l === 'en' ? 'English' : '中文'}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Field label={t('name')} value={name} onChangeText={setName} autoCapitalize="words" />
      <Field label={t('code')} value={code} onChangeText={setCode} help={t('codeHelp')} placeholder="KB-" autoCapitalize="characters" />
      <Field label={t('goal')} value={goal} onChangeText={setGoal} help={t('goalHelp')} multiline />

      <Body muted style={{ fontSize: 13, lineHeight: 19 }}>
        {t('safety')}
      </Body>
    </Screen>
  );
}
