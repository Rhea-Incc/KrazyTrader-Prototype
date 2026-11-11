import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton, BrandMark, Panel, Screen } from '@/components/ui';
import { useDemoApp } from '@/context/DemoAppContext';
import { useColors } from '@/hooks/useColors';

export default function WelcomeScreen() {
  const colors = useColors();
  const { registrationDraft, persistenceWarning } = useDemoApp();
  const hasDraft = registrationDraft.fullName.length > 0 || registrationDraft.phone.length > 0;

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.topLine}>
        <View style={styles.brand}>
          <BrandMark size={48} />
          <Text style={[styles.brandName, { color: colors.foreground }]}>KrazyTrader</Text>
        </View>
        <View style={[styles.demoPill, { backgroundColor: colors.warningSoft }]}>
          <View style={[styles.demoDot, { backgroundColor: colors.warning }]} />
          <Text style={[styles.demoLabel, { color: colors.warning }]}>DEMO</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>BUILT FOR THE PEOPLE WHO KEEP KENYA MOVING</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Your rider network starts here.</Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]}>
          Connect with a local SACCO and explore the support, vehicle options and services built around your work.
        </Text>
        <View style={styles.pillars}>
          <Pillar icon="users" label="SACCO connection" />
          <Pillar icon="truck" label="Vehicle options" />
          <Pillar icon="shield" label="Rider support" />
        </View>
      </View>

      <Panel style={styles.disclaimer}>
        <View style={[styles.infoIcon, { backgroundColor: colors.secondary }]}>
          <Feather name="info" size={17} color={colors.primary} />
        </View>
        <View style={styles.disclaimerCopy}>
          <Text style={[styles.disclaimerTitle, { color: colors.foreground }]}>Prototype demo</Text>
          <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
            Demo sign-in and application details stay on this device. No SMS, SACCO, lender or identity service is connected.
          </Text>
        </View>
      </Panel>

      <View style={styles.actions}>
        <ActionButton title="Log in" icon="arrow-right" onPress={() => router.push('/login')} testID="welcome-login" />
        <ActionButton title="Create rider account" variant="secondary" icon="user-plus" onPress={() => router.push('/registration')} testID="welcome-register" />
        {hasDraft ? (
          <ActionButton title="Resume your application" variant="quiet" icon="rotate-ccw" onPress={() => router.push('/registration')} />
        ) : null}
      </View>
      {persistenceWarning ? (
        <Text style={[styles.warning, { color: colors.destructive }]}>{persistenceWarning}</Text>
      ) : null}
      <Text style={[styles.footer, { color: colors.mutedForeground }]}>
        For demonstration only · No real membership or financing decision is made
      </Text>
    </Screen>
  );
}

function Pillar({ icon, label }: { icon: 'users' | 'truck' | 'shield'; label: string }) {
  const colors = useColors();
  return (
    <View style={styles.pillar}>
      <View style={[styles.pillarIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <Text style={[styles.pillarText, { color: colors.foreground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'space-between', paddingTop: 22, gap: 22 },
  topLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandName: { fontFamily: 'Inter_700Bold', fontSize: 19 },
  demoPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 30 },
  demoDot: { width: 6, height: 6, borderRadius: 4 },
  demoLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1 },
  hero: { gap: 14, paddingTop: 18 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.15, lineHeight: 16 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 34, lineHeight: 41, maxWidth: 330 },
  description: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23 },
  pillars: { gap: 10, paddingTop: 4 },
  pillar: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 36 },
  pillarIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pillarText: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  disclaimer: { flexDirection: 'row', gap: 11, alignItems: 'flex-start', padding: 14 },
  infoIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  disclaimerCopy: { flex: 1, gap: 4 },
  disclaimerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  disclaimerText: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  actions: { gap: 10 },
  warning: { fontFamily: 'Inter_500Medium', fontSize: 12, textAlign: 'center' },
  footer: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17, textAlign: 'center' },
});
