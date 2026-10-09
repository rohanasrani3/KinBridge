import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, radius } from './theme';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export function Icon({ name, size = 22, color = colors.ink }: { name: IconName; size?: number; color?: string }) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}

export function BridgeLogo({ size = 34, color = colors.green }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round">
      <Path d="M3 20H33" />
      <Path d="M7 20Q18 6 29 20" />
      <Path d="M7 20V29M29 20V29" />
      <Path d="M12.5 14.8V20M18 13V20M23.5 14.8V20" />
    </Svg>
  );
}

// A full screen: safe-area aware, scrolls by default, optional fixed footer.
export function Screen({
  children,
  footer,
  header,
  scroll = true,
  bg = colors.ground,
  contentStyle,
  edges = ['top'],
}: {
  children: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  scroll?: boolean;
  bg?: string;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: ('top' | 'bottom')[];
}) {
  const body = scroll ? (
    <ScrollView contentContainerStyle={[styles.content, contentStyle]} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, { flex: 1 }, contentStyle]}>{children}</View>
  );
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: bg }}>
      {header}
      {body}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

export function TopBar({ title, onBack, icon = 'close', right }: { title: string; onBack: () => void; icon?: 'close' | 'arrow-left'; right?: ReactNode }) {
  return (
    <View style={styles.topBar}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel={icon === 'close' ? 'Close' : 'Back'} style={styles.iconBtn} hitSlop={4}>
        <Icon name={icon} size={24} />
      </Pressable>
      <Text style={styles.topTitle} numberOfLines={1}>
        {title}
      </Text>
      {right}
    </View>
  );
}

export function H1({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return (
    <Text accessibilityRole="header" style={[styles.h1, style]}>
      {children}
    </Text>
  );
}

export function Eyebrow({ children, color = colors.accent }: { children: ReactNode; color?: string }) {
  return <Text style={[styles.eyebrow, { color }]}>{children}</Text>;
}

export function Body({ children, style, muted }: { children: ReactNode; style?: StyleProp<TextStyle>; muted?: boolean }) {
  return <Text style={[styles.body, muted && { color: colors.muted }, style]}>{children}</Text>;
}

export function Card({ children, style, tone = 'paper' }: { children: ReactNode; style?: StyleProp<ViewStyle>; tone?: 'paper' | 'green' | 'sage' }) {
  return <View style={[styles.card, tone === 'green' && styles.cardGreen, tone === 'sage' && styles.cardSage, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  icon,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'light' | 'outlineLight' | 'accent';
  disabled?: boolean;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}) {
  const v = buttonVariants[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [styles.button, v.box, disabled && { opacity: 0.45 }, pressed && { opacity: 0.85 }, style]}
    >
      {icon ? <Icon name={icon} size={20} color={v.text.color as string} /> : null}
      <Text style={[styles.buttonText, v.text]}>{label}</Text>
    </Pressable>
  );
}

const buttonVariants: Record<string, { box: ViewStyle; text: TextStyle }> = {
  primary: { box: { backgroundColor: colors.green }, text: { color: colors.ground } },
  accent: { box: { backgroundColor: colors.accent }, text: { color: colors.paper } },
  ghost: { box: { borderWidth: 1.5, borderColor: colors.ink }, text: { color: colors.ink } },
  light: { box: { backgroundColor: colors.ground }, text: { color: colors.ink } },
  outlineLight: { box: { borderWidth: 1.5, borderColor: colors.onGreen }, text: { color: colors.ground } },
};

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={[styles.chip, selected && styles.chipOn]}
    >
      {selected ? <Icon name="check" size={18} color={colors.ground} /> : null}
      <Text style={[styles.chipText, selected && { color: colors.ground, fontFamily: fonts.bodyMedium }]}>{label}</Text>
    </Pressable>
  );
}

export function Choice({ label, sub, selected, onPress }: { label: string; sub?: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: selected }} style={[styles.choice, selected && styles.choiceOn]}>
      <View style={[styles.radio, selected && styles.radioOn]}>{selected ? <View style={styles.radioDot} /> : null}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.choiceText, selected && { fontFamily: fonts.bodySemi }]}>{label}</Text>
        {sub ? <Text style={styles.choiceSub}>{sub}</Text> : null}
      </View>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  help,
  multiline,
  placeholder,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (s: string) => void;
  help?: string;
  multiline?: boolean;
  placeholder?: string;
  autoCapitalize?: 'none' | 'characters' | 'sentences' | 'words';
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        accessibilityLabel={label}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        style={[styles.input, multiline && { minHeight: 110, paddingTop: 14, textAlignVertical: 'top' }]}
      />
      {help ? <Text style={styles.help}>{help}</Text> : null}
    </View>
  );
}

export function Bar({ value, color = colors.accent, track = colors.line, height = 6 }: { value: number; color?: string; track?: string; height?: number }) {
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: track, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: '100%', borderRadius: height / 2, backgroundColor: color }} />
    </View>
  );
}

export const styles = StyleSheet.create({
  content: { padding: 20, gap: 18, paddingBottom: 32 },
  footer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.ground },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingTop: 8, minHeight: 56 },
  iconBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, fontFamily: fonts.bodySemi, fontSize: 18, color: colors.ink },
  h1: { fontFamily: fonts.display, fontSize: 29, lineHeight: 34, color: colors.ink },
  eyebrow: { fontFamily: fonts.bodySemi, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.ink2 },
  card: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: radius.card, padding: 18, gap: 10 },
  cardGreen: { backgroundColor: colors.green, borderColor: colors.green },
  cardSage: { backgroundColor: colors.sage, borderColor: colors.sage },
  button: { minHeight: 54, borderRadius: radius.pill, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { fontFamily: fonts.bodySemi, fontSize: 16 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.outline, backgroundColor: colors.paper },
  chipOn: { backgroundColor: colors.green, borderColor: colors.green },
  chipText: { fontFamily: fonts.body, fontSize: 15, color: colors.ink },
  choice: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 58, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.paper },
  choiceOn: { borderWidth: 2, borderColor: colors.green, backgroundColor: colors.sage },
  choiceText: { fontFamily: fonts.body, fontSize: 16, color: colors.ink },
  choiceSub: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.outline, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: colors.green },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.green },
  label: { fontFamily: fonts.bodySemi, fontSize: 15, color: colors.ink },
  input: { minHeight: 54, paddingHorizontal: 16, borderRadius: radius.field, borderWidth: 1.5, borderColor: colors.outline, backgroundColor: colors.paper, color: colors.ink, fontFamily: fonts.body, fontSize: 16 },
  help: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
});
