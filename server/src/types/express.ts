import { Request } from 'express';
import { UserRole } from './enums';

// Extends Express Request to include the authenticated user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    kebele_id?: string;
    full_name: string;
  };
}

// Standard API response shape
export interface ApiResponse<T = unknown> {
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
