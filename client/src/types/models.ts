import { ApplicationStatus, ComplaintStatus, DocumentStatus, Gender, SupportType, UserRole } from './enums';

export interface User {
  id: string;
  full_name: string;
  username: string;
  email?: string;
  phone?: string;
  role: UserRole;
  kebele_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface Wereda {
  id: string;
  name: string;
  code: string;
  region: string;
}

export interface Kebele {
  id: string;
  wereda_id: string;
  name: string;
  code: string;
}

export interface Person {
  id: string;
  full_name: string;
  date_of_birth?: string;
  gender: Gender;
  national_id?: string;
  fan?: string;
  fin?: string;
  phone?: string;
}

export interface HouseholdMember {
  id: string;
  person_id: string;
  full_name: string;
  relationship_to_head: string;
  is_head: boolean;
  date_of_birth?: string;
  gender: Gender;
  national_id?: string;
}

export interface Household {
  id: string;
  kebele_id: string;
  kebele_name?: string;
  village?: string;
  household_size: number;
  registration_reason_id?: string;
  other_reason_description?: string;
  status: ApplicationStatus;
  created_at: string;
  members?: HouseholdMember[];
}

export interface Application {
  id: string;
  reference_number: string;
  household_id: string;
  kebele_id?: string;
  kebele_name?: string;
  status: ApplicationStatus;
  submitted_at?: string;
  created_at: string;
}

export interface ApplicationDecision {
  id: string;
  application_id: string;
  decision_level: 'KEBELE' | 'WEREDA';
  decision_type: string;
  reason?: string;
  decided_by: string;
  decided_by_name?: string;
  decided_at: string;
}

export interface Assessment {
  id: string;
  application_id: string;
  income_level?: string;
  employment_status?: string;
  housing_status?: string;
  food_security_level?: string;
  has_disability: boolean;
  has_elderly_members: boolean;
  has_dependent_children: boolean;
  vulnerability_level?: string;
  eligibility_score?: number;
  notes?: string;
  assessed_at: string;
}

export interface Document {
  id: string;
  application_id: string;
  document_type: string;
  document_number?: string;
  file_path: string;
  status: DocumentStatus;
  uploaded_at: string;
  verified_at?: string;
}

export interface SupportProgram {
  id: string;
  name: string;
  support_type: SupportType;
  description?: string;
  is_active: boolean;
}

export interface SupportDistribution {
  id: string;
  household_id: string;
  program_name: string;
  support_type: SupportType;
  amount?: number;
  quantity?: string;
  distributed_at: string;
  location?: string;
}

export interface Feedback {
  id: string;
  message: string;
  rating?: number;
  is_anonymous: boolean;
  status: string;
  submitted_at: string;
  kebele_id?: string;
}

export interface Complaint {
  id: string;
  complaint_reference: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: ComplaintStatus;
  is_anonymous: boolean;
  assigned_to?: string;
  submitted_at: string;
  resolved_at?: string;
  closed_at?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  entity_type?: string;
  entity_id?: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  role?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  reason?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
