import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton, PageHeader, Panel, Screen, SectionHeader, VehicleCard } from '@/components/ui';
import { demoVehicles } from '@/data/demo';
import { useColors } from '@/hooks/useColors';

export default function VehiclesScreen() {
  const colors = useColors();
  return (
    <Screen>
      <PageHeader title="Vehicles" subtitle="Explore sample rider vehicles" rightIcon="bell" onRightPress={() => router.push('/notifications')} />
      <Panel style={[styles.introCard, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
        <Text style={[styles.introEyebrow, { color: colors.primaryForeground }]}>DEMO VEHICLE MARKET</Text>
        <Text style={[styles.introTitle, { color: colors.primaryForeground }]}>Find a ride that fits your work.</Text>
        <Text style={[styles.introCopy, { color: colors.primaryForeground }]}>Sample listings only. No vehicle can be purchased or reserved here.</Text>
      </Panel>
      <View style={styles.listSection}>
        <SectionHeader title="Sample vehicles" />
        {demoVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onPress={() => router.push({ pathname: '/details/[kind]', params: { kind: 'vehicle', id: vehicle.id } })}
          />
        ))}
      </View>
      <Panel style={styles.financePanel}>
        <View style={styles.financeCopy}>
          <Text style={[styles.financeTitle, { color: colors.foreground }]}>Looking at financing?</Text>
          <Text style={[styles.financeDescription, { color: colors.mutedForeground }]}>See the planned route for demo financing information.</Text>
        </View>
        <ActionButton title="Financing preview" variant="secondary" icon="arrow-right" onPress={() => router.push('/financing')} />
      </Panel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  introCard: { minHeight: 160, justifyContent: 'center', gap: 10, padding: 20 },
  introEyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1, opacity: 0.78 },
  introTitle: { fontFamily: 'Inter_700Bold', fontSize: 22, lineHeight: 28, maxWidth: 270 },
  introCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, opacity: 0.86 },
  listSection: { gap: 11 },
  financePanel: { gap: 14 },
  financeCopy: { gap: 5 },
  financeTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  financeDescription: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
});
