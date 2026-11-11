import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  ActionButton,
  CheckboxRow,
  PageHeader,
  Panel,
  Screen,
  SectionHeader,
  SelectField,
  VehicleCard,
} from '@/components/ui';
import { useDemoApp } from '@/context/DemoAppContext';
import { demoDealers, demoVehicles } from '@/data/demo';
import { useColors } from '@/hooks/useColors';
import { formatKsh, formatShortDate } from '@/utils/format';

const providers = ['Pamoja Mobility Finance (demo)', 'Jirani Vehicle Credit (demo)'];
const deposits = ['10%', '20%', '30%'];
const terms = ['12 months', '24 months', '36 months'];

export default function FinancingScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ vehicleId?: string }>();
  const initialVehicleId = Array.isArray(params.vehicleId) ? params.vehicleId[0] : params.vehicleId ?? '';
  const [step, setStep] = useState(1);
  const [vehicleId, setVehicleId] = useState(initialVehicleId);
  const [provider, setProvider] = useState(providers[0]);
  const [depositRate, setDepositRate] = useState('20%');
  const [term, setTerm] = useState('24 months');
  const [acceptedDemoTerms, setAcceptedDemoTerms] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [submittedReference, setSubmittedReference] = useState('');
  const { rider, financeApplications, submitFinanceApplication } = useDemoApp();
  const vehicle = demoVehicles.find((item) => item.id === vehicleId);
  const depositAmount = vehicle ? Math.round((vehicle.priceKsh * Number.parseInt(depositRate, 10)) / 100) : 0;
  const amountToFinance = vehicle ? vehicle.priceKsh - depositAmount : 0;
  const termMonths = Number.parseInt(term, 10);
  const monthlyEstimate = termMonths ? Math.ceil(amountToFinance / termMonths) : 0;
  const dealers = useMemo(() => new Map(demoDealers.map((dealer) => [dealer.id, dealer])), []);
  const draftIsReady = step === 1 ? Boolean(vehicle) : step === 3 ? acceptedDemoTerms : true;

  function continueFlow() {
    setAttempted(true);
    if (!draftIsReady) return;
    if (step < 3) {
      setStep((current) => current + 1);
      setAttempted(false);
      return;
    }
    if (!vehicle) return;
    const reference = submitFinanceApplication({
      vehicleId: vehicle.id,
      provider,
      depositKsh: depositAmount,
      termMonths,
      estimatedMonthlyKsh: monthlyEstimate,
      amountKsh: amountToFinance,
    });
    setSubmittedReference(reference);
    setAttempted(false);
  }

  return (
    <Screen>
      <PageHeader title="Demo financing" subtitle="A local vehicle finance journey" back={() => router.back()} />
      <Panel style={[styles.demoNotice, { backgroundColor: colors.warningSoft, borderColor: colors.warningSoft }]}>
        <Feather name="info" size={18} color={colors.warning} />
        <Text style={[styles.noticeText, { color: colors.warning }]}>
          Prototype only. No lender receives this request. Estimates exclude interest and fees; there is no credit check or approval.
        </Text>
      </Panel>

      {submittedReference ? (
        <Panel style={[styles.successPanel, { backgroundColor: colors.successSoft, borderColor: colors.successSoft }]}>
          <View style={[styles.successIcon, { backgroundColor: colors.background }]}>
            <Feather name="check" size={20} color={colors.success} />
          </View>
          <Text style={[styles.successTitle, { color: colors.foreground }]}>Demo request saved</Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            Your request is stored locally as {submittedReference}. This is not a lender submission or an offer.
          </Text>
          {vehicle ? <SummaryRow label="Vehicle" value={`${vehicle.make} ${vehicle.model}`} /> : null}
          <SummaryRow label="Demo provider" value={provider} />
          <SummaryRow label="Down payment" value={formatKsh(depositAmount)} />
          <SummaryRow label="Amount to finance" value={formatKsh(amountToFinance)} />
          <SummaryRow label="Illustrative monthly amount" value={`${formatKsh(monthlyEstimate)} · ${term}`} />
          <ActionButton
            title="Start another demo request"
            variant="secondary"
            icon="refresh-cw"
            onPress={() => {
              setSubmittedReference('');
              setStep(1);
              setAcceptedDemoTerms(false);
            }}
          />
        </Panel>
      ) : (
        <>
          <View style={styles.progress}>
            {['Vehicle', 'Estimate', 'Review'].map((label, index) => {
              const current = index + 1;
              const reached = current <= step;
              return (
                <View key={label} style={styles.progressItem}>
                  <View style={[styles.progressDot, { backgroundColor: reached ? colors.primary : colors.secondary }]}>
                    <Text style={[styles.progressNumber, { color: reached ? colors.primaryForeground : colors.mutedForeground }]}>{current}</Text>
                  </View>
                  <Text style={[styles.progressLabel, { color: reached ? colors.foreground : colors.mutedForeground }]}>{label}</Text>
                </View>
              );
            })}
          </View>

          {step === 1 ? (
            <View style={styles.stepSection}>
              <View style={styles.heading}>
                <Text style={[styles.headingTitle, { color: colors.foreground }]}>Choose a demo vehicle</Text>
                <Text style={[styles.body, { color: colors.mutedForeground }]}>Select one listing to create an illustrative estimate.</Text>
              </View>
              {demoVehicles.map((item) => (
                <VehicleCard key={item.id} vehicle={item} selected={vehicleId === item.id} onPress={() => setVehicleId(item.id)} />
              ))}
              {attempted && !vehicle ? <Text style={[styles.error, { color: colors.destructive }]}>Choose one vehicle to continue.</Text> : null}
            </View>
          ) : null}

          {step === 2 ? (
            <View style={styles.stepSection}>
              <View style={styles.heading}>
                <Text style={[styles.headingTitle, { color: colors.foreground }]}>Build an estimate</Text>
                <Text style={[styles.body, { color: colors.mutedForeground }]}>All provider names and terms are fictional examples.</Text>
              </View>
              {vehicle ? (
                <Panel style={styles.selectedVehicle}>
                  <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>SELECTED VEHICLE</Text>
                  <Text style={[styles.rowValue, { color: colors.foreground }]}>{vehicle.make} {vehicle.model}</Text>
                  <Text style={[styles.body, { color: colors.mutedForeground }]}>Sample price: {formatKsh(vehicle.priceKsh)}</Text>
                </Panel>
              ) : null}
              <SelectField label="Demo finance partner" value={provider} options={providers} onSelect={setProvider} />
              <SelectField label="Sample down payment" value={depositRate} options={deposits} onSelect={setDepositRate} />
              <SelectField label="Sample term" value={term} options={terms} onSelect={setTerm} />
              <Panel style={styles.estimatePanel}>
                <SummaryRow label="Vehicle price" value={vehicle ? formatKsh(vehicle.priceKsh) : '—'} />
                <SummaryRow label="Down payment" value={formatKsh(depositAmount)} />
                <SummaryRow label="Amount to finance" value={formatKsh(amountToFinance)} />
                <SummaryRow label="Monthly principal example" value={formatKsh(monthlyEstimate)} />
                <Text style={[styles.estimateDisclaimer, { color: colors.mutedForeground }]}>
                  Simple division only. Interest, fees, insurance and provider eligibility are not included.
                </Text>
              </Panel>
            </View>
          ) : null}

          {step === 3 ? (
            <View style={styles.stepSection}>
              <View style={styles.heading}>
                <Text style={[styles.headingTitle, { color: colors.foreground }]}>Review demo request</Text>
                <Text style={[styles.body, { color: colors.mutedForeground }]}>This step saves a local example only.</Text>
              </View>
              <Panel style={styles.reviewPanel}>
                <SummaryRow label="Rider" value={rider ? `${rider.firstName} ${rider.lastName}` : 'Demo rider'} />
                <SummaryRow label="Vehicle" value={vehicle ? `${vehicle.make} ${vehicle.model}` : 'Choose a vehicle'} />
                <SummaryRow label="Demo partner" value={provider} />
                <SummaryRow label="Down payment" value={formatKsh(depositAmount)} />
                <SummaryRow label="Amount to finance" value={formatKsh(amountToFinance)} />
                <SummaryRow label="Term" value={term} />
                <SummaryRow label="Illustrative monthly amount" value={`${formatKsh(monthlyEstimate)} · principal only`} />
                {vehicle ? (
                  <Text style={[styles.dealerLine, { color: colors.mutedForeground, borderTopColor: colors.border }]}>
                    Sample dealer: {dealers.get(vehicle.dealerId)?.name ?? 'Demo dealer'}
                  </Text>
                ) : null}
              </Panel>
              <CheckboxRow
                checked={acceptedDemoTerms}
                onPress={() => setAcceptedDemoTerms((current) => !current)}
                title="I understand this is not a real lender offer or credit decision."
                detail="No request, identity details or payment information is shared."
              />
              {attempted && !acceptedDemoTerms ? (
                <Text style={[styles.error, { color: colors.destructive }]}>Confirm the demo-only terms before saving.</Text>
              ) : null}
            </View>
          ) : null}

          <View style={styles.actions}>
            {step > 1 ? <ActionButton title="Back" variant="secondary" icon="arrow-left" onPress={() => { setStep((current) => current - 1); setAttempted(false); }} /> : null}
            <ActionButton
              title={step === 3 ? 'Save demo request' : 'Continue'}
              icon={step === 3 ? 'check' : 'arrow-right'}
              onPress={continueFlow}
              testID={`financing-step-${step}-continue`}
            />
          </View>
        </>
      )}

      {financeApplications.length > 0 ? (
        <View style={styles.historySection}>
          <SectionHeader title="Saved demo requests" />
          {financeApplications.slice(0, 4).map((application) => {
            const savedVehicle = demoVehicles.find((item) => item.id === application.vehicleId);
            return (
              <Panel key={application.id} style={styles.historyCard}>
                <View style={styles.historyHeading}>
                    <View style={[styles.historyIcon, { backgroundColor: colors.secondary }]}>
                    <Feather name="file-text" size={17} color={colors.primary} />
                  </View>
                  <View style={styles.historyCopy}>
                    <Text style={[styles.rowValue, { color: colors.foreground }]}>{savedVehicle ? `${savedVehicle.make} ${savedVehicle.model}` : 'Demo vehicle request'}</Text>
                    <Text style={[styles.body, { color: colors.mutedForeground }]}>{application.reference} · {formatShortDate(application.createdAt)}</Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: colors.warningSoft }]}>
                    <Text style={[styles.statusText, { color: colors.warning }]}>Saved</Text>
                  </View>
                </View>
                <Text style={[styles.body, { color: colors.mutedForeground }]}>
                  {formatKsh(application.amountKsh)} over {application.termMonths} months · local only
                </Text>
              </Panel>
            );
          })}
        </View>
      ) : null}
      <Text style={[styles.footer, { color: colors.mutedForeground }]}>
        No lender, credit bureau, bank, SACCO or payment integration is active in this prototype.
      </Text>
    </Screen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.body, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  demoNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 13 },
  noticeText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18 },
  progress: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  progressItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  progressDot: { width: 24, height: 24, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  progressNumber: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  progressLabel: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  stepSection: { gap: 13 },
  heading: { gap: 4 },
  headingTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, lineHeight: 27 },
  body: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18 },
  selectedVehicle: { gap: 4, padding: 13 },
  metaLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1 },
  rowValue: { fontFamily: 'Inter_600SemiBold', fontSize: 13, lineHeight: 18 },
  estimatePanel: { gap: 11, padding: 14 },
  summaryRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 },
  estimateDisclaimer: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 9, marginTop: 2 },
  reviewPanel: { gap: 12, padding: 14 },
  dealerLine: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 9 },
  actions: { gap: 9 },
  error: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  successPanel: { gap: 12, padding: 17 },
  successIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  historySection: { gap: 10 },
  historyCard: { gap: 9, padding: 13 },
  historyHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  historyIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  historyCopy: { flex: 1, gap: 2 },
  statusPill: { borderRadius: 30, paddingHorizontal: 9, paddingVertical: 5 },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  footer: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17, textAlign: 'center' },
});
