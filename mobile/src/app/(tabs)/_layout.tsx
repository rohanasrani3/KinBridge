import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useT } from '@/i18n';
import { colors, fonts } from '@/theme';
import { Icon, type IconName } from '@/ui';

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return (
    <View style={{ width: 64, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? colors.sageStrong : 'transparent' }}>
      <Icon name={name} size={22} color={focused ? colors.ink : colors.muted} />
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useT();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.line, height: 80, paddingTop: 8, paddingBottom: 12 },
        tabBarLabelStyle: { fontFamily: fonts.bodySemi, fontSize: 12, marginTop: 4 },
        sceneStyle: { backgroundColor: colors.ground },
      }}
    >
      <Tabs.Screen name="today" options={{ title: t('tabToday'), tabBarIcon: ({ focused }) => <TabIcon name="white-balance-sunny" focused={focused} /> }} />
      <Tabs.Screen name="practice" options={{ title: t('tabPractice'), tabBarIcon: ({ focused }) => <TabIcon name="clipboard-check-outline" focused={focused} /> }} />
      <Tabs.Screen name="progress" options={{ title: t('tabProgress'), tabBarIcon: ({ focused }) => <TabIcon name="chart-bar" focused={focused} /> }} />
      <Tabs.Screen name="kiu" options={{ title: t('tabKiu'), tabBarIcon: ({ focused }) => <TabIcon name="chat-outline" focused={focused} /> }} />
    </Tabs>
  );
}
