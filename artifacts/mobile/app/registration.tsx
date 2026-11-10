import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { ActionButton, ConfirmDialog, PageHeader, Panel, Screen, SelectField, TextField } from '@/components/ui';
import { demoSaccos } from '@/data/demo';
import { useColors } from '@/hooks/useColors';

export default function RegistrationScreen() {
  const colors = useColors();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sacco, setSacco] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const isValid = name.trim().length > 1 && phone.trim().length > 5 && sacco.length > 0;

  return (
    <Screen scroll={false} contentStyle={styles.screenContent}>
      <KeyboardAwareScrollViewCompat
        bottomOffset={72}
        keyboardShouldPersistTaps="handled"
        style={styles.keyboardScroll}
        contentContainerStyle={styles.formContent}
      >
      <PageHeader title="Registration preview" subtitle="A sample of the future onboarding flow" back={() => router.back()} />
      <Panel style={styles.intro}>
        <Text style={[styles.step, { color: colors.primary }]}>STEP 1 OF 3 · DEMO ONLY</Text>
        <Text style={[styles.introTitle, { color: colors.foreground }]}>Connect with a SACCO</Text>
        <Text style={[styles.introCopy, { color: colors.mutedForeground }]}>
          These fields demonstrate the shared form components. Details are not saved or sent.
        </Text>
      </Panel>
      <TextField
        label="Full name"
        autoCapitalize="words"
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        error={showValidation && name.trim().length <= 1 ? 'Enter a name to preview this form.' : undefined}
      />
      <TextField
        label="Phone number"
        keyboardType="phone-pad"
        placeholder="+254 7XX XXX XXX"
        value={phone}
        onChangeText={setPhone}
        error={showValidation && phone.trim().length <= 5 ? 'Enter a sample phone number to preview.' : undefined}
      />
      <SelectField
        label="Choose a SACCO"
        value={sacco}
        options={demoSaccos.map((item) => item.name)}
        onSelect={setSacco}
      />
      {showValidation && !sacco ? (
        <Text style={[styles.validation, { color: colors.destructive }]}>Choose one of the sample SACCOs to continue.</Text>
      ) : null}
      <ActionButton
        title="Preview request"
        icon="arrow-right"
        onPress={() => {
          setShowValidation(true);
          if (isValid) setShowConfirmation(true);
        }}
      />
      <ActionButton title="Back to membership" variant="secondary" onPress={() => router.push('/membership')} />
      <ConfirmDialog
        visible={showConfirmation}
        title="Demo preview only"
        message="Your sample details are not saved, submitted, or shared. Real registration and identity checks are planned for a later phase."
        confirmLabel="Understood"
        onConfirm={() => setShowConfirmation(false)}
        onCancel={() => setShowConfirmation(false)}
      />
      </KeyboardAwareScrollViewCompat>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: { padding: 0, gap: 0 },
  keyboardScroll: { flex: 1 },
  formContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 116, gap: 16 },
  intro: { gap: 8, padding: 18 },
  step: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1 },
  introTitle: { fontFamily: 'Inter_700Bold', fontSize: 21 },
  introCopy: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20 },
  validation: { fontFamily: 'Inter_400Regular', fontSize: 12 },
});
