import React, { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { NotificationItem, PageHeader, Screen, SectionHeader, StatePanel } from '@/components/ui';
import { demoNotifications } from '@/data/demo';
import type { AppNotification } from '@/types/domain';
import { formatShortDate } from '@/utils/format';
import { useColors } from '@/hooks/useColors';

export default function NotificationsScreen() {
  const colors = useColors();
  const [notifications, setNotifications] = useState<AppNotification[]>(demoNotifications);
  return (
    <Screen>
      <PageHeader title="Notifications" subtitle="Updates from your demo account" back={() => router.back()} />
      {notifications.length > 0 ? (
        <View style={styles.content}>
          <SectionHeader title="Recent updates" />
          {notifications.map((item) => (
            <NotificationItem
              key={item.id}
              title={item.title}
              message={item.message}
              date={formatShortDate(item.createdAt)}
              read={item.read}
              onPress={() => setNotifications((current) => current.map((notification) => (
                notification.id === item.id ? { ...notification, read: true } : notification
              )))}
            />
          ))}
          <Text style={[styles.note, { color: colors.mutedForeground }]}>Tap an update to mark it as read. These changes only last for this preview session.</Text>
        </View>
      ) : (
        <StatePanel variant="empty" title="You’re all caught up" message="New updates will appear here." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12 },
  note: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 4 },
});
