import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ActionButton, PageHeader, Screen, SelectField, TextField } from '@/components/ui';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useDemoApp } from '@/context/DemoAppContext';
import { useColors } from '@/hooks/useColors';

const counties = ['Nairobi', 'Kiambu', 'Mombasa', 'Nakuru', 'Machakos', 'Kisumu', 'Uasin Gishu'];

export default function ProfileEditScreen() {
  const colors = useColors();
  const { rider, updateRider } = useDemoApp();
  const [fullName, setFullName] = useState(`${rider?.firstName ?? ''} ${rider?.lastName ?? ''}`.trim());
  const [email, setEmail] = useState(rider?.email ?? '');
  const [county, setCounty] = useState(rider?.county ?? '');
  const [town, setTown] = useState(rider?.town ?? '');
  const [showError, setShowError] = useState(false);

  function save() {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length < 2 || !county || !town.trim()) {
      setShowError(true);
      return;
    }
    const [firstName, ...last] = parts;
    updateRider({ firstName, lastName: last.join(' '), email: email.trim() || undefined, county, town: town.trim() });
    router.back();
  }

  return (
    <Screen scroll={false} contentStyle={styles.screen}>
      <KeyboardAwareScrollViewCompat style={styles.scroll} contentContainerStyle={styles.form} bottomOffset={64} keyboardShouldPersistTaps="handled">
        <PageHeader title="Edit rider profile" subtitle="Changes stay on this device" back={() => router.back()} />
        <Text style={[styles.intro, { color: colors.mutedForeground }]}>
          Edit safe profile fields for this demonstration account. Your mobile number is read-only in the prototype.
        </Text>
        <TextField label="Full name" value={fullName} onChangeText={setFullName} autoCapitalize="words" placeholder="First and last name" />
        <TextField label="Mobile number" value={rider?.phone ?? ''} editable={false} />
        <TextField label="Email (optional)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="name@example.com" />
        <SelectField label="County" value={county} options={counties} onSelect={setCounty} />
        <TextField label="Town or operating area" value={town} onChangeText={setTown} autoCapitalize="words" placeholder="e.g. Eastlands" />
        {showError ? <Text style={[styles.error, { color: colors.destructive }]}>Add a first and last name, county and town.</Text> : null}
        <ActionButton title="Save profile" icon="check" onPress={save} testID="profile-save" />
      </KeyboardAwareScrollViewCompat>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  scroll: { flex: 1 },
  form: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 56, gap: 17 },
  intro: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20 },
  error: { fontFamily: 'Inter_500Medium', fontSize: 12 },
});
