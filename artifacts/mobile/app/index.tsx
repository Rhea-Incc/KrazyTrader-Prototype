import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { BrandMark } from '@/components/ui';
import { useDemoApp } from '@/context/DemoAppContext';
import { useColors } from '@/hooks/useColors';

export default function AppEntry() {
  const colors = useColors();
  const { isHydrated, signedIn } = useDemoApp();

  if (!isHydrated) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <BrandMark size={76} />
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return <Redirect href={signedIn ? '/(tabs)' : '/welcome'} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 },
});
