import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import db from '../../config/database';
import { writeAuditLog } from '../../middleware/auditMiddleware';

export const listBeneficiaries = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const query = db('applications as a')
      .join('households as h', 'a.household_id', 'h.id')
      .join('kebeles as k', 'h.kebele_id', 'k.id')
      .whereIn('a.status', ['SUPER_ADMIN_APPROVED', 'ACTIVE_BENEFICIARY'])
      .select('a.*', 'k.name as kebele_name');

    if (req.user!.role !== 'SUPER_ADMIN' && req.user!.kebele_id) {
      query.where('h.kebele_id', req.user!.kebele_id);
    }

    res.json({ success: true, data: await query });
  } catch (err) { next(err); }
};

export const getBeneficiary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await db('applications').where({ id: req.params.id }).first();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const suspendBeneficiary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await db('applications').where({ id: req.params.id }).update({ status: 'SUSPENDED', updated_at: new Date() });
    await writeAuditLog({
      user_id: req.user!.id, action: 'SUSPEND_BENEFICIARY',
      entity_type: 'application', entity_id: req.params.id, reason: req.body.reason,
    });
    res.json({ success: true, message: 'Beneficiary suspended' });
  } catch (err) { next(err); }
};
