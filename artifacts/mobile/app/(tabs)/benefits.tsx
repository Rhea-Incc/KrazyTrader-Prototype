import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BenefitCard, PageHeader, Screen, SectionHeader, StatePanel, ActionButton } from '@/components/ui';
import { useDemoApp } from '@/context/DemoAppContext';
import { demoBenefits, demoPartners } from '@/data/demo';
import { useColors } from '@/hooks/useColors';

export default function BenefitsScreen() {
  const colors = useColors();
  const { membership } = useDemoApp();
  if (membership?.status !== 'Active') {
    return (
      <Screen>
        <PageHeader title="Member benefits" subtitle="Local offers for everyday work" />
        <StatePanel
          variant="empty"
          title="Benefits unlock with active membership"
          message="Your current membership is not active. This screen will show fictional partner offers after the demo membership is set to Active."
        />
        <ActionButton title="View membership status" icon="users" onPress={() => router.push('/membership')} />
      </Screen>
    );
  }
  return (
    <Screen>
      <PageHeader title="Member benefits" subtitle="Local offers for everyday work" rightIcon="bell" onRightPress={() => router.push('/notifications')} />
      <View style={[styles.banner, { backgroundColor: colors.secondary }]}>
        <View style={[styles.bannerIcon, { backgroundColor: colors.accent }]}>
          <Text style={[styles.bannerIconText, { color: colors.foreground }]}>K</Text>
        </View>
        <View style={styles.bannerCopy}>
          <Text style={[styles.bannerTitle, { color: colors.foreground }]}>Good work deserves support.</Text>
          <Text style={[styles.bannerText, { color: colors.mutedForeground }]}>Fictional offers from local partners around Nairobi.</Text>
        </View>
      </View>
      <SectionHeader title="Available in the demo" />
      <View style={styles.benefitList}>
        {demoBenefits.map((benefit) => {
          const partner = demoPartners.find((item) => item.id === benefit.partnerId);
          return (
            <BenefitCard
              key={benefit.id}
              title={benefit.title}
              description={`${partner?.name ?? 'Local partner'} · ${benefit.description}`}
              discountLabel={benefit.discountLabel}
              category={benefit.category}
              onPress={() => router.push({ pathname: '/details/[kind]', params: { kind: 'benefit', id: benefit.id } })}
            />
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', gap: 13, borderRadius: 18, padding: 16 },
  bannerIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  bannerIconText: { fontFamily: 'Inter_700Bold', fontSize: 19 },
  bannerCopy: { flex: 1, gap: 4 },
  bannerTitle: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  bannerText: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  benefitList: { gap: 12 },
});
