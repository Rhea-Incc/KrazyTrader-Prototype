import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PageHeader, Panel, Screen, SectionHeader } from '@/components/ui';
import { demoMembership, demoRider, demoSaccos } from '@/data/demo';
import { useColors } from '@/hooks/useColors';

const profileLinks = [
  { title: 'Membership details', icon: 'users' as const, route: '/membership' as const },
  { title: 'Notifications', icon: 'bell' as const, route: '/notifications' as const },
  { title: 'Insurance and safety', icon: 'shield' as const, route: '/insurance' as const },
  { title: 'Contact support', icon: 'headphones' as const, route: '/support' as const },
];

export default function ProfileScreen() {
  const colors = useColors();
  const sacco = demoSaccos.find((item) => item.id === demoMembership.saccoId) ?? demoSaccos[0];
  return (
    <Screen>
      <PageHeader title="Profile" subtitle="Your demo rider details" />
      <Panel style={styles.profilePanel}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>{demoRider.firstName[0]}{demoRider.lastName[0]}</Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={[styles.profileName, { color: colors.foreground }]}>{demoRider.firstName} {demoRider.lastName}</Text>
          <Text style={[styles.profileMeta, { color: colors.mutedForeground }]}>{demoRider.phone}</Text>
          <Text style={[styles.profileMeta, { color: colors.mutedForeground }]}>{demoRider.town}, {demoRider.county}</Text>
        </View>
      </Panel>
      <View style={styles.memberStrip}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>CONNECTED SACCO</Text>
        <Text style={[styles.sacco, { color: colors.foreground }]}>{sacco.name}</Text>
      </View>
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
                index < profileLinks.length - 1 ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border } : null,
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
      <Text style={[styles.demoNote, { color: colors.mutedForeground }]}>
        This is fictional demonstration data. No personal information is connected to an account.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profilePanel: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 18 },
  avatar: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 19 },
  profileCopy: { flex: 1, gap: 4 },
  profileName: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  profileMeta: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  memberStrip: { gap: 5, paddingHorizontal: 2 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1 },
  sacco: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  section: { gap: 11 },
  linksPanel: { paddingVertical: 3, paddingHorizontal: 13, gap: 0 },
  profileLink: { minHeight: 61, flexDirection: 'row', alignItems: 'center', gap: 11 },
  linkIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  linkText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14 },
  pressed: { opacity: 0.75 },
  demoNote: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
