import {
  ApplicationStatus,
  ComplaintStatus,
  DocumentStatus,
  DecisionLevel,
  DecisionType,
  Gender,
  SupportType,
  FeedbackStatus,
} from './enums';

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface Wereda {
  id: string;
  name: string;
  code: string;
  region: string;
  created_at: Date;
  updated_at: Date;
}

export interface Kebele {
  id: string;
  wereda_id: string;
  name: string;
  code: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  kebele_id?: string;
  full_name: string;
  username: string;
  email?: string;
  phone?: string;
  password_hash: string;
  role: string;
  is_active: boolean;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

// ─── Identity & Household ─────────────────────────────────────────────────────

export interface Person {
  id: string;
  full_name: string;
  date_of_birth?: Date;
  gender: Gender;
  national_id?: string;
  fan?: string;
  fin?: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Household {
  id: string;
  kebele_id: string;
  household_head_person_id?: string;
  village?: string;
  household_size: number;
  registration_reason_id?: string;
  other_reason_description?: string;
  status: ApplicationStatus;
  created_at: Date;
  updated_at: Date;
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  person_id: string;
  relationship_to_head: string;
  is_head: boolean;
  joined_at: Date;
  left_at?: Date;
}

// ─── Application ──────────────────────────────────────────────────────────────

export interface Application {
  id: string;
  reference_number: string;
  household_id: string;
  submitted_by_person_id?: string;
  registered_by_user_id?: string;
  status: ApplicationStatus;
  submitted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// ─── Assessment ───────────────────────────────────────────────────────────────

export interface Assessment {
  id: string;
  application_id: string;
  assessed_by: string;
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
  assessed_at: Date;
}

// ─── Documents ────────────────────────────────────────────────────────────────

export interface Document {
  id: string;
  application_id: string;
  person_id?: string;
  document_type: string;
  document_number?: string;
  file_path: string;
  mime_type: string;
  status: DocumentStatus;
  uploaded_by: string;
  uploaded_at: Date;
  verified_by?: string;
  verified_at?: Date;
}

// ─── Decisions ────────────────────────────────────────────────────────────────

export interface ApplicationDecision {
  id: string;
  application_id: string;
  batch_id?: string;
  decision_level: DecisionLevel;
  decision_type: DecisionType;
  reason?: string;
  decided_by: string;
  decided_at: Date;
}

export interface DecisionBatch {
  id: string;
  kebele_id: string;
  submitted_by: string;
  decision_type: DecisionType;
  total_count: number;
  reason?: string;
  created_at: Date;
}

// ─── Support ──────────────────────────────────────────────────────────────────

export interface SupportProgram {
  id: string;
  name: string;
  support_type: SupportType;
  description?: string;
  is_active: boolean;
  created_at: Date;
}

export interface SupportDistribution {
  id: string;
  household_id: string;
  person_id?: string;
  support_program_id: string;
  amount?: number;
  quantity?: string;
  unit?: string;
  distributed_at: Date;
  location?: string;
  distributed_by: string;
  notes?: string;
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

export interface Feedback {
  id: string;
  category_id?: string;
  message: string;
  rating?: number;
  is_anonymous: boolean;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  application_id?: string;
  household_id?: string;
  kebele_id?: string;
  status: FeedbackStatus;
  submitted_at: Date;
}

// ─── Complaints ───────────────────────────────────────────────────────────────

export interface Complaint {
  id: string;
  complaint_reference: string;
  category_id?: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  is_anonymous: boolean;
  contact_name?: string;
  contact_phone?: string;
  application_id?: string;
  household_id?: string;
  person_id?: string;
  kebele_id?: string;
  status: ComplaintStatus;
  assigned_to?: string;
  resolved_at?: Date;
  closed_at?: Date;
  submitted_at: Date;
}

// ─── Audit ────────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  user_id?: string;
  role?: string;
  kebele_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_value?: Record<string, unknown>;
  new_value?: Record<string, unknown>;
  reason?: string;
  ip_address?: string;
  created_at: Date;
}
