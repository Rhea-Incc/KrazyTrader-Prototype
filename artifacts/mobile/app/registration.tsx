import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  ActionButton,
  CheckboxRow,
  PageHeader,
  Panel,
  Screen,
  SelectField,
  TextField,
} from '@/components/ui';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useDemoApp } from '@/context/DemoAppContext';
import { demoSaccos } from '@/data/demo';
import { useColors } from '@/hooks/useColors';
import type { RegistrationDraft } from '@/types/domain';

const counties = ['Nairobi', 'Kiambu', 'Mombasa', 'Nakuru', 'Machakos', 'Kisumu', 'Uasin Gishu'];
const occupations = ['Boda-boda rider', 'Tuk-tuk operator', 'Delivery rider', 'Other'];
const idTypes = ['National ID (demo)', 'Passport (demo)'];
const steps = ['Personal', 'Rider details', 'SACCO', 'Identity', 'Review'];

export default function RegistrationScreen() {
  const colors = useColors();
  const { registrationDraft: draft, updateRegistrationDraft, submitRegistration } = useDemoApp();
  const [attempted, setAttempted] = useState(false);
  const [saccoSearch, setSaccoSearch] = useState('');
  const step = Math.min(Math.max(draft.step, 1), 5);
  const selectedSacco = demoSaccos.find((item) => item.id === draft.saccoId);
  const filteredSaccos = useMemo(() => {
    const query = saccoSearch.trim().toLowerCase();
    if (!query) return demoSaccos;
    return demoSaccos.filter((item) =>
      `${item.name} ${item.town} ${item.county}`.toLowerCase().includes(query),
    );
  }, [saccoSearch]);
  const digits = draft.phone.replace(/\D/g, '');
  const validPhone = digits.length >= 9 && (digits.slice(-9).startsWith('7') || digits.slice(-9).startsWith('1'));
  const nameParts = draft.fullName.trim().split(/\s+/);
  const stepValid = [
    draft.fullName.trim().length >= 3 &&
      nameParts.length >= 2 &&
      validPhone &&
      /^\d{2}\/\d{2}\/\d{4}$/.test(draft.dateOfBirth),
    Boolean(draft.county && draft.town.trim() && draft.occupation && draft.vehicleCategory),
    Boolean(draft.saccoId),
    Boolean(draft.idType && draft.idNumber.trim().length >= 6 && draft.idDocumentSelected),
    Boolean(draft.acceptedTerms && draft.declaration),
  ][step - 1];

  function patch(values: Partial<RegistrationDraft>) {
    updateRegistrationDraft(values);
  }

  function continueStep() {
    setAttempted(true);
    if (!stepValid) return;
    if (step < 5) {
      patch({ step: step + 1 });
      setAttempted(false);
      return;
    }
    submitRegistration(draft);
    router.replace('/(tabs)/membership');
  }

  function goBack() {
    if (step > 1) {
      patch({ step: step - 1 });
      setAttempted(false);
    } else {
      router.back();
    }
  }

  return (
    <Screen scroll={false} contentStyle={styles.screen}>
      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={styles.form}
        bottomOffset={76}
        keyboardShouldPersistTaps="handled"
      >
        <PageHeader
          title="Rider registration"
          subtitle="Join a local SACCO network"
          back={goBack}
        />
        <View style={styles.progressWrap}>
          <View style={styles.progressLabels}>
            <Text style={[styles.stepLabel, { color: colors.primary }]}>STEP {step} OF 5</Text>
            <Text style={[styles.stepName, { color: colors.mutedForeground }]}>{steps[step - 1]}</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.secondary }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.accent, width: `${step * 20}%` }]} />
          </View>
        </View>

        {step === 1 ? <PersonalStep draft={draft} patch={patch} attempted={attempted} /> : null}
        {step === 2 ? <RiderStep draft={draft} patch={patch} attempted={attempted} /> : null}
        {step === 3 ? (
          <SaccoStep
            draft={draft}
            patch={patch}
            attempted={attempted}
            search={saccoSearch}
            setSearch={setSaccoSearch}
            filteredSaccos={filteredSaccos}
            selectedName={selectedSacco?.name}
          />
        ) : null}
        {step === 4 ? <IdentityStep draft={draft} patch={patch} attempted={attempted} /> : null}
        {step === 5 ? <ReviewStep draft={draft} patch={patch} attempted={attempted} onEdit={(target) => { patch({ step: target }); setAttempted(false); }} /> : null}

        {attempted && !stepValid ? (
          <Text style={[styles.validation, { color: colors.destructive }]}>
            Check the highlighted information before continuing.
          </Text>
        ) : null}
        <View style={styles.actions}>
          {step > 1 ? (
            <ActionButton title="Back" variant="secondary" icon="arrow-left" onPress={goBack} />
          ) : null}
          <ActionButton
            title={step === 5 ? 'Submit demo application' : 'Continue'}
            icon={step === 5 ? 'check' : 'arrow-right'}
            onPress={continueStep}
            testID={`registration-step-${step}-continue`}
          />
        </View>
        <Text style={[styles.demoNote, { color: colors.mutedForeground }]}>
          Demo registration only. Identity details are fictional and are not uploaded, verified or shared.
        </Text>
      </KeyboardAwareScrollViewCompat>
    </Screen>
  );
}

