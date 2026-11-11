import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton, CheckboxRow, PageHeader, Panel, Screen, TextField } from '@/components/ui';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';

export default function LoginScreen() {
  const colors = useColors();
  const [phone, setPhone] = useState('700000128');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const validPhone = /^[17]\d{8}$/.test(phone.replace(/\D/g, ''));

  function continueToCode() {
    setShowErrors(true);
    if (validPhone && acceptedTerms) {
      router.push({ pathname: '/verify', params: { phone: `+254${phone.replace(/\D/g, '')}` } });
    }
  }

  return (
    <Screen scroll={false} contentStyle={styles.screen}>
      <KeyboardAwareScrollViewCompat
        style={styles.keyboardScroll}
        contentContainerStyle={styles.form}
        bottomOffset={72}
        keyboardShouldPersistTaps="handled"
      >
        <PageHeader title="Log in" subtitle="Use a Kenyan mobile number" back={() => router.back()} />
        <View style={styles.intro}>
          <Text style={[styles.title, { color: colors.foreground }]}>Welcome back.</Text>
          <Text style={[styles.copy, { color: colors.mutedForeground }]}>
            We’ll verify your number using a fixed demo code. Nothing will be sent by SMS.
          </Text>
        </View>
        <View style={styles.phoneRow}>
          <View style={[styles.countryCode, { borderColor: colors.input, backgroundColor: colors.card }]}>
            <Text style={[styles.codeText, { color: colors.foreground }]}>+254</Text>
          </View>
          <View style={styles.phoneField}>
            <TextField
              label="Mobile number"
              value={phone}
              onChangeText={(value) => setPhone(value.replace(/\D/g, '').slice(0, 9))}
              placeholder="700 000 128"
              keyboardType="phone-pad"
              maxLength={9}
              error={showErrors && !validPhone ? 'Enter a valid 9-digit Kenyan mobile number.' : undefined}
              testID="login-phone"
            />
          </View>
        </View>
        <Panel style={styles.demoInfo}>
          <Text style={[styles.demoTitle, { color: colors.foreground }]}>Repeatable demo sign-in</Text>
          <Text style={[styles.demoCopy, { color: colors.mutedForeground }]}>
            Number: +254 700 000 128 · Verification code: 123456
          </Text>
        </Panel>
        <CheckboxRow
          checked={acceptedTerms}
          onPress={() => setAcceptedTerms((current) => !current)}
          title="I agree to the demo Terms of Use and Privacy Notice."
          detail="This acknowledgement is saved only as part of this local prototype flow."
          testID="login-terms"
        />
        {showErrors && !acceptedTerms ? (
          <Text style={[styles.error, { color: colors.destructive }]}>Please accept the demo terms to continue.</Text>
        ) : null}
        <ActionButton
          title="Continue to verification"
          icon="arrow-right"
          onPress={continueToCode}
          testID="login-continue"
        />
        <Text style={[styles.notice, { color: colors.mutedForeground }]}>
          Demo mode only. No account provider, SMS service or production authentication is connected.
        </Text>
      </KeyboardAwareScrollViewCompat>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0, gap: 0 },
  keyboardScroll: { flex: 1 },
  form: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 56, gap: 20 },
  intro: { gap: 7 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 27 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21 },
  phoneRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  countryCode: { height: 50, minWidth: 70, borderWidth: 1, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 1 },
  codeText: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  phoneField: { flex: 1 },
  demoInfo: { gap: 5, padding: 14 },
  demoTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  demoCopy: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  error: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: -14 },
  notice: { fontFamily: 'Inter_400Regular', fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
