import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { ActionButton, PageHeader, Panel, Screen } from '@/components/ui';

export function FeaturePlaceholder({
  title,
  subtitle,
  icon,
  detail,
  actionLabel,
  actionRoute,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  detail: string;
  actionLabel: string;
  actionRoute: '/membership' | '/vehicles' | '/benefits' | '/profile' | '/support';
}) {
  const colors = useColors();
  return (
    <Screen>
      <PageHeader title={title} subtitle={subtitle} back={() => router.back()} />
      <View style={styles.content}>
        <Panel style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: colors.secondary }]}>
            <Feather name={icon} size={28} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
          <Text style={[styles.copy, { color: colors.mutedForeground }]}>{detail}</Text>
          <View style={[styles.phaseTag, { backgroundColor: colors.warningSoft }]}>
            <Feather name="layers" size={14} color={colors.warning} />
            <Text style={[styles.phaseText, { color: colors.warning }]}>Foundation preview</Text>
          </View>
        </Panel>
        <ActionButton title={actionLabel} icon="arrow-right" onPress={() => router.push(actionRoute)} />
        <Text style={[styles.note, { color: colors.mutedForeground }]}>
          This screen confirms the navigation path. No real application or transaction is submitted.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', gap: 16, paddingBottom: 34 },
  featureCard: { alignItems: 'flex-start', padding: 22, gap: 14 },
  featureIcon: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 22, lineHeight: 29 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23 },
  phaseTag: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 7 },
  phaseText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  note: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
