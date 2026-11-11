import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  ActionButton,
  MembershipStatusIndicator,
  PageHeader,
  Panel,
  PreferenceRow,
  Screen,
  SectionHeader,
} from '@/components/ui';
import { useDemoApp } from '@/context/DemoAppContext';
import { demoSaccos } from '@/data/demo';
import { useColors } from '@/hooks/useColors';

const profileLinks = [
  { title: 'Membership details', icon: 'users' as const, route: '/membership' as const },
  { title: 'Notifications', icon: 'bell' as const, route: '/notifications' as const },
  { title: 'Insurance and safety', icon: 'shield' as const, route: '/insurance' as const },
  { title: 'Contact support', icon: 'headphones' as const, route: '/support' as const },
];

export default function ProfileScreen() {
  const colors = useColors();
  const {
    rider,
    membership,
    notificationPreferences,
    setNotificationPreference,
    logOut,
  } = useDemoApp();
  const sacco = demoSaccos.find((item) => item.id === membership?.saccoId);
  const firstName = rider?.firstName ?? 'Demo';
  const lastName = rider?.lastName ?? 'Rider';

  return (
    <Screen>
      <PageHeader title="Profile" subtitle="Your rider details and preferences" />
      <Panel style={styles.profilePanel}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>{firstName[0]}{lastName[0]}</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={[styles.profileName, { color: colors.foreground }]}>{firstName} {lastName}</Text>
          <Text style={[styles.profileMeta, { color: colors.mutedForeground }]}>{rider?.phone}</Text>
          <Text style={[styles.profileMeta, { color: colors.mutedForeground }]}>
            {rider ? `${rider.town}, ${rider.county}` : 'Rider details'}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Edit rider profile"
          onPress={() => router.push('/profile-edit')}
          style={({ pressed }) => [styles.editButton, { backgroundColor: colors.secondary }, pressed && styles.pressed]}
        >
          <Feather name="edit-2" size={16} color={colors.primary} />
        </Pressable>
      </Panel>

      <Panel style={styles.membershipPanel}>
        <View style={styles.membershipRow}>
          <View style={[styles.saccoIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="users" size={18} color={colors.primary} />
          </View>
          <View style={styles.saccoCopy}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>SACCO ASSOCIATION</Text>
            <Text style={[styles.sacco, { color: colors.foreground }]}>{sacco?.name ?? 'No SACCO selected'}</Text>
          </View>
          {membership ? <MembershipStatusIndicator status={membership.status} /> : null}
        </View>
        {!membership ? (
          <Text style={[styles.profileMeta, { color: colors.mutedForeground }]}>Start registration to choose a local SACCO.</Text>
        ) : null}
      </Panel>

      <View style={styles.section}>
        <SectionHeader title="Account and support" />
        <Panel style={styles.linksPanel}>
          {profileLinks.map((link, index) => (
            <Pressable
              key={link.title}
              accessibilityRole="button"
              onPress={() => router.push(link.route)}
              style={({ pressed }) => [
                styles.profileLink,
                index < profileLinks.length - 1
                  ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }
                  : null,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.linkIcon, { backgroundColor: colors.secondary }]}>
                <Feather name={link.icon} size={17} color={colors.primary} />
              </View>
              <Text style={[styles.linkText, { color: colors.foreground }]}>{link.title}</Text>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </Panel>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Notification preferences" />
        <Panel style={styles.preferencePanel}>
          <PreferenceRow
            title="Membership updates"
            detail="Application and SACCO status messages"
            value={notificationPreferences.membershipUpdates}
            onValueChange={(value) => setNotificationPreference('membershipUpdates', value)}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <PreferenceRow
            title="Partner offers"
            detail="Demo offers and service announcements"
            value={notificationPreferences.partnerOffers}
            onValueChange={(value) => setNotificationPreference('partnerOffers', value)}
          />
        </Panel>
      </View>

      <Panel style={styles.privacyPanel}>
        <Feather name="lock" size={17} color={colors.primary} />
        <View style={styles.privacyCopy}>
          <Text style={[styles.linkText, { color: colors.foreground }]}>Privacy and consent</Text>
          <Text style={[styles.profileMeta, { color: colors.mutedForeground }]}>
            Demo profile data is stored locally. Identity details are fictional; no production account or data service is connected.
          </Text>
        </View>
      </Panel>

      {__DEV__ ? (
        <ActionButton title="Developer demo controls" variant="secondary" icon="tool" onPress={() => router.push('/developer-tools')} />
      ) : null}
      <ActionButton
        title="Log out"
        variant="quiet"
        icon="log-out"
        onPress={() => {
          logOut();
          router.replace('/welcome');
        }}
        testID="profile-logout"
      />
      <Text style={[styles.demoNote, { color: colors.mutedForeground }]}>
        Prototype account · No real personal or identity information should be used.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profilePanel: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 17 },
  avatar: { width: 56, height: 56, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  profileCopy: { flex: 1, gap: 4 },
  profileName: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  profileMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  editButton: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  membershipPanel: { gap: 12 },
  membershipRow: { flexDirection: 'row', alignItems: 'center', gap: 11, flexWrap: 'wrap' },
  saccoIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  saccoCopy: { flex: 1, minWidth: 100, gap: 3 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1 },
  sacco: { fontFamily: 'Inter_600SemiBold', fontSize: 13, lineHeight: 18 },
  section: { gap: 11 },
  linksPanel: { paddingVertical: 3, paddingHorizontal: 13, gap: 0 },
  profileLink: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 11 },
  linkIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  linkText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13 },
  preferencePanel: { paddingVertical: 4, paddingHorizontal: 14, gap: 0 },
  divider: { height: StyleSheet.hairlineWidth },
  privacyPanel: { flexDirection: 'row', alignItems: 'flex-start', gap: 11 },
  privacyCopy: { flex: 1, gap: 5 },
  pressed: { opacity: 0.75 },
  demoNote: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17, textAlign: 'center' },
});
