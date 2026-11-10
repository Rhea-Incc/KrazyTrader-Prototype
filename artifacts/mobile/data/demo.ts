import type {
  AppNotification,
  Dealer,
  MemberBenefit,
  Membership,
  Partner,
  Rider,
  SACCO,
  Vehicle,
} from '@/types/domain';

const createdAt = '2026-10-18T08:30:00.000Z';

export const demoRider: Rider = {
  id: 'rider-demo-01',
  firstName: 'Kamau',
  lastName: 'Njoroge',
  phone: '+254 700 000 128',
  county: 'Nairobi',
  town: 'Eastlands',
  createdAt,
  updatedAt: createdAt,
};

export const demoSaccos: SACCO[] = [
  {
    id: 'sacco-mwangaza',
    name: 'Mwangaza Riders SACCO',
    county: 'Nairobi',
    town: 'Kayole',
    memberCount: 428,
    description: 'A rider-led cooperative supporting safer, more reliable daily work.',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'sacco-umoja',
    name: 'Umoja Mobility SACCO',
    county: 'Kiambu',
    town: 'Ruiru',
    memberCount: 316,
    description: 'A local network for motorcycle and three-wheeler operators.',
    createdAt,
    updatedAt: createdAt,
  },
];

export const demoMembership: Membership = {
  id: 'membership-demo-01',
  riderId: demoRider.id,
  saccoId: demoSaccos[0].id,
  memberNumber: undefined,
  status: 'Pending',
  joinedAt: '2026-10-20T09:00:00.000Z',
  updatedAt: '2026-10-22T11:15:00.000Z',
};

export const demoDealers: Dealer[] = [
  {
    id: 'dealer-eastline',
    name: 'Eastline Motors',
    town: 'Embakasi',
    county: 'Nairobi',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'dealer-highway',
    name: 'Highway Mobility Centre',
    town: 'Thika Road',
    county: 'Nairobi',
    createdAt,
    updatedAt: createdAt,
  },
];

export const demoVehicles: Vehicle[] = [
  {
    id: 'vehicle-boxer-150',
    make: 'Bajaj',
    model: 'Boxer 150',
    year: 2025,
    category: 'Motorcycle',
    priceKsh: 185000,
    description: 'A practical daily-work motorcycle with a dependable 150cc engine.',
    dealerId: demoDealers[0].id,
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'vehicle-tvs-king',
    make: 'TVS',
    model: 'King Deluxe',
    year: 2025,
    category: 'Three-wheeler',
    priceKsh: 460000,
    description: 'A three-wheeler option for operators looking to carry more passengers.',
    dealerId: demoDealers[1].id,
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'vehicle-honda-ace',
    make: 'Honda',
    model: 'Ace CB125',
    year: 2024,
    category: 'Motorcycle',
    priceKsh: 165000,
    description: 'A compact motorcycle suited to everyday town and estate routes.',
    dealerId: demoDealers[0].id,
    createdAt,
    updatedAt: createdAt,
  },
];

export const demoPartners: Partner[] = [
  {
    id: 'partner-piki-tyres',
    name: 'Piki Tyres & Service',
    category: 'Tyres',
    town: 'Kayole',
    description: 'Tyres, puncture repairs, and basic checks from a local rider partner.',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'partner-jirani-fuel',
    name: 'Jirani Fuel Point',
    category: 'Fuel',
    town: 'Embakasi',
    description: 'A neighbourhood fuel stop with a member price on selected services.',
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: 'partner-fundilink',
    name: 'FundiLink Workshop',
    category: 'Repairs',
    town: 'Umoja',
    description: 'Routine motorcycle servicing and repairs by local mechanics.',
    createdAt,
    updatedAt: createdAt,
  },
];

export const demoBenefits: MemberBenefit[] = [
  {
    id: 'benefit-tyre-check',
    partnerId: demoPartners[0].id,
    title: 'Tyre and puncture support',
    description: 'Member pricing on puncture repair and selected replacement tyres.',
    discountLabel: 'Save up to 10%',
    category: 'Tyres',
    active: true,
  },
  {
    id: 'benefit-fuel-stop',
    partnerId: demoPartners[1].id,
    title: 'Fuel stop offers',
    description: 'A small member saving on eligible fuel and forecourt services.',
    discountLabel: 'Member price',
    category: 'Fuel',
    active: true,
  },
  {
    id: 'benefit-service',
    partnerId: demoPartners[2].id,
    title: 'Routine service check',
    description: 'Ask about member pricing for regular checks and basic servicing.',
    discountLabel: 'Partner offer',
    category: 'Repairs',
    active: true,
  },
];

export const demoNotifications: AppNotification[] = [
  {
    id: 'notification-membership',
    title: 'Membership review',
    message: 'Your Mwangaza Riders SACCO membership is waiting for review.',
    createdAt: '2026-10-22T11:15:00.000Z',
    read: false,
  },
  {
    id: 'notification-benefit',
    title: 'A new rider offer',
    message: 'Check the latest tyre and service offers near Kayole.',
    createdAt: '2026-10-20T08:00:00.000Z',
    read: true,
  },
];
