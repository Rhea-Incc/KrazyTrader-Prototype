import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ActionButton,
  BrandMark,
  MembershipStatusIndicator,
  PageHeader,
  Panel,
  SaccoCard,
  Screen,
  SectionHeader,
  StatePanel,
} from '@/components/ui';
import { useDemoApp } from '@/context/DemoAppContext';
import { demoSaccos } from '@/data/demo';
import { useColors } from '@/hooks/useColors';
import { formatShortDate } from '@/utils/format';

export default function MembershipScreen() {
  const colors = useColors();
  const { rider, membership } = useDemoApp();
  const sacco = demoSaccos.find((item) => item.id === membership?.saccoId);
  const isActive = membership?.status === 'Active';

  return (
    <Screen>
      <PageHeader title="Membership" subtitle="Your cooperative connection" rightIcon="bell" onRightPress={() => router.push('/notifications')} />
      {!membership ? (
        <>
          <StatePanel
            variant="empty"
            title="No membership application yet"
            message="Choose a local sample SACCO and follow your application status here."
          />
          <ActionButton title="Start rider registration" icon="arrow-right" onPress={() => router.push('/registration')} />
          <SectionHeader title="SACCO affiliation demo" />
          <Text style={[styles.intro, { color: colors.mutedForeground }]}>
            Registration includes a searchable list of fictional SACCOs. The selected association remains connected to your local application.
          </Text>
          {demoSaccos.map((item) => (
            <SaccoCard
              key={item.id}
              name={item.name}
              location={`${item.town}, ${item.county}`}
              memberCount={item.memberCount}
              description={item.description}
              onPress={() => router.push({ pathname: '/details/[kind]', params: { kind: 'sacco', id: item.id } })}
            />
          ))}
        </>
      ) : (
        <>
          <Panel style={[styles.memberCard, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
            <View style={styles.cardTop}>
              <View style={styles.cardBrand}>
                <View style={[styles.logoBacking, { backgroundColor: colors.primaryForeground }]}>
                  <BrandMark size={31} />
                </View>
                <View>
                  <Text style={[styles.cardBrandName, { color: colors.primaryForeground }]}>KrazyTrader</Text>
                  <Text style={[styles.cardBrandCaption, { color: colors.primaryForeground }]}>RIDER MEMBERSHIP CARD</Text>
                </View>
              </View>
              <Feather name="shield" size={20} color={colors.accent} />
            </View>
            <View style={styles.cardRider}>
              <Text style={[styles.riderName, { color: colors.primaryForeground }]}>{rider?.firstName} {rider?.lastName}</Text>
              <Text style={[styles.cardSacco, { color: colors.primaryForeground }]}>{sacco?.name ?? 'SACCO affiliation'}</Text>
            </View>
            <View style={styles.cardBottom}>
              <View>
                <Text style={[styles.cardLabel, { color: colors.primaryForeground }]}>
                  {isActive ? 'MEMBER NUMBER' : 'APPLICATION NUMBER'}
                </Text>
                <Text style={[styles.cardNumber, { color: colors.primaryForeground }]}>
                  {isActive ? membership.memberNumber : membership.applicationNumber}
                </Text>
              </View>
              <MembershipStatusIndicator status={membership.status} />
            </View>
          </Panel>

          <Panel style={styles.statusPanel}>
            <View style={styles.statusTitleRow}>
              <View style={[styles.statusIcon, { backgroundColor: isActive ? colors.successSoft : colors.warningSoft }]}>
                <Feather name={isActive ? 'check-circle' : 'clock'} size={19} color={isActive ? colors.success : colors.warning} />
              </View>
              <View style={styles.statusCopy}>
                <Text style={[styles.panelTitle, { color: colors.foreground }]}>{statusTitle(membership.status)}</Text>
                <Text style={[styles.panelMeta, { color: colors.mutedForeground }]}>{sacco?.name ?? 'Selected SACCO'}</Text>
              </View>
              <MembershipStatusIndicator status={membership.status} />
            </View>
            <View style={[styles.infoStrip, { backgroundColor: isActive ? colors.successSoft : colors.warningSoft }]}>
              <Text style={[styles.infoText, { color: isActive ? colors.success : colors.warning }]}>
                {statusMessage(membership.status)}
              </Text>
            </View>
            <InfoRow label="Application date" value={formatShortDate(membership.joinedAt)} />
            <InfoRow label="Verification" value={membership.verificationStatus ?? 'Not verified'} />
            {sacco ? <InfoRow label="SACCO location" value={`${sacco.town}, ${sacco.county}`} /> : null}
            {isActive ? <InfoRow label="Member since" value={formatShortDate(membership.updatedAt)} /> : null}
          </Panel>

          <View style={styles.section}>
            <SectionHeader title="Next steps" />
            {nextSteps(membership.status).map((text, index) => (
              <View key={text} style={styles.nextStep}>
                <View style={[styles.stepDot, { backgroundColor: index === 0 ? colors.accent : colors.secondary }]}>
                  <Text style={[styles.stepDotText, { color: colors.foreground }]}>{index + 1}</Text>
                </View>
                <Text style={[styles.nextStepText, { color: colors.foreground }]}>{text}</Text>
              </View>
            ))}
          </View>

          {membership.status === 'Rejected' ? (
            <ActionButton title="Start a new demo application" icon="refresh-cw" onPress={() => router.push('/registration')} />
          ) : isActive ? (
            <ActionButton title="Explore member benefits" icon="gift" onPress={() => router.push('/benefits')} />
          ) : null}
        </>
      )}
      <Text style={[styles.footnote, { color: colors.mutedForeground }]}>
        This is a local prototype. Submission is not approval, and no real verification or SACCO system is connected.
      </Text>
    </Screen>
  );
}

function statusTitle(status: NonNullable<ReturnType<typeof useDemoApp>['membership']>['status']) {
  if (status === 'Submitted') return 'Application submitted';
  if (status === 'Pending verification') return 'Pending verification';
  if (status === 'Active') return 'Active membership';
  if (status === 'Rejected') return 'Application not approved';
  return 'Membership inactive';
}

function statusMessage(status: NonNullable<ReturnType<typeof useDemoApp>['membership']>['status']) {
  if (status === 'Submitted') return 'Your application is saved and submitted. The SACCO has not reviewed it yet.';
  if (status === 'Pending verification') return 'This demo application is awaiting review. No identity checks are being performed.';
  if (status === 'Active') return 'Your demo membership is active. Member-only services are now available in the prototype.';
  if (status === 'Rejected') return 'This sample request was not approved. Review the details and contact the SACCO in a real process.';
  return 'This sample membership is inactive. Contact the SACCO for real-world next steps.';
}

function nextSteps(status: NonNullable<ReturnType<typeof useDemoApp>['membership']>['status']) {
  if (status === 'Submitted') return ['Wait for the SACCO to review the submitted request.', 'Check this screen for a status update.'];
  if (status === 'Pending verification') return ['The SACCO review is pending in this demo.', 'No documents or identity details will be verified.'];
  if (status === 'Active') return ['View your digital membership card when needed.', 'Explore services marked available to active members.'];
  if (status === 'Rejected') return ['Review your application details.', 'Start another demo application or ask the SACCO about a real application.'];
  return ['Contact your SACCO about the inactive status.', 'A real reactivation process is not available in this prototype.'];
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.panelMeta, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.metaValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  memberCard: { minHeight: 220, padding: 19, gap: 21, borderRadius: 21 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBrand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  logoBacking: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  cardBrandName: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  cardBrandCaption: { fontFamily: 'Inter_600SemiBold', fontSize: 8, letterSpacing: 1, opacity: 0.74, marginTop: 2 },
  cardRider: { gap: 3 },
  riderName: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  cardSacco: { fontFamily: 'Inter_400Regular', fontSize: 12, opacity: 0.83 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 },
  cardLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1, opacity: 0.75 },
  cardNumber: { fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 4 },
  statusPanel: { gap: 15 },
  statusTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  statusIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  statusCopy: { flex: 1, minWidth: 110, gap: 3 },
  panelTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  panelMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  infoStrip: { borderRadius: 12, padding: 12 },
  infoText: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  metaValue: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 12, textAlign: 'right' },
  section: { gap: 12 },
  nextStep: { flexDirection: 'row', alignItems: 'center', gap: 11, minHeight: 38 },
  stepDot: { width: 25, height: 25, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  stepDotText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  nextStepText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18 },
  intro: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20 },
  footnote: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center', lineHeight: 17, paddingTop: 2 },
});
