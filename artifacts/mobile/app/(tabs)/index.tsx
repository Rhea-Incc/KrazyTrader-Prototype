import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  ActionButton,
  BenefitCard,
  BrandMark,
  MembershipStatusIndicator,
  Panel,
  Screen,
  SectionHeader,
} from '@/components/ui';
import { demoBenefits, demoMembership, demoPartners, demoRider, demoSaccos } from '@/data/demo';
import { useColors } from '@/hooks/useColors';
import { formatShortDate } from '@/utils/format';

const quickLinks = [
  { label: 'Membership', icon: 'users' as const, route: '/membership' as const },
  { label: 'Find a vehicle', icon: 'truck' as const, route: '/vehicles' as const },
  { label: 'Financing', icon: 'credit-card' as const, route: '/financing' as const },
  { label: 'Help & safety', icon: 'shield' as const, route: '/insurance' as const },
];

export default function HomeScreen() {
  const colors = useColors();
  const sacco = demoSaccos.find((item) => item.id === demoMembership.saccoId) ?? demoSaccos[0];
  const partner = demoPartners.find((item) => item.id === demoBenefits[0].partnerId);
  return (
    <Screen>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <BrandMark size={43} />
          <View>
            <Text style={[styles.brandName, { color: colors.foreground }]}>KrazyTrader</Text>
            <Text style={[styles.brandCaption, { color: colors.mutedForeground }]}>Rider membership</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open notifications"
          onPress={() => router.push('/notifications')}
          style={({ pressed }) => [styles.notificationButton, { borderColor: colors.border }, pressed && styles.pressed]}
        >
          <Feather name="bell" size={19} color={colors.foreground} />
          <View style={[styles.notificationDot, { backgroundColor: colors.accent }]} />
        </Pressable>
      </View>
      <View style={styles.greeting}>
        <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>YOUR RIDER NETWORK</Text>
        <Text style={[styles.greetingTitle, { color: colors.foreground }]}>Habari, {demoRider.firstName}</Text>
        <Text style={[styles.greetingCopy, { color: colors.mutedForeground }]}>Your workday, with more support behind you.</Text>
      </View>
      <Panel style={[styles.membershipPanel, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
        <View style={styles.membershipPanelTop}>
          <View>
            <Text style={[styles.whiteLabel, { color: colors.primaryForeground }]}>YOUR MEMBERSHIP</Text>
            <Text style={[styles.saccoName, { color: colors.primaryForeground }]}>{sacco.name}</Text>
          </View>
          <View style={[styles.smallMark, { backgroundColor: colors.primaryForeground }]}><Feather name="users" size={17} color={colors.primary} /></View>
        </View>
        <View style={styles.membershipBottom}>
          <MembershipStatusIndicator status={demoMembership.status} />
          <Text style={[styles.updatedDate, { color: colors.primaryForeground }]}>Updated {formatShortDate(demoMembership.updatedAt)}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/membership')}
          style={({ pressed }) => [
            styles.membershipLink,
            { borderTopColor: colors.primaryForeground },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.membershipLinkText, { color: colors.primaryForeground }]}>View membership</Text>
          <Feather name="arrow-up-right" size={16} color={colors.primaryForeground} />
        </Pressable>
      </Panel>
      <View style={styles.quickSection}>
        <SectionHeader title="What do you need today?" />
        <View style={styles.quickGrid}>
          {quickLinks.map((link) => (
            <Pressable
              key={link.label}
              accessibilityRole="button"
              onPress={() => router.push(link.route)}
              style={({ pressed }) => [
                styles.quickCard,
                { borderColor: colors.border, backgroundColor: colors.card },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.quickIcon, { backgroundColor: colors.secondary }]}>
                <Feather name={link.icon} size={19} color={colors.primary} />
              </View>
              <Text style={[styles.quickLabel, { color: colors.foreground }]}>{link.label}</Text>
              <Feather name="arrow-up-right" size={15} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.benefitSection}>
        <SectionHeader title="Made for your ride" actionLabel="All benefits" onAction={() => router.push('/benefits')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.benefitList}>
          {demoBenefits.slice(0, 2).map((benefit) => (
            <BenefitCard
              key={benefit.id}
              title={benefit.title}
              description={benefit.description}
              discountLabel={benefit.discountLabel}
              category={benefit.category}
              onPress={() => router.push({ pathname: '/details/[kind]', params: { kind: 'benefit', id: benefit.id } })}
            />
          ))}
        </ScrollView>
      </View>
      <Panel style={styles.localPartner}>
        <View style={[styles.partnerIcon, { backgroundColor: colors.successSoft }]}>
          <Feather name="map-pin" size={18} color={colors.success} />
        </View>
        <View style={styles.partnerCopy}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Nearby rider partner</Text>
          <Text style={[styles.cardDescription, { color: colors.mutedForeground }]}>
            {partner?.name ?? 'Local rider partners'} · {partner?.town ?? demoRider.town}
          </Text>
        </View>
        <Feather name="chevron-right" size={19} color={colors.mutedForeground} />
      </Panel>
      <View style={styles.footer}>
        <Text style={[styles.footerCopy, { color: colors.mutedForeground }]}>A better network for the road ahead.</Text>
        <ActionButton title="Get help" variant="quiet" icon="headphones" onPress={() => router.push('/support')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandName: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  brandCaption: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 1 },
  notificationButton: { width: 44, height: 44, borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', width: 8, height: 8, borderRadius: 5, right: 10, top: 9 },
  pressed: { opacity: 0.78 },
  greeting: { gap: 6, marginTop: 2 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1.2 },
  greetingTitle: { fontFamily: 'Inter_700Bold', fontSize: 29, lineHeight: 35 },
  greetingCopy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  membershipPanel: { gap: 17, padding: 18 },
  membershipPanelTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  whiteLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1, opacity: 0.76 },
  saccoName: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 5 },
  smallMark: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  membershipBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' },
  updatedDate: { fontFamily: 'Inter_400Regular', fontSize: 11, opacity: 0.8 },
  membershipLink: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 6, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, opacity: 0.95 },
  membershipLinkText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  quickSection: { gap: 12 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: { width: '48%', minHeight: 96, borderWidth: 1, borderRadius: 16, padding: 12, gap: 8 },
  quickIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, flex: 1 },
  benefitSection: { gap: 12 },
  benefitList: { gap: 11, paddingRight: 20 },
  localPartner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  partnerIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  partnerCopy: { flex: 1, gap: 3 },
  cardTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, lineHeight: 21 },
  cardDescription: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
  footer: { alignItems: 'center', gap: 4, paddingTop: 4 },
  footerCopy: { fontFamily: 'Inter_400Regular', fontSize: 12 },
});