function PersonalStep({
  draft,
  patch,
  attempted,
}: {
  draft: RegistrationDraft;
  patch: (values: Partial<RegistrationDraft>) => void;
  attempted: boolean;
}) {
  const colors = useColors();
  const digits = draft.phone.replace(/\D/g, '');
  const validPhone = digits.length >= 9 && (digits.slice(-9).startsWith('7') || digits.slice(-9).startsWith('1'));
  return (
    <View style={styles.stepContent}>
      <StepHeading title="Tell us about yourself" subtitle="Use fictional details for this demo." />
      <TextField
        label="Full name"
        value={draft.fullName}
        onChangeText={(fullName) => patch({ fullName })}
        placeholder="e.g. Amani Wanjiku"
        autoCapitalize="words"
        error={attempted && (draft.fullName.trim().length < 3 || draft.fullName.trim().split(/\s+/).length < 2) ? 'Enter a first and last name.' : undefined}
        testID="registration-full-name"
      />
      <TextField
        label="Mobile number"
        value={draft.phone}
        onChangeText={(phone) => patch({ phone })}
        placeholder="+254 700 000 128"
        keyboardType="phone-pad"
        error={attempted && !validPhone ? 'Enter a Kenyan mobile number beginning with 7 or 1.' : undefined}
        testID="registration-phone"
      />
      <TextField
        label="Email address (optional)"
        value={draft.email}
        onChangeText={(email) => patch({ email })}
        placeholder="name@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextField
        label="Date of birth"
        value={draft.dateOfBirth}
        onChangeText={(dateOfBirth) => patch({ dateOfBirth })}
        placeholder="DD/MM/YYYY"
        error={attempted && !/^\d{2}\/\d{2}\/\d{4}$/.test(draft.dateOfBirth) ? 'Enter a date in DD/MM/YYYY format.' : undefined}
      />
      <Text style={[styles.fieldHint, { color: colors.mutedForeground }]}>Use an example date, not real personal details.</Text>
    </View>
  );
}

function RiderStep({
  draft,
  patch,
  attempted,
}: {
  draft: RegistrationDraft;
  patch: (values: Partial<RegistrationDraft>) => void;
  attempted: boolean;
}) {
  const colors = useColors();
  return (
    <View style={styles.stepContent}>
      <StepHeading title="Your day-to-day riding" subtitle="This helps show relevant local SACCOs." />
      <SelectField label="County" value={draft.county} options={counties} onSelect={(county) => patch({ county })} />
      <TextField
        label="Town or operating area"
        value={draft.town}
        onChangeText={(town) => patch({ town })}
        placeholder="e.g. Kayole"
        autoCapitalize="words"
        error={attempted && !draft.town.trim() ? 'Enter your sample operating area.' : undefined}
      />
      <SelectField label="Occupation" value={draft.occupation} options={occupations} onSelect={(occupation) => patch({ occupation })} />
      <View style={styles.categoryGroup}>
        <Text style={styles.fieldTitle}>Vehicle category</Text>
        <View style={styles.categoryRow}>
          <CategoryChoice label="Two-wheeler" icon="truck" selected={draft.vehicleCategory === 'Two-wheeler'} onPress={() => patch({ vehicleCategory: 'Two-wheeler' })} />
          <CategoryChoice label="Three-wheeler" icon="truck" selected={draft.vehicleCategory === 'Three-wheeler'} onPress={() => patch({ vehicleCategory: 'Three-wheeler' })} />
        </View>
        {attempted && !draft.vehicleCategory ? <Text style={[styles.inlineError, { color: colors.destructive }]}>Choose a vehicle category.</Text> : null}
      </View>
    </View>
  );
}

