import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton, PageHeader, Panel, Screen, TextField } from '@/components/ui';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useDemoApp } from '@/context/DemoAppContext';
import { useColors } from '@/hooks/useColors';

export default function VerifyScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone ?? '+254700000128';
  const [code, setCode] = useState('123456');
  const [hasError, setHasError] = useState(false);
  const { signIn } = useDemoApp();

  function verify() {
    setHasError(code !== '123456');
    if (code !== '123456') return;
    signIn(phone);
    router.replace('/(tabs)');
  }

  return (
    <Screen scroll={false} contentStyle={styles.screen}>
      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={styles.form}
        bottomOffset={64}
        keyboardShouldPersistTaps="handled"
      >
        <PageHeader title="Verify number" subtitle="Simulated one-time code" back={() => router.back()} />
        <View style={[styles.heroIcon, { backgroundColor: colors.secondary }]}>
          <Feather name="smartphone" size={24} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>Enter your demo code</Text>
        <Text style={[styles.copy, { color: colors.mutedForeground }]}>
          A real message was not sent to {phone}. Use the fixed code shown below.
        </Text>
        <Panel style={styles.codePanel}>
          <Text style={[styles.codeLabel, { color: colors.mutedForeground }]}>DEMO VERIFICATION CODE</Text>
          <Text style={[styles.demoCode, { color: colors.primary }]}>123456</Text>
        </Panel>
        <TextField
          label="6-digit code"
          value={code}
          onChangeText={(value) => {
            setCode(value.replace(/\D/g, '').slice(0, 6));
            setHasError(false);
          }}
          keyboardType="number-pad"
          maxLength={6}
          error={hasError ? 'That code does not match the demonstration code.' : undefined}
          testID="verify-code"
        />
        <ActionButton
          title="Verify and continue"
          icon="check"
          onPress={verify}
          disabled={code.length !== 6}
          testID="verify-submit"
        />
        <Text style={[styles.note, { color: colors.mutedForeground }]}>
          This screen demonstrates navigation only. It does not verify identity or contact a mobile network.
        </Text>
      </KeyboardAwareScrollViewCompat>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  scroll: { flex: 1 },
  form: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 56, gap: 18 },
  heroIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 27 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 },
  codePanel: { alignItems: 'center', paddingVertical: 15 },
  codeLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1 },
  demoCode: { fontFamily: 'Inter_700Bold', fontSize: 28, letterSpacing: 6, marginLeft: 6, marginTop: 6 },
  note: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
