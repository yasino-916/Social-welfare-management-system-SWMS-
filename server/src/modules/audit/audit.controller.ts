import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import db from '../../config/database';

export const listAuditLogs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { entity_type, entity_id, user_id, action, from, to } = req.query as Record<string, string>;

    const query = db('audit_logs').select('*').orderBy('created_at', 'desc').limit(100);
    if (entity_type) query.where('entity_type', entity_type);
    if (entity_id) query.where('entity_id', entity_id);
    if (user_id) query.where('user_id', user_id);
    if (action) query.where('action', action);
    if (from) query.where('created_at', '>=', from);
    if (to) query.where('created_at', '<=', to);

    const data = await query;
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getAuditLog = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const log = await db('audit_logs').where({ id: req.params.id }).first();
    if (!log) { res.status(404).json({ success: false, message: 'Audit log not found' }); return; }
    res.json({ success: true, data: log });
  } catch (err) { next(err); }
};
