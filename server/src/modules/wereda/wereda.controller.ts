import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import db from '../../config/database';

export const getWereda = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await db('weredas').first();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const updateWereda = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, region } = req.body;
    await db('weredas').update({ name, region, updated_at: new Date() });
    const data = await db('weredas').first();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
