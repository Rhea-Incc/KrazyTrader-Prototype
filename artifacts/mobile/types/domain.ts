import type { ImageSourcePropType } from 'react-native';

export type MembershipStatus =
  | 'Submitted'
  | 'Pending verification'
  | 'Active'
  | 'Rejected'
  | 'Inactive';
export type RequestStatus = 'Draft' | 'Submitted' | 'In review' | 'Approved' | 'Declined';

export interface Rider {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  county: string;
  town: string;
  email?: string;
  dateOfBirth?: string;
  occupation?: string;
  vehicleCategory?: 'Two-wheeler' | 'Three-wheeler';
  createdAt: string;
  updatedAt: string;
}

export interface SACCO {
  id: string;
  name: string;
  county: string;
  town: string;
  memberCount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  riderId: string;
  saccoId: string;
  memberNumber?: string;
  status: MembershipStatus;
  applicationNumber?: string;
  verificationStatus?: 'Not started' | 'Not verified' | 'Pending review' | 'Verified';
  joinedAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: 'Motorcycle' | 'Three-wheeler';
  priceKsh: number;
  description: string;
  dealerId: string;
  imageSource: ImageSourcePropType;
  createdAt: string;
  updatedAt: string;
}

export interface Dealer {
  id: string;
  name: string;
  town: string;
  county: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleInquiry {
  id: string;
  riderId: string;
  vehicleId: string;
  dealerId: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FinancingApplication {
  id: string;
  reference: string;
  riderId: string;
  vehicleId: string;
  provider: string;
  amountKsh: number;
  depositKsh: number;
  termMonths: number;
  estimatedMonthlyKsh: number;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationDraft {
  step: number;
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  county: string;
  town: string;
  occupation: string;
  vehicleCategory: '' | 'Two-wheeler' | 'Three-wheeler';
  saccoId: string;
  idType: string;
  idNumber: string;
  idDocumentSelected: boolean;
  riderPhotoSelected: boolean;
  acceptedTerms: boolean;
  declaration: boolean;
}

export interface NotificationPreferences {
  membershipUpdates: boolean;
  partnerOffers: boolean;
}

export interface Partner {
  id: string;
  name: string;
  category: 'Fuel' | 'Tyres' | 'Repairs' | 'Insurance';
  town: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberBenefit {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  discountLabel: string;
  category: Partner['category'];
  active: boolean;
}

export interface SupportRequest {
  id: string;
  riderId: string;
  subject: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}
