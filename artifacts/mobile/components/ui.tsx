import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import type { MembershipStatus, Vehicle } from '@/types/domain';
import { formatKsh } from '@/utils/format';

type IconName = React.ComponentProps<typeof Feather>['name'];

export function Screen({
  children,
  contentStyle,
  scroll = true,
}: {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  scroll?: boolean;
}) {
  const colors = useColors();
  const screenStyle = [
    styles.screen,
    {
      backgroundColor: colors.background,
      paddingTop: Platform.OS === 'web' ? 67 : 0,
      paddingBottom: Platform.OS === 'web' ? 34 : 0,
    },
  ];
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.screenContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.screenContent, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={screenStyle}>
      {body}
    </SafeAreaView>
  );
}

export function BrandMark({ size = 42 }: { size?: number }) {
  const colors = useColors();
  return (
    <View
      accessibilityLabel="KrazyTrader"
      style={[
        styles.brandMark,
        { width: size, height: size, borderRadius: size / 3, backgroundColor: colors.primary },
      ]}
    >
      <Feather name="navigation" size={size * 0.48} color={colors.accent} />
    </View>
  );
}

export function PageHeader({
  title,
  subtitle,
  back,
  rightIcon,
  onRightPress,
}: {
  title: string;
  subtitle?: string;
  back?: () => void;
  rightIcon?: IconName;
  onRightPress?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.pageHeader}>
      {back ? (
        <IconButton icon="arrow-left" label="Go back" onPress={back} />
      ) : null}
      <View style={styles.pageHeaderCopy}>
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
        ) : null}
      </View>
      {rightIcon && onRightPress ? (
        <IconButton icon={rightIcon} label={rightIcon === 'bell' ? 'Notifications' : 'Open menu'} onPress={onRightPress} />
      ) : null}
    </View>
  );
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [styles.textAction, pressed && styles.pressed]}
        >
          <Text style={[styles.actionText, { color: colors.primary }]}>{actionLabel}</Text>
          <Feather name="arrow-up-right" size={15} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function ActionButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  testID,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'quiet';
  icon?: IconName;
  disabled?: boolean;
  testID?: string;
}) {
  const colors = useColors();
  const backgroundColor =
    variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.secondary : 'transparent';
  const textColor = variant === 'primary' ? colors.primaryForeground : colors.foreground;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        void Haptics.selectionAsync().catch(() => undefined);
        onPress();
      }}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderColor: variant === 'quiet' ? 'transparent' : colors.border },
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      {icon ? <Feather name={icon} size={17} color={textColor} /> : null}
      <Text style={[styles.buttonLabel, { color: textColor }]}>{title}</Text>
    </Pressable>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
  ...props
}: Omit<PressableProps, 'onPress'> & {
  icon: IconName;
  label: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
    >
      <Feather name={icon} size={20} color={colors.foreground} />
    </Pressable>
  );
}

export function Panel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const colors = useColors();
  return (
    <View style={[styles.panel, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
      {children}
    </View>
  );
}

export function MembershipStatusIndicator({ status }: { status: MembershipStatus }) {
  const colors = useColors();
  const palette =
    status === 'Approved'
      ? { backgroundColor: colors.successSoft, color: colors.success, icon: 'check-circle' as const }
      : status === 'Pending'
        ? { backgroundColor: colors.warningSoft, color: colors.warning, icon: 'clock' as const }
        : status === 'Rejected'
          ? { backgroundColor: colors.dangerSoft, color: colors.destructive, icon: 'alert-circle' as const }
          : { backgroundColor: colors.secondary, color: colors.mutedForeground, icon: 'minus-circle' as const };

  return (
    <View style={[styles.statusBadge, { backgroundColor: palette.backgroundColor }]}>
      <Feather name={palette.icon} size={13} color={palette.color} />
      <Text style={[styles.statusText, { color: palette.color }]}>{status}</Text>
    </View>
  );
}

export function TextField({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  const colors = useColors();
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.mutedForeground}
        style={[
          styles.input,
          { borderColor: error ? colors.destructive : colors.input, color: colors.foreground },
          props.style,
        ]}
      />
      {error ? <Text style={[styles.fieldError, { color: colors.destructive }]}>{error}</Text> : null}
    </View>
  );
}

