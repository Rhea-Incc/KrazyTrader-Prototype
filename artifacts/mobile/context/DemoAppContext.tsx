import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { demoNotifications, demoRider, demoSaccos } from '@/data/demo';
import type {
  AppNotification,
  FinancingApplication,
  Membership,
  MembershipStatus,
  NotificationPreferences,
  RegistrationDraft,
  Rider,
} from '@/types/domain';

const STORAGE_KEY = 'krazytrader-demo-state-v2';

export function emptyRegistrationDraft(): RegistrationDraft {
  return {
    step: 1,
    fullName: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    county: '',
    town: '',
    occupation: '',
    vehicleCategory: '',
    saccoId: '',
    idType: 'National ID (demo)',
    idNumber: '',
    idDocumentSelected: false,
    riderPhotoSelected: false,
    acceptedTerms: false,
    declaration: false,
  };
}

interface DemoAppData {
  signedIn: boolean;
  rider: Rider | null;
  membership: Membership | null;
  registrationDraft: RegistrationDraft;
  financeApplications: FinancingApplication[];
  notifications: AppNotification[];
  notificationPreferences: NotificationPreferences;
}

interface NewFinanceApplication {
  vehicleId: string;
  provider: string;
  depositKsh: number;
  termMonths: number;
  estimatedMonthlyKsh: number;
  amountKsh: number;
}

interface DemoAppContextValue extends DemoAppData {
  isHydrated: boolean;
  persistenceWarning: string | null;
  updateRegistrationDraft: (patch: Partial<RegistrationDraft>) => void;
  signIn: (phone: string) => void;
  logOut: () => void;
  submitRegistration: (draft: RegistrationDraft) => string;
  updateRider: (patch: Partial<Rider>) => void;
  setMembershipStatus: (status: MembershipStatus | null) => void;
  submitFinanceApplication: (application: NewFinanceApplication) => string;
  markNotificationRead: (id: string) => void;
  setNotificationPreference: (key: keyof NotificationPreferences, enabled: boolean) => void;
  resetDemoData: () => void;
}

const defaultData: DemoAppData = {
  signedIn: false,
  rider: null,
  membership: null,
  registrationDraft: emptyRegistrationDraft(),
  financeApplications: [],
  notifications: demoNotifications,
  notificationPreferences: {
    membershipUpdates: true,
    partnerOffers: true,
  },
};

const DemoAppContext = createContext<DemoAppContextValue | null>(null);

function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('254')) return `+${digits}`;
  if (digits.startsWith('0')) return `+254${digits.slice(1)}`;
  return `+254${digits}`;
}

function makeReference(prefix: string, now: number): string {
  return `${prefix}-${now.toString(36).slice(-7).toUpperCase()}`;
}

function parseStoredData(raw: string | null): DemoAppData {
  if (!raw) return defaultData;
  const parsed = JSON.parse(raw) as Partial<DemoAppData>;
  return {
    ...defaultData,
    ...parsed,
    registrationDraft: {
      ...emptyRegistrationDraft(),
      ...parsed.registrationDraft,
    },
    financeApplications: Array.isArray(parsed.financeApplications) ? parsed.financeApplications : [],
    notifications: Array.isArray(parsed.notifications) ? parsed.notifications : demoNotifications,
    notificationPreferences: {
      ...defaultData.notificationPreferences,
      ...parsed.notificationPreferences,
    },
  };
}

