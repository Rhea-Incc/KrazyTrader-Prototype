import { FeaturePlaceholder } from '@/components/FeaturePlaceholder';

export default function FinancingScreen() {
  return (
    <FeaturePlaceholder
      title="Financing"
      subtitle="Vehicle finance route"
      icon="credit-card"
      detail="Compare the planned financing journey for a rider vehicle. Provider connections, applications, repayments, and approvals are not part of this foundation."
      actionLabel="Browse sample vehicles"
      actionRoute="/vehicles"
    />
  );
}
