import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SKILLS, type SkillId } from '@/content';
import { useT, type Key } from '@/i18n';
import { newId, useStore, type Outcome } from '@/store';
import { colors, fonts } from '@/theme';
import { Button, Chip, Field, H1, Icon, Screen, TopBar, styles, type IconName } from '@/ui';

const OUTCOMES: { id: Outcome; key: Key; icon: IconName }[] = [
  { id: 'hard', key: 'hard', icon: 'emoticon-sad-outline' },
  { id: 'ok', key: 'ok', icon: 'emoticon-neutral-outline' },
  { id: 'well', key: 'well', icon: 'emoticon-happy-outline' },
];

type When = 'now' | 'earlier' | 'yesterday';

export default function LogPractice() {
  const params = useLocalSearchParams<{ skill?: string }>();
  const initial = SKILLS.some((s) => s.id === params.skill) ? [params.skill as SkillId] : [];
  const { update } = useStore();
  const { t, tx } = useT();
  const [skills, setSkills] = useState<SkillId[]>(initial);
  const [outcome, setOutcome] = useState<Outcome | undefined>();
  const [note, setNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [when, setWhen] = useState<When>('now');

  function toggle(id: SkillId) {
    setSkills((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function save() {
    const at = new Date();
    if (when === 'earlier') at.setHours(Math.max(0, at.getHours() - 3));
    if (when === 'yesterday') at.setDate(at.getDate() - 1);
    update((d) => ({ ...d, logs: [{ id: newId(), at: at.toISOString(), skills, outcome, note: note.trim() || undefined }, ...d.logs] }));
    router.back();
  }

  return (
    <Screen
      edges={['top', 'bottom']}
      header={<TopBar title={t('logPractice')} onBack={() => router.back()} />}
      footer={
        <View style={{ gap: 8 }}>
          {skills.length === 0 ? <Text style={[styles.help, { textAlign: 'center' }]}>{t('pickSkill')}</Text> : null}
          <Button label={t('save')} onPress={save} disabled={skills.length === 0} />
        </View>
      }
      contentStyle={{ gap: 26 }}
    >
      <View style={{ gap: 12 }}>
        <H1 style={{ fontSize: 26, lineHeight: 31 }}>{t('whatPractised')}</H1>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {SKILLS.map((s) => (
            <Chip key={s.id} label={tx(s.label)} selected={skills.includes(s.id)} onPress={() => toggle(s.id)} />
          ))}
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text style={[styles.label, { fontSize: 16 }]}>{t('howItWent')}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {OUTCOMES.map((o) => {
            const on = outcome === o.id;
            return (
              <Pressable
                key={o.id}
                onPress={() => setOutcome(on ? undefined : o.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: on }}
                style={{ flex: 1, minHeight: 76, borderRadius: 16, borderWidth: on ? 2 : 1.5, borderColor: on ? colors.green : colors.line, backgroundColor: on ? colors.sage : colors.paper, alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <Icon name={o.icon} size={26} color={on ? colors.green : colors.ink2} />
                <Text style={{ fontFamily: on ? fonts.bodySemi : fonts.body, fontSize: 15, color: colors.ink }}>{t(o.key)}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {showNote ? (
        <Field label={`${t('whatHappened')} ${t('optional')}`} value={note} onChangeText={setNote} multiline help={t('privacyNote')} />
      ) : (
        <Pressable onPress={() => setShowNote(true)} accessibilityRole="button" style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="plus" size={18} color={colors.accent} />
          <Text style={{ fontFamily: fonts.bodySemi, fontSize: 15, color: colors.accent }}>
            {t('addNote')} {t('optional')}
          </Text>
        </Pressable>
      )}

      <View style={{ gap: 12 }}>
        <Text style={[styles.label, { fontSize: 16 }]}>{t('when')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {(['now', 'earlier', 'yesterday'] as When[]).map((w) => (
            <Chip key={w} label={t(w)} selected={when === w} onPress={() => setWhen(w)} />
          ))}
        </View>
      </View>
    </Screen>
  );
}