function SaccoStep({
  draft,
  patch,
  attempted,
  search,
  setSearch,
  filteredSaccos,
  selectedName,
}: {
  draft: RegistrationDraft;
  patch: (values: Partial<RegistrationDraft>) => void;
  attempted: boolean;
  search: string;
  setSearch: (value: string) => void;
  filteredSaccos: typeof demoSaccos;
  selectedName?: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.stepContent}>
      <StepHeading title="Choose your SACCO" subtitle="These are fictional profiles for the affiliation demo." />
      <TextField label="Search by name or town" value={search} onChangeText={setSearch} placeholder="Try Nairobi or Mombasa" />
      <View style={styles.saccoList}>
        {filteredSaccos.map((sacco) => {
          const selected = sacco.id === draft.saccoId;
          return (
            <Pressable
              key={sacco.id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => patch({ saccoId: sacco.id })}
              style={({ pressed }) => [
                styles.saccoOption,
                {
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected ? colors.secondary : colors.card,
                },
                pressed && styles.pressed,
              ]}
              testID={`sacco-${sacco.id}`}
            >
              <View style={[styles.saccoIcon, { backgroundColor: selected ? colors.primary : colors.secondary }]}>
                <Feather name="users" size={18} color={selected ? colors.primaryForeground : colors.primary} />
              </View>
              <View style={styles.saccoCopy}>
                <Text style={[styles.saccoName, { color: colors.foreground }]}>{sacco.name}</Text>
                <Text style={[styles.saccoLocation, { color: colors.mutedForeground }]}>{sacco.town}, {sacco.county} · {sacco.memberCount} sample members</Text>
              </View>
              {selected ? <Feather name="check-circle" size={19} color={colors.primary} /> : <Feather name="circle" size={19} color={colors.border} />}
            </Pressable>
          );
        })}
        {filteredSaccos.length === 0 ? (
          <Panel><Text style={[styles.emptySearch, { color: colors.mutedForeground }]}>No sample SACCO matches that search.</Text></Panel>
        ) : null}
      </View>
      {selectedName ? (
        <Text style={[styles.fieldHint, { color: colors.success }]}>Selected for this demo request: {selectedName}</Text>
      ) : null}
      {attempted && !draft.saccoId ? <Text style={[styles.inlineError, { color: colors.destructive }]}>Select a SACCO to continue.</Text> : null}
    </View>
  );
}

function IdentityStep({
  draft,
  patch,
  attempted,
}: {
  draft: RegistrationDraft;
  patch: (values: Partial<RegistrationDraft>) => void;
  attempted: boolean;
}) {
  const colors = useColors();
  return (
    <View style={styles.stepContent}>
      <StepHeading title="Demo identity details" subtitle="This screen does not perform KYC or identity verification." />
      <Panel style={[styles.privacyPanel, { backgroundColor: colors.warningSoft, borderColor: colors.warningSoft }]}>
        <Feather name="lock" size={18} color={colors.warning} />
        <Text style={[styles.privacyCopy, { color: colors.warning }]}>Use fictional test values only. No identity document is uploaded or checked.</Text>
      </Panel>
      <SelectField label="Identity document type" value={draft.idType} options={idTypes} onSelect={(idType) => patch({ idType })} />
      <TextField
        label="Sample document number"
        value={draft.idNumber}
        onChangeText={(idNumber) => patch({ idNumber })}
        placeholder="e.g. 00000000"
        keyboardType="number-pad"
        error={attempted && draft.idNumber.trim().length < 6 ? 'Enter a fictional sample number with at least 6 digits.' : undefined}
      />
      <PlaceholderChoice
        title="Demo identity document"
        detail="Adds a placeholder label only. No file is attached."
        selected={draft.idDocumentSelected}
        onPress={() => patch({ idDocumentSelected: !draft.idDocumentSelected })}
      />
      <PlaceholderChoice
        title="Demo rider photo"
        detail="Optional placeholder, not a camera or gallery upload."
        selected={draft.riderPhotoSelected}
        onPress={() => patch({ riderPhotoSelected: !draft.riderPhotoSelected })}
      />
      {attempted && !draft.idDocumentSelected ? <Text style={[styles.inlineError, { color: colors.destructive }]}>Select the demo document placeholder.</Text> : null}
    </View>
  );
}

function ReviewStep({
  draft,
  patch,
  attempted,
  onEdit,
}: {
  draft: RegistrationDraft;
  patch: (values: Partial<RegistrationDraft>) => void;
  attempted: boolean;
  onEdit: (step: number) => void;
}) {
  const colors = useColors();
  const sacco = demoSaccos.find((item) => item.id === draft.saccoId);
  return (
    <View style={styles.stepContent}>
      <StepHeading title="Review your request" subtitle="Check each section before saving it on this device." />
      <Panel style={styles.reviewPanel}>
        <ReviewRow title="Personal details" values={[draft.fullName, draft.phone, draft.email || 'No email added', `Born ${draft.dateOfBirth}`]} onEdit={() => onEdit(1)} />
        <ReviewRow title="Rider details" values={[draft.occupation, `${draft.town}, ${draft.county}`, draft.vehicleCategory]} onEdit={() => onEdit(2)} />
        <ReviewRow title="SACCO" values={[sacco?.name ?? 'No SACCO selected', sacco ? `${sacco.town}, ${sacco.county}` : '']} onEdit={() => onEdit(3)} />
        <ReviewRow title="Identity demo" values={[draft.idType, `${draft.idNumber} · fictional`, draft.idDocumentSelected ? 'Placeholder selected' : 'No placeholder']} onEdit={() => onEdit(4)} />
      </Panel>
      <CheckboxRow
        checked={draft.acceptedTerms}
        onPress={() => patch({ acceptedTerms: !draft.acceptedTerms })}
        title="I accept the demo Terms of Use and Privacy Notice."
      />
      <CheckboxRow
        checked={draft.declaration}
        onPress={() => patch({ declaration: !draft.declaration })}
        title="I confirm these are fictional demonstration details."
        detail="Submitting creates a pending demo request; it does not approve membership."
      />
      {attempted && (!draft.acceptedTerms || !draft.declaration) ? (
        <Text style={[styles.inlineError, { color: colors.destructive }]}>Please complete both acknowledgements.</Text>
      ) : null}
    </View>
  );
}

