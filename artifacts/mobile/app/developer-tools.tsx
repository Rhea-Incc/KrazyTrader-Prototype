import { Feather } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton, ConfirmDialog, PageHeader, Panel, Screen } from '@/components/ui';
import { useDemoApp } from '@/context/DemoAppContext';
import { useColors } from '@/hooks/useColors';
import type { MembershipStatus } from '@/types/domain';

const states: { value: MembershipStatus | null; label: string; detail: string }[] = [
  { value: null, label: 'No application', detail: 'New rider without a SACCO request' },
  { value: 'Submitted', label: 'Submitted', detail: 'Request saved, not yet reviewed' },
  { value: 'Pending verification', label: 'Pending verification', detail: 'Waiting for a demo review' },
  { value: 'Active', label: 'Active', detail: 'Member-only demo services enabled' },
  { value: 'Rejected', label: 'Rejected', detail: 'Shows re-application guidance' },
  { value: 'Inactive', label: 'Inactive', detail: 'Shows SACCO follow-up guidance' },
];

export default function DeveloperToolsScreen() {
  const colors = useColors();
  const { membership, setMembershipStatus, resetDemoData } = useDemoApp();
  const [confirmReset, setConfirmReset] = useState(false);
  if (!__DEV__) return <Redirect href="/(tabs)/profile" />;

  return (
    <Screen>
      <PageHeader title="Developer controls" subtitle="Local test states only" back={() => router.back()} />
      <Panel style={[styles.notice, { backgroundColor: colors.warningSoft, borderColor: colors.warningSoft }]}>
        <Feather name="tool" size={18} color={colors.warning} />
        <Text style={[styles.noticeText, { color: colors.warning }]}>
          These test controls are not part of the rider experience. They change only the local prototype state.
        </Text>
      </Panel>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Membership state</Text>
      <View style={styles.states}>
        {states.map((item) => {
          const selected = membership?.status === item.value || (!membership && item.value === null);
          return (
            <ActionButton
              key={item.label}
              title={`${selected ? '✓ ' : ''}${item.label}`}
              variant={selected ? 'primary' : 'secondary'}
              onPress={() => setMembershipStatus(item.value)}
              testID={`dev-state-${item.value?.toLowerCase().replaceAll(' ', '-') ?? 'none'}`}
            />
          );
        })}
      </View>
      {membership ? (
        <Text style={[styles.current, { color: colors.mutedForeground }]}>
          Current state: {membership.status} · {membership.applicationNumber}
        </Text>
      ) : (
        <Text style={[styles.current, { color: colors.mutedForeground }]}>Current state: no application</Text>
      )}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Reset demo account</Text>
      <Text style={[styles.resetCopy, { color: colors.mutedForeground }]}>
        Clears the saved rider, application, preferences and financing requests on this device, then returns to the logged-out welcome screen.
      </Text>
      <ActionButton title="Reset local demo data" variant="secondary" icon="trash-2" onPress={() => setConfirmReset(true)} />
      <ConfirmDialog
        visible={confirmReset}
        title="Reset this demo account?"
        message="This clears the saved prototype state on this device. It cannot be undone."
        confirmLabel="Reset demo"
        onConfirm={() => {
          resetDemoData();
          setConfirmReset(false);
          router.replace('/welcome');
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, padding: 14 },
  noticeText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  states: { gap: 8 },
  current: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 5 },
  resetCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20 },
});