export function DemoAppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoAppData>(defaultData);
  const [isHydrated, setIsHydrated] = useState(false);
  const [persistenceWarning, setPersistenceWarning] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (isMounted) setData(parseStoredData(saved));
      })
      .catch(() => {
        if (isMounted) setPersistenceWarning('Demo data could not be loaded from this device.');
      })
      .finally(() => {
        if (isMounted) setIsHydrated(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      .then(() => setPersistenceWarning(null))
      .catch(() => setPersistenceWarning('Changes could not be saved on this device.'));
  }, [data, isHydrated]);

  const updateRegistrationDraft = useCallback((patch: Partial<RegistrationDraft>) => {
    setData((current) => ({
      ...current,
      registrationDraft: { ...current.registrationDraft, ...patch },
    }));
  }, []);

  const signIn = useCallback((phone: string) => {
    const normalizedPhone = normalizePhone(phone);
    setData((current) => {
      if (current.rider?.phone === normalizedPhone) return { ...current, signedIn: true };

      const now = new Date().toISOString();
      const rider =
        normalizedPhone === normalizePhone(demoRider.phone)
          ? { ...demoRider, updatedAt: now }
          : {
              ...demoRider,
              id: `rider-${Date.now().toString(36)}`,
              firstName: 'Demo',
              lastName: 'Rider',
              phone: normalizedPhone,
              county: 'Nairobi',
              town: 'Eastlands',
              createdAt: now,
              updatedAt: now,
            };

      return {
        ...current,
        signedIn: true,
        rider,
        membership: null,
        financeApplications: [],
        registrationDraft: emptyRegistrationDraft(),
      };
    });
  }, []);

  const logOut = useCallback(() => {
    setData((current) => ({ ...current, signedIn: false }));
  }, []);

  const submitRegistration = useCallback((draft: RegistrationDraft) => {
    const now = Date.now();
    const createdAt = new Date(now).toISOString();
    const reference = makeReference('KT', now);
    const [firstName = 'Demo', ...lastParts] = draft.fullName.trim().split(/\s+/);
    const lastName = lastParts.join(' ') || 'Rider';
    const selectedSacco = demoSaccos.find((item) => item.id === draft.saccoId) ?? demoSaccos[0];
    const rider: Rider = {
      id: `rider-${now.toString(36)}`,
      firstName,
      lastName,
      phone: normalizePhone(draft.phone),
      email: draft.email.trim() || undefined,
      dateOfBirth: draft.dateOfBirth.trim(),
      county: draft.county,
      town: draft.town.trim(),
      occupation: draft.occupation,
      vehicleCategory: draft.vehicleCategory === 'Three-wheeler' ? 'Three-wheeler' : 'Two-wheeler',
      createdAt,
      updatedAt: createdAt,
    };
    const membership: Membership = {
      id: `membership-${now.toString(36)}`,
      riderId: rider.id,
      saccoId: selectedSacco.id,
      status: 'Submitted',
      applicationNumber: reference,
      verificationStatus: 'Not verified',
      joinedAt: createdAt,
      updatedAt: createdAt,
    };
    setData((current) => ({
      ...current,
      signedIn: true,
      rider,
      membership,
      registrationDraft: emptyRegistrationDraft(),
      notifications: [
        {
          id: `notification-${now.toString(36)}`,
          title: 'Application submitted',
          message: `Your ${selectedSacco.name} request is submitted for review.`,
          createdAt,
          read: false,
        },
        ...current.notifications,
      ],
    }));
    return reference;
  }, []);

  const updateRider = useCallback((patch: Partial<Rider>) => {
    setData((current) => {
      if (!current.rider) return current;
      return {
        ...current,
        rider: { ...current.rider, ...patch, updatedAt: new Date().toISOString() },
      };
    });
  }, []);

  const setMembershipStatus = useCallback((status: MembershipStatus | null) => {
    setData((current) => {
      if (!status) return { ...current, membership: null };
      const now = new Date().toISOString();
      const saccoId = current.membership?.saccoId || current.registrationDraft.saccoId || demoSaccos[0].id;
      const membership: Membership = {
        id: current.membership?.id ?? `membership-${Date.now().toString(36)}`,
        riderId: current.rider?.id ?? demoRider.id,
        saccoId,
        status,
        applicationNumber:
          current.membership?.applicationNumber ?? makeReference('KT-DEMO', Date.now()),
        memberNumber:
          status === 'Active'
            ? current.membership?.memberNumber ?? makeReference('KT-M', Date.now())
            : undefined,
        verificationStatus:
          status === 'Active'
            ? 'Verified'
            : status === 'Pending verification'
              ? 'Pending review'
              : status === 'Rejected'
                ? 'Not verified'
                : 'Not verified',
        joinedAt: current.membership?.joinedAt ?? now,
        updatedAt: now,
      };
      return { ...current, membership };
    });
  }, []);

  const submitFinanceApplication = useCallback((application: NewFinanceApplication) => {
    const now = Date.now();
    const createdAt = new Date(now).toISOString();
    const reference = makeReference('KTF', now);
    const item: FinancingApplication = {
      id: `finance-${now.toString(36)}`,
      reference,
      riderId: data.rider?.id ?? demoRider.id,
      vehicleId: application.vehicleId,
      provider: application.provider,
      amountKsh: application.amountKsh,
      depositKsh: application.depositKsh,
      termMonths: application.termMonths,
      estimatedMonthlyKsh: application.estimatedMonthlyKsh,
      status: 'Submitted',
      createdAt,
      updatedAt: createdAt,
    };
    setData((current) => ({
      ...current,
      financeApplications: [item, ...current.financeApplications],
      notifications: [
        {
          id: `notification-${now.toString(36)}`,
          title: 'Demo financing request saved',
          message: `Your local demonstration reference is ${reference}.`,
          createdAt,
          read: false,
        },
        ...current.notifications,
      ],
    }));
    return reference;
  }, [data.rider?.id]);

  const markNotificationRead = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      notifications: current.notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    }));
  }, []);

  const setNotificationPreference = useCallback(
    (key: keyof NotificationPreferences, enabled: boolean) => {
      setData((current) => ({
        ...current,
        notificationPreferences: {
          ...current.notificationPreferences,
          [key]: enabled,
        },
      }));
    },
    [],
  );

  const resetDemoData = useCallback(() => {
    setData({
      ...defaultData,
      registrationDraft: emptyRegistrationDraft(),
      notifications: demoNotifications,
    });
  }, []);

  const value = useMemo(
    () => ({
      ...data,
      isHydrated,
      persistenceWarning,
      updateRegistrationDraft,
      signIn,
      logOut,
      submitRegistration,
      updateRider,
      setMembershipStatus,
      submitFinanceApplication,
      markNotificationRead,
      setNotificationPreference,
      resetDemoData,
    }),
    [
      data,
      isHydrated,
      persistenceWarning,
      updateRegistrationDraft,
      signIn,
      logOut,
      submitRegistration,
      updateRider,
      setMembershipStatus,
      submitFinanceApplication,
      markNotificationRead,
      setNotificationPreference,
      resetDemoData,
    ],
  );

  return <DemoAppContext.Provider value={value}>{children}</DemoAppContext.Provider>;
}

export function useDemoApp() {
  const context = useContext(DemoAppContext);
  if (!context) throw new Error('useDemoApp must be used inside DemoAppProvider');
  return context;
}
