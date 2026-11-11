import { FeaturePlaceholder } from '@/components/FeaturePlaceholder';
import { router } from 'expo-router';
import React from 'react';
import { ActionButton, PageHeader, Screen, StatePanel } from '@/components/ui';
import { useDemoApp } from '@/context/DemoAppContext';

export default function InsuranceScreen() {
  const { membership } = useDemoApp();
  if (membership?.status !== 'Active') {
    return (
      <Screen>
        <PageHeader title="Insurance & safety" subtitle="Protection and emergency support" />
        <StatePanel
          variant="empty"
          title="Member services are not unlocked"
          message="This prototype keeps insurance and emergency assistance behind active membership. No cover or emergency response is available here."
        />
        <ActionButton title="View membership status" icon="users" onPress={() => router.push('/membership')} />
      </Screen>
    );
  }
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
