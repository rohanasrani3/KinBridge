import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Linking, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useT } from '@/i18n';
import { ACTION_LABELS, bridgePost, initialContext, respond, type KiuAction, type KiuContext, type KiuMessage, type KiuState } from '@/kiu';
import { MEASURES, MEASURE_ORDER, currentPhase, isComplete } from '@/measures';
import { newId, programmeWeek, useStore } from '@/store';
import { colors, fonts } from '@/theme';
import { BridgeLogo, Icon } from '@/ui';

export default function Kiu() {
  const { data, update } = useStore();
  const { tx, lang } = useT();
  const week = programmeWeek(data.profile);
  const { phase, open } = currentPhase(data.checkins, week);
  const state: KiuState = {
    lang,
    name: data.profile?.name ?? '',
    week,
    planksLaid: data.logs.length,
    reflectionDone: data.reflections.some((r) => r.week === week),
    checkinOpen: open && !MEASURE_ORDER.every((id) => isComplete(MEASURES[id], data.checkins[phase]?.[id])),
  };

  const [messages, setMessages] = useState<KiuMessage[]>(() => [bridgePost(state)]);
  const [ctx, setCtx] = useState<KiuContext>(() => initialContext(week));
  const [chips, setChips] = useState<keyof typeof ACTION_LABELS.chips>('post');
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const scroll = useRef<ScrollView>(null);

  function send(textIn: string) {
    const text = textIn.trim();
    if (!text || typing) return;
    setInput('');
    setMessages((m) => [...m, { id: newId(), who: 'me', text }]);
    const reply = respond(text, ctx, state);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, ...reply.messages]);
      setCtx(reply.ctx);
      setChips(reply.chips);
      const effect = reply.effect;
      if (effect?.type === 'log') update((d) => ({ ...d, logs: [{ id: newId(), at: new Date().toISOString(), skills: [effect.skill] }, ...d.logs] }));
      if (effect?.type === 'lang') update((d) => ({ ...d, lang: effect.lang }));
    }, 650);
  }

  function act(a: KiuAction) {
    if (a.route.startsWith('tel:')) Linking.openURL(a.route);
    else router.push({ pathname: a.route as never, params: a.params });
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.green }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.green2, alignItems: 'center', justifyContent: 'center' }}>
          <BridgeLogo size={28} color={colors.ground} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bodySemi, fontSize: 17, color: colors.ground }}>{lang === 'zh' ? '橋仔 · 親橋週報' : 'Kiu · Bridge Post'}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.onGreen }}>{lang === 'zh' ? '友善小機械人，唔係輔導員' : 'A friendly bot, not a counsellor'}</Text>
        </View>
      </View>

      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: colors.sand }}>
        <ScrollView ref={scroll} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })} contentContainerStyle={{ padding: 14, gap: 10 }}>
          {messages.map((m) => (
            <View key={m.id} style={{ alignSelf: m.who === 'me' ? 'flex-end' : 'flex-start', maxWidth: '90%', gap: 8 }}>
              <View
                style={
                  m.who === 'me'
                    ? { backgroundColor: colors.green, borderRadius: 16, borderBottomRightRadius: 4, paddingVertical: 10, paddingHorizontal: 16 }
                    : { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: 16, borderBottomLeftRadius: 4, paddingVertical: 12, paddingHorizontal: 14 }
                }
              >
                <Text selectable style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: m.who === 'me' ? colors.ground : colors.ink }}>
                  {m.text}
                </Text>
              </View>
              {m.actions?.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {m.actions.map((a) => (
                    <Pressable key={a.route} onPress={() => act(a)} accessibilityRole="button" style={{ minHeight: 40, paddingHorizontal: 16, borderRadius: 999, backgroundColor: colors.green, justifyContent: 'center' }}>
                      <Text style={{ fontFamily: fonts.bodySemi, fontSize: 14, color: colors.ground }}>{tx(a.label)}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
          {typing ? (
            <View style={{ alignSelf: 'flex-start', backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 16 }}>
              <Text style={{ color: colors.muted, letterSpacing: 3 }}>•••</Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 14, paddingBottom: 10 }}>
          {ACTION_LABELS.chips[chips][lang].map((c) => (
            <Pressable key={c} onPress={() => send(c)} accessibilityRole="button" style={{ minHeight: 40, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1.5, borderColor: colors.green, backgroundColor: colors.paper, justifyContent: 'center' }}>
              <Text style={{ fontFamily: fonts.bodySemi, fontSize: 14, color: colors.green }}>{c}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, padding: 10, backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.line }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
            placeholder={lang === 'zh' ? '回覆橋仔…' : 'Reply to Kiu…'}
            placeholderTextColor={colors.muted}
            accessibilityLabel={lang === 'zh' ? '回覆橋仔' : 'Reply to Kiu'}
            maxLength={300}
            style={{ flex: 1, minHeight: 48, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.ground, color: colors.ink, fontFamily: fonts.body, fontSize: 16 }}
          />
          <Pressable
            onPress={() => send(input)}
            accessibilityRole="button"
            accessibilityLabel={lang === 'zh' ? '傳送' : 'Send'}
            style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="arrow-right" color={colors.ground} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
