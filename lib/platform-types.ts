export type ApplicationStatus =
  | 'Pending'
  | 'Approved'
  | 'Needs review'
  | 'Archived';

export type BusinessApplication = {
  id: string;
  name: string;
  type: string;
  location: string;
  area?: string;
  address?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  categories?: string[];
  otherServices?: string;
  status: ApplicationStatus;
  active: boolean;
  featured: boolean;
  verified: boolean;
  subscriptionLevel: 'Basic' | 'Standard' | 'Premium';
  submitted: string;
  createdAt: string;
  updatedAt: string;
};

export type MotoristAccount = {
  id: string;
  firstName: string;
  gender: string;
  email: string;
  phone: string;
  city: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  fuel?: string;
  marketingOptIn: boolean;
  passwordHash: string;
  createdAt: string;
};

export type AdvertRecord = {
  id: string;
  title: string;
  placement: 'Banner' | 'Skyscraper / Side' | 'Footer' | 'In-content';
  imageUrl: string;
  linkUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
