import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton, PageHeader, Panel, Screen } from '@/components/ui';
import { demoBenefits, demoDealers, demoPartners, demoSaccos, demoVehicles } from '@/data/demo';
import { useColors } from '@/hooks/useColors';
import { formatKsh } from '@/utils/format';

export default function DetailScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ kind?: string; id?: string }>();
  const kind = Array.isArray(params.kind) ? params.kind[0] : params.kind;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const isSacco = kind === 'sacco';
  const isVehicle = kind === 'vehicle';
  const sacco = isSacco ? demoSaccos.find((item) => item.id === id) : undefined;
  const vehicle = isVehicle ? demoVehicles.find((item) => item.id === id) : undefined;
  const benefit = kind === 'benefit' ? demoBenefits.find((item) => item.id === id) : undefined;
  const partner = benefit ? demoPartners.find((item) => item.id === benefit.partnerId) : undefined;
  const title = sacco?.name ?? (vehicle ? `${vehicle.make} ${vehicle.model}` : benefit?.title ?? 'Sample details');
  const hasRecord = Boolean(sacco || vehicle || benefit);

  return (
    <Screen>
      <PageHeader title="Details" subtitle="Fictional demonstration record" back={() => router.back()} />
      <Panel style={styles.hero}>
        <View style={[styles.heroIcon, { backgroundColor: colors.secondary }]}>
          <Feather name={isSacco ? 'users' : isVehicle ? 'truck' : 'gift'} size={24} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        {!hasRecord ? (
          <Text style={[styles.body, { color: colors.mutedForeground }]}>This sample record could not be found. Return to the previous screen and choose another item.</Text>
        ) : null}
        {sacco ? <Text style={[styles.body, { color: colors.mutedForeground }]}>{sacco.description}</Text> : null}
        {vehicle ? <Text style={[styles.body, { color: colors.mutedForeground }]}>{vehicle.description}</Text> : null}
        {benefit ? <Text style={[styles.body, { color: colors.mutedForeground }]}>{benefit.description}</Text> : null}
      </Panel>
      {sacco ? (
        <Panel style={styles.infoPanel}>
          <InfoRow label="Location" value={`${sacco.town}, ${sacco.county}`} />
          <InfoRow label="Network size" value={`${sacco.memberCount} sample members`} />
          <InfoRow label="Membership" value="Pending in this demo" />
        </Panel>
      ) : null}
      {vehicle ? (
        <Panel style={styles.infoPanel}>
          <InfoRow label="Price" value={formatKsh(vehicle.priceKsh)} />
          <InfoRow label="Category" value={vehicle.category} />
          <InfoRow label="Dealer" value={demoDealers.find((item) => item.id === vehicle.dealerId)?.name ?? 'Sample dealer'} />
        </Panel>
      ) : null}
      {benefit ? (
        <Panel style={styles.infoPanel}>
          <InfoRow label="Partner" value={partner?.name ?? 'Sample local partner'} />
          <InfoRow label="Area" value={partner?.town ?? 'Nairobi'} />
          <InfoRow label="Offer" value={benefit.discountLabel} />
        </Panel>
      ) : null}
      <ActionButton
        title={isVehicle ? 'Financing route' : isSacco ? 'Membership route' : 'See all benefits'}
        icon="arrow-right"
        onPress={() => router.push(isVehicle ? '/financing' : isSacco ? '/membership' : '/benefits')}
      />
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { gap: 13, padding: 20 },
  heroIcon: { width: 54, height: 54, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 21, lineHeight: 28 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 },
  infoPanel: { gap: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18 },
  infoLabel: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  infoValue: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 13, textAlign: 'right' },
});
