import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import db from '../../config/database';

export const getByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await db('application_decisions')
      .join('users', 'application_decisions.decided_by', 'users.id')
      .where('application_decisions.application_id', req.params.applicationId)
      .select('application_decisions.*', 'users.full_name as decided_by_name')
      .orderBy('decided_at', 'asc');
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getBatch = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const batch = await db('decision_batches').where({ id: req.params.batchId }).first();
    const applications = await db('application_decisions').where({ batch_id: req.params.batchId });
    res.json({ success: true, data: { batch, applications } });
  } catch (err) { next(err); }
};
