import { FeaturePlaceholder } from '@/components/FeaturePlaceholder';

export default function SupportScreen() {
  return (
    <FeaturePlaceholder
      title="Rider support"
      subtitle="Help when you need it"
      icon="headphones"
      detail="The future support module will help riders find answers and request help. This prototype does not send support requests or contact emergency services."
      actionLabel="Back to profile"
      actionRoute="/profile"
    />
  );
}
