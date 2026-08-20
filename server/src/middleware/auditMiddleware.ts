import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';
import db from '../config/database';

/**
 * Factory that returns middleware to log a critical action to the audit_logs table.
 * Place after authenticate and before the route handler.
 *
 * Usage: router.post('/decisions', authenticate, auditAction('KEBELE_DECISION', 'application'), handler)
 */
export const auditAction = (action: string, entityType: string) => {
  return async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Store audit metadata on the request for the handler to finalize if needed
    req.body.__audit = {
      action,
      entityType,
      userId: req.user?.id,
      role: req.user?.role,
      kebeleId: req.user?.kebele_id,
      ipAddress: req.ip,
    };
    next();
  };
};

/**
 * Persists an audit log entry directly.
 * Called from service layer for fine-grained audit control.
 */
export async function writeAuditLog(entry: {
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
}): Promise<void> {
  if (process.env.AUDIT_LOG_ENABLED === 'false') return;

  await db('audit_logs').insert({
    ...entry,
    created_at: new Date(),
  });
}