function StepHeading({ title, subtitle }: { title: string; subtitle: string }) {
  const colors = useColors();
  return (
    <View style={styles.heading}>
      <Text style={[styles.headingTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.headingSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
    </View>
  );
}

function CategoryChoice({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: 'truck';
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.categoryChoice,
        { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.secondary : colors.card },
      ]}
    >
      <Feather name={icon} size={18} color={colors.primary} />
      <Text style={[styles.categoryLabel, { color: colors.foreground }]}>{label}</Text>
      {selected ? <Feather name="check-circle" size={16} color={colors.primary} /> : null}
    </Pressable>
  );
}

function PlaceholderChoice({
  title,
  detail,
  selected,
  onPress,
}: {
  title: string;
  detail: string;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} style={[styles.placeholder, { borderColor: selected ? colors.primary : colors.border }]}>
      <View style={[styles.placeholderIcon, { backgroundColor: colors.secondary }]}>
        <Feather name="file-text" size={17} color={colors.primary} />
      </View>
      <View style={styles.saccoCopy}>
        <Text style={[styles.saccoName, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.saccoLocation, { color: colors.mutedForeground }]}>{selected ? 'Placeholder selected' : detail}</Text>
      </View>
      <Feather name={selected ? 'check-circle' : 'plus-circle'} size={18} color={selected ? colors.primary : colors.mutedForeground} />
    </Pressable>
  );
}

function ReviewRow({
  title,
  values,
  onEdit,
}: {
  title: string;
  values: string[];
  onEdit: () => void;
}) {
  const colors = useColors();
  return (
    <View style={[styles.reviewRow, { borderBottomColor: colors.border }]}>
      <View style={styles.reviewTop}>
        <Text style={[styles.reviewTitle, { color: colors.foreground }]}>{title}</Text>
        <Pressable accessibilityRole="button" onPress={onEdit} hitSlop={10}>
          <Text style={[styles.editText, { color: colors.primary }]}>Edit</Text>
        </Pressable>
      </View>
      {values.filter(Boolean).map((value) => (
        <Text key={`${title}-${value}`} style={[styles.reviewValue, { color: colors.mutedForeground }]}>{value}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  scroll: { flex: 1 },
  form: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 60, gap: 17 },
  progressWrap: { gap: 8 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1 },
  stepName: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  progressTrack: { height: 7, borderRadius: 10, overflow: 'hidden' },
  progressFill: { height: 7, borderRadius: 10 },
  stepContent: { gap: 15 },
  heading: { gap: 5 },
  headingTitle: { fontFamily: 'Inter_700Bold', fontSize: 21, lineHeight: 28 },
  headingSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
  fieldHint: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: -8 },
  fieldTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  categoryGroup: { gap: 9 },
  categoryRow: { gap: 9 },
  categoryChoice: { minHeight: 52, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  categoryLabel: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13 },
  inlineError: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  saccoList: { gap: 9 },
  saccoOption: { minHeight: 74, flexDirection: 'row', alignItems: 'center', gap: 11, padding: 12, borderWidth: 1, borderRadius: 15 },
  saccoIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  saccoCopy: { flex: 1, gap: 4 },
  saccoName: { fontFamily: 'Inter_600SemiBold', fontSize: 13, lineHeight: 18 },
  saccoLocation: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16 },
  emptySearch: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  pressed: { opacity: 0.8 },
  privacyPanel: { flexDirection: 'row', alignItems: 'flex-start', padding: 13 },
  privacyCopy: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18 },
  placeholder: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 11, borderWidth: 1, borderRadius: 14 },
  placeholderIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  reviewPanel: { gap: 0, paddingHorizontal: 15, paddingVertical: 4 },
  reviewRow: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 4 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  editText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  reviewValue: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17 },
  validation: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 17 },
  actions: { gap: 10 },
  demoNote: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17, textAlign: 'center' },
});
