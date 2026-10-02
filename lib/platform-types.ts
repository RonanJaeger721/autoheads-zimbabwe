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
