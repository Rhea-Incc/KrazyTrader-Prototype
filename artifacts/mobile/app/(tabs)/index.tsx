import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  ActionButton,
  BenefitCard,
  BrandMark,
  MembershipStatusIndicator,
  Panel,
  Screen,
  SectionHeader,
} from '@/components/ui';
import { useDemoApp } from '@/context/DemoAppContext';
import { demoBenefits, demoPartners, demoSaccos } from '@/data/demo';
import { useColors } from '@/hooks/useColors';
import { formatShortDate } from '@/utils/format';

const quickLinks = [
  { label: 'Vehicles', detail: 'Browse sample listings', icon: 'truck' as const, route: '/vehicles' as const },
  { label: 'Financing', detail: 'Try the local demo flow', icon: 'credit-card' as const, route: '/financing' as const },
  { label: 'Member benefits', detail: 'Available after approval', icon: 'gift' as const, route: '/benefits' as const, membersOnly: true },
  { label: 'Insurance & safety', detail: 'Member service preview', icon: 'shield' as const, route: '/insurance' as const, membersOnly: true },
];

export default function HomeScreen() {
  const colors = useColors();
  const { rider, membership, notifications } = useDemoApp();
  const unreadCount = notifications.filter((item) => !item.read).length;
  const isActive = membership?.status === 'Active';
  const sacco = demoSaccos.find((item) => item.id === membership?.saccoId);
  const partner = demoPartners.find((item) => item.id === demoBenefits[0].partnerId);
  const firstName = rider?.firstName ?? 'Rider';

  return (
    <Screen>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <BrandMark size={42} />
          <View>
            <Text style={[styles.brandName, { color: colors.foreground }]}>KrazyTrader</Text>
            <Text style={[styles.brandCaption, { color: colors.mutedForeground }]}>Rider membership</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            onPress={() => router.push('/notifications')}
            style={({ pressed }) => [styles.headerIcon, { borderColor: colors.border }, pressed && styles.pressed]}
          >
            <Feather name="bell" size={19} color={colors.foreground} />
            {unreadCount > 0 ? <View style={[styles.notificationDot, { backgroundColor: colors.accent }]} /> : null}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            onPress={() => router.push('/profile')}
            style={({ pressed }) => [styles.avatar, { backgroundColor: colors.secondary }, pressed && styles.pressed]}
          >
            <Text style={[styles.avatarText, { color: colors.primary }]}>{rider ? `${rider.firstName[0]}${rider.lastName[0]}` : 'R'}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.greeting}>
        <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>YOUR RIDER NETWORK</Text>
        <Text style={[styles.greetingTitle, { color: colors.foreground }]}>Habari, {firstName}</Text>
        <Text style={[styles.greetingCopy, { color: colors.mutedForeground }]}>Your workday, with more support behind you.</Text>
      </View>

      {!membership ? (
        <Panel style={[styles.membershipPanel, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
          <View style={styles.membershipPanelTop}>
            <View style={styles.panelCopy}>
              <Text style={[styles.whiteLabel, { color: colors.primaryForeground }]}>START YOUR MEMBERSHIP</Text>
              <Text style={[styles.saccoName, { color: colors.primaryForeground }]}>Choose a local SACCO</Text>
              <Text style={[styles.cardDescription, { color: colors.primaryForeground, opacity: 0.84 }]}>
                Create a demo application and follow its status here.
              </Text>
            </View>
            <View style={[styles.smallMark, { backgroundColor: colors.primaryForeground }]}>
              <Feather name="users" size={18} color={colors.primary} />
            </View>
          </View>
          <ActionButton title="Start rider registration" icon="arrow-right" onPress={() => router.push('/registration')} />
        </Panel>
      ) : (
        <Panel style={[styles.membershipPanel, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
          <View style={styles.membershipPanelTop}>
            <View style={styles.panelCopy}>
              <Text style={[styles.whiteLabel, { color: colors.primaryForeground }]}>
                {isActive ? 'YOUR MEMBERSHIP' : 'MEMBERSHIP APPLICATION'}
              </Text>
              <Text style={[styles.saccoName, { color: colors.primaryForeground }]}>
                {sacco?.name ?? 'SACCO affiliation'}
              </Text>
              <Text style={[styles.cardDescription, { color: colors.primaryForeground, opacity: 0.84 }]}>
                {membership.applicationNumber ? `Application ${membership.applicationNumber}` : 'Your membership details'}
              </Text>
            </View>
            <View style={[styles.smallMark, { backgroundColor: colors.primaryForeground }]}>
              <Feather name="users" size={18} color={colors.primary} />
            </View>
          </View>
          <View style={styles.membershipBottom}>
            <MembershipStatusIndicator status={membership.status} />
            <Text style={[styles.updatedDate, { color: colors.primaryForeground }]}>
              {membership.status === 'Active' ? 'Member access enabled' : 'Not an active membership'}
            </Text>
          </View>
          <Text style={[styles.statusMessage, { color: colors.primaryForeground }]}>
            {membership.status === 'Submitted'
              ? 'Your request was submitted. It is not approved yet.'
              : membership.status === 'Pending verification'
                ? 'Your request is awaiting the SACCO’s demo review.'
                : membership.status === 'Rejected'
                  ? 'The SACCO did not approve this sample request. Review your details before trying again.'
                  : membership.status === 'Inactive'
                    ? 'This demo membership is inactive. Contact the SACCO about next steps.'
                    : 'Your sample membership is active. Member services are available in the demo.'}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/membership')}
            style={({ pressed }) => [styles.membershipLink, { borderTopColor: colors.primaryForeground }, pressed && styles.pressed]}
          >
            <Text style={[styles.membershipLinkText, { color: colors.primaryForeground }]}>View membership card and next steps</Text>
            <Feather name="arrow-up-right" size={16} color={colors.primaryForeground} />
          </Pressable>
        </Panel>
      )}

      <View style={styles.quickSection}>
        <SectionHeader title="What do you need today?" />
        <View style={styles.quickGrid}>
          {quickLinks.map((link) => {
            const locked = Boolean(link.membersOnly && !isActive);
            return (
              <Pressable
                key={link.label}
                accessibilityRole="button"
                accessibilityState={{ disabled: locked }}
                onPress={() => router.push(locked ? '/membership' : link.route)}
                style={({ pressed }) => [
                  styles.quickCard,
                  { borderColor: colors.border, backgroundColor: colors.card },
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.quickIcon, { backgroundColor: colors.secondary }]}>
                  <Feather name={link.icon} size={19} color={colors.primary} />
                </View>
                <View style={styles.quickText}>
                  <Text style={[styles.quickLabel, { color: colors.foreground }]}>{link.label}</Text>
                  <Text style={[styles.quickDetail, { color: locked ? colors.warning : colors.mutedForeground }]}>
                    {locked ? 'Unlocks when membership is active' : link.detail}
                  </Text>
                </View>
                <Feather name={locked ? 'lock' : 'arrow-up-right'} size={15} color={locked ? colors.warning : colors.mutedForeground} />
              </Pressable>
            );
          })}
        </View>
      </View>

      {isActive ? (
        <View style={styles.benefitSection}>
          <SectionHeader title="Made for your ride" actionLabel="All benefits" onAction={() => router.push('/benefits')} />
          <BenefitCard
            title={demoBenefits[0].title}
            description={demoBenefits[0].description}
            discountLabel={demoBenefits[0].discountLabel}
            category={demoBenefits[0].category}
            onPress={() => router.push({ pathname: '/details/[kind]', params: { kind: 'benefit', id: demoBenefits[0].id } })}
          />
        </View>
      ) : (
        <Panel style={styles.lockedPanel}>
          <View style={[styles.lockedIcon, { backgroundColor: colors.warningSoft }]}>
            <Feather name="lock" size={17} color={colors.warning} />
          </View>
          <View style={styles.partnerCopy}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Member benefits are not unlocked</Text>
            <Text style={[styles.cardDescription, { color: colors.mutedForeground }]}>
              SACCO benefits appear here only after a membership is marked active.
            </Text>
          </View>
        </Panel>
      )}

      {notifications[0] ? (
        <Panel style={styles.localPartner}>
          <View style={[styles.partnerIcon, { backgroundColor: colors.successSoft }]}>
            <Feather name="bell" size={17} color={colors.success} />
          </View>
          <View style={styles.partnerCopy}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{notifications[0].title}</Text>
            <Text style={[styles.cardDescription, { color: colors.mutedForeground }]}>{notifications[0].message}</Text>
          </View>
        </Panel>
      ) : null}
      {isActive && partner ? (
        <Panel style={styles.localPartner}>
          <View style={[styles.partnerIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="map-pin" size={17} color={colors.primary} />
          </View>
          <View style={styles.partnerCopy}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Nearby rider partner</Text>
            <Text style={[styles.cardDescription, { color: colors.mutedForeground }]}>{partner.name} · {partner.town}</Text>
          </View>
        </Panel>
      ) : null}
      <View style={styles.footer}>
        <Text style={[styles.footerCopy, { color: colors.mutedForeground }]}>
          Demo account · {membership ? `Updated ${formatShortDate(membership.updatedAt)}` : 'No membership application yet'}
        </Text>
        <ActionButton title="Get help" variant="quiet" icon="headphones" onPress={() => router.push('/support')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandName: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  brandCaption: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon: { width: 42, height: 42, borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', width: 8, height: 8, borderRadius: 5, right: 8, top: 8 },
  avatar: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  pressed: { opacity: 0.78 },
  greeting: { gap: 6, marginTop: 2 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.2 },
  greetingTitle: { fontFamily: 'Inter_700Bold', fontSize: 29, lineHeight: 35 },
  greetingCopy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  membershipPanel: { gap: 14, padding: 17 },
  membershipPanelTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  panelCopy: { flex: 1, gap: 4 },
  whiteLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1, opacity: 0.78 },
  saccoName: { fontFamily: 'Inter_700Bold', fontSize: 16, lineHeight: 22, marginTop: 3 },
  smallMark: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  membershipBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' },
  updatedDate: { fontFamily: 'Inter_400Regular', fontSize: 11, opacity: 0.84 },
  statusMessage: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 19, opacity: 0.9 },
  membershipLink: { minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, opacity: 0.95 },
  membershipLinkText: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  quickSection: { gap: 12 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: { width: '48%', minHeight: 112, borderWidth: 1, borderRadius: 16, padding: 12, gap: 9 },
  quickIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  quickText: { flex: 1, gap: 3 },
  quickLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, lineHeight: 18 },
  quickDetail: { fontFamily: 'Inter_400Regular', fontSize: 10, lineHeight: 15 },
  benefitSection: { gap: 12 },
  lockedPanel: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  lockedIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  localPartner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  partnerIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  partnerCopy: { flex: 1, gap: 3 },
  cardTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, lineHeight: 20 },
  cardDescription: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  footer: { alignItems: 'center', gap: 2, paddingTop: 4 },
  footerCopy: { fontFamily: 'Inter_400Regular', fontSize: 11, textAlign: 'center' },
});
