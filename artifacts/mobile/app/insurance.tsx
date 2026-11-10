import { FeaturePlaceholder } from '@/components/FeaturePlaceholder';

export default function InsuranceScreen() {
  return (
    <FeaturePlaceholder
      title="Insurance & safety"
      subtitle="Protection and emergency support"
      icon="shield"
      detail="This route is reserved for insurance information and emergency assistance. It does not provide coverage, emergency dispatch, or insurer connections."
      actionLabel="View member benefits"
      actionRoute="/benefits"
    />
  );
}