export function SelectField({
  label,
  value,
  options,
  onSelect,
  placeholder = 'Choose an option',
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}) {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value || placeholder}`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.selectButton,
          { borderColor: colors.input, backgroundColor: colors.background },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.selectText, { color: value ? colors.foreground : colors.mutedForeground }]}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={17} color={colors.mutedForeground} />
      </Pressable>
      <Modal
        animationType="slide"
        onRequestClose={() => setOpen(false)}
        transparent
        visible={open}
      >
        <View style={styles.modalScrim}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />
          <View style={[styles.optionSheet, { backgroundColor: colors.background }]}>
            <View style={styles.sheetHeading}>
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>{label}</Text>
              <IconButton icon="x" label="Close options" onPress={() => setOpen(false)} />
            </View>
            <ScrollView>
              {options.map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  onPress={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.optionRow,
                    { borderBottomColor: colors.border },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.optionText, { color: colors.foreground }]}>{option}</Text>
                  {value === option ? <Feather name="check" size={18} color={colors.primary} /> : null}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function VehicleCard({
  vehicle,
  onPress,
}: {
  vehicle: Vehicle;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.vehicleCard,
        { borderColor: colors.border, backgroundColor: colors.card },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.vehicleIcon, { backgroundColor: colors.secondary }]}>
        <Feather name={vehicle.category === 'Motorcycle' ? 'truck' : 'truck'} size={22} color={colors.primary} />
      </View>
      <View style={styles.vehicleCopy}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>{vehicle.make} {vehicle.model}</Text>
        <Text style={[styles.cardMeta, { color: colors.mutedForeground }]}>{vehicle.year} · {vehicle.category}</Text>
        <Text style={[styles.vehiclePrice, { color: colors.primary }]}>{formatKsh(vehicle.priceKsh)}</Text>
      </View>
      <Feather name="chevron-right" size={19} color={colors.mutedForeground} />
    </Pressable>
  );
}

export function SaccoCard({
  name,
  location,
  memberCount,
  description,
  onPress,
}: {
  name: string;
  location: string;
  memberCount: number;
  description: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.saccoCard,
        { borderColor: colors.border, backgroundColor: colors.card },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.saccoMark, { backgroundColor: colors.secondary }]}>
        <Feather name="users" size={19} color={colors.primary} />
      </View>
      <View style={styles.saccoCopy}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>{name}</Text>
        <Text style={[styles.cardMeta, { color: colors.mutedForeground }]}>{location} · {memberCount} members</Text>
        <Text numberOfLines={2} style={[styles.cardDescription, { color: colors.mutedForeground }]}>{description}</Text>
      </View>
      <Feather name="chevron-right" size={19} color={colors.mutedForeground} />
    </Pressable>
  );
}

export function BenefitCard({
  title,
  description,
  discountLabel,
  category,
  onPress,
}: {
  title: string;
  description: string;
  discountLabel: string;
  category: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.benefitCard,
        { backgroundColor: colors.secondary },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.benefitTop}>
        <View style={[styles.benefitIcon, { backgroundColor: colors.background }]}>
          <Feather name={category === 'Fuel' ? 'droplet' : category === 'Tyres' ? 'circle' : 'tool'} size={19} color={colors.primary} />
        </View>
        <Text style={[styles.benefitLabel, { color: colors.primary }]}>{discountLabel}</Text>
      </View>
      <Text style={[styles.cardTitle, { color: colors.foreground }]}>{title}</Text>
      <Text numberOfLines={2} style={[styles.cardDescription, { color: colors.mutedForeground }]}>{description}</Text>
      <View style={styles.cardFooter}>
        <Text style={[styles.cardMeta, { color: colors.mutedForeground }]}>{category}</Text>
        <Feather name="arrow-up-right" size={16} color={colors.primary} />
      </View>
    </Pressable>
  );
}

export function NotificationItem({
  title,
  message,
  date,
  read,
  onPress,
}: {
  title: string;
  message: string;
  date: string;
  read: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}${read ? '' : ', unread'}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.notificationItem,
        { backgroundColor: read ? colors.card : colors.secondary, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.notificationIcon, { backgroundColor: colors.background }]}>
        <Feather name="bell" size={18} color={colors.primary} />
      </View>
      <View style={styles.notificationCopy}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.cardDescription, { color: colors.mutedForeground }]}>{message}</Text>
        <Text style={[styles.cardMeta, { color: colors.mutedForeground }]}>{date}</Text>
      </View>
      {!read ? <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} /> : null}
    </Pressable>
  );
}

export function StatePanel({
  variant,
  title,
  message,
  actionLabel,
  onAction,
}: {
  variant: 'loading' | 'empty' | 'error';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const colors = useColors();
  const icon = variant === 'empty' ? 'inbox' : variant === 'error' ? 'alert-circle' : undefined;
  return (
    <Panel style={styles.statePanel}>
      {variant === 'loading' ? <ActivityIndicator color={colors.primary} /> : null}
      {icon ? <Feather name={icon} size={26} color={variant === 'error' ? colors.destructive : colors.mutedForeground} /> : null}
      <Text style={[styles.cardTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.cardDescription, { color: colors.mutedForeground, textAlign: 'center' }]}>{message}</Text>
      {actionLabel && onAction ? (
        <ActionButton title={actionLabel} variant="secondary" onPress={onAction} />
      ) : null}
    </Panel>
  );
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Got it',
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const colors = useColors();
  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={visible}
    >
      <View style={styles.dialogBackdrop}>
        <Panel style={styles.dialogCard}>
          <Text style={[styles.dialogTitle, { color: colors.foreground }]}>{title}</Text>
          <Text style={[styles.cardDescription, { color: colors.mutedForeground }]}>{message}</Text>
          <View style={styles.dialogActions}>
            <ActionButton title="Cancel" variant="secondary" onPress={onCancel} />
            <ActionButton title={confirmLabel} onPress={onConfirm} />
          </View>
        </Panel>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  screenContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 116, gap: 22 },
  brandMark: { alignItems: 'center', justifyContent: 'center' },
  pageHeader: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12 },
  pageHeaderCopy: { flex: 1, gap: 3 },
  pageTitle: { fontFamily: 'Inter_700Bold', fontSize: 23, lineHeight: 29 },
  pageSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 18 },
  iconButton: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, lineHeight: 23 },
  textAction: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 3 },
  actionText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  button: {
    minHeight: 50,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  buttonLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.45 },
  panel: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 },
  statusBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 100, paddingVertical: 6, paddingHorizontal: 10 },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  fieldGroup: { gap: 8 },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  input: { minHeight: 50, paddingHorizontal: 14, borderWidth: 1, borderRadius: 13, fontFamily: 'Inter_400Regular', fontSize: 15 },
  fieldError: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  selectButton: { minHeight: 50, paddingHorizontal: 14, borderWidth: 1, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectText: { fontFamily: 'Inter_400Regular', fontSize: 15 },
  modalScrim: { flex: 1, backgroundColor: 'rgba(12, 23, 40, 0.42)', justifyContent: 'flex-end' },
  optionSheet: { maxHeight: '72%', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 30 },
  sheetHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sheetTitle: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  optionRow: { minHeight: 54, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionText: { fontFamily: 'Inter_500Medium', fontSize: 15 },
  vehicleCard: { minHeight: 94, flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1 },
  vehicleIcon: { width: 52, height: 52, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  vehicleCopy: { flex: 1, gap: 3 },
  cardTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, lineHeight: 21 },
  cardMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17 },
  vehiclePrice: { fontFamily: 'Inter_700Bold', fontSize: 14, marginTop: 2 },
  saccoCard: { minHeight: 104, padding: 14, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  saccoMark: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  saccoCopy: { flex: 1, gap: 4 },
  cardDescription: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
  benefitCard: { width: 246, minHeight: 174, borderRadius: 18, padding: 15, justifyContent: 'space-between', gap: 10 },
  benefitTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  benefitIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  benefitLabel: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notificationItem: { minHeight: 105, borderWidth: 1, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  notificationIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  notificationCopy: { flex: 1, gap: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 5, marginTop: 6 },
  statePanel: { alignItems: 'center', paddingVertical: 24 },
  dialogBackdrop: { flex: 1, padding: 22, backgroundColor: 'rgba(12, 23, 40, 0.45)', alignItems: 'center', justifyContent: 'center' },
  dialogCard: { width: '100%', maxWidth: 420, padding: 22 },
  dialogTitle: { fontFamily: 'Inter_700Bold', fontSize: 19, lineHeight: 26 },
  dialogActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' },
});
