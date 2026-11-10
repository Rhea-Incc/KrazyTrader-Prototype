import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton, MembershipStatusIndicator, PageHeader, Panel, SaccoCard, Screen, SectionHeader } from '@/components/ui';
import { demoMembership, demoRider, demoSaccos } from '@/data/demo';
import { useColors } from '@/hooks/useColors';
import { formatShortDate } from '@/utils/format';

export default function MembershipScreen() {
  const colors = useColors();
  const currentSacco = demoSaccos.find((sacco) => sacco.id === demoMembership.saccoId) ?? demoSaccos[0];
  return (
    <Screen>
      <PageHeader title="Membership" subtitle="Your cooperative connection" rightIcon="bell" onRightPress={() => router.push('/notifications')} />
      <Panel style={styles.statusPanel}>
        <View style={styles.statusHeading}>
          <View style={[styles.statusIcon, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.statusInitial, { color: colors.primary }]}>M</Text>
          </View>
          <View style={styles.statusCopy}>
            <Text style={[styles.panelTitle, { color: colors.foreground }]}>Membership status</Text>
            <Text style={[styles.panelMeta, { color: colors.mutedForeground }]}>{currentSacco.name}</Text>
          </View>
          <MembershipStatusIndicator status={demoMembership.status} />
        </View>
        <View style={[styles.infoStrip, { backgroundColor: colors.warningSoft }]}>
          <Text style={[styles.infoText, { color: colors.warning }]}>
            Your demo membership is under review. No contributions or payments are collected in this prototype.
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={[styles.panelMeta, { color: colors.mutedForeground }]}>Request date</Text>
          <Text style={[styles.metaValue, { color: colors.foreground }]}>{formatShortDate(demoMembership.joinedAt)}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={[styles.panelMeta, { color: colors.mutedForeground }]}>Rider</Text>
          <Text style={[styles.metaValue, { color: colors.foreground }]}>{demoRider.firstName} {demoRider.lastName}</Text>
        </View>
      </Panel>
      <View style={styles.section}>
        <SectionHeader title="SACCO network" />
        <Text style={[styles.sectionIntro, { color: colors.mutedForeground }]}>
          Explore fictional cooperative profiles to see how the membership route will work.
        </Text>
        {demoSaccos.map((sacco) => (
          <SaccoCard
            key={sacco.id}
            name={sacco.name}
            location={`${sacco.town}, ${sacco.county}`}
            memberCount={sacco.memberCount}
            description={sacco.description}
            onPress={() => router.push({ pathname: '/details/[kind]', params: { kind: 'sacco', id: sacco.id } })}
          />
        ))}
      </View>
      <ActionButton title="Start registration preview" icon="arrow-right" onPress={() => router.push('/registration')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusPanel: { gap: 15 },
  statusHeading: { flexDirection: 'row', alignItems: 'center', gap: 11, flexWrap: 'wrap' },
  statusIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statusInitial: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  statusCopy: { flex: 1, minWidth: 120, gap: 3 },
  panelTitle: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  panelMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  infoStrip: { borderRadius: 12, padding: 12 },
  infoText: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  metaValue: { fontFamily: 'Inter_600SemiBold', fontSize: 12, textAlign: 'right' },
  section: { gap: 11 },
  sectionIntro: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
});
