import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import db from '../../config/database';

export const listNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await db('notifications')
      .where('user_id', req.user!.id)
      .orderBy('created_at', 'desc')
      .limit(50);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const markRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await db('notifications').where({ id: req.params.id, user_id: req.user!.id }).update({ is_read: true });
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const markAllRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await db('notifications').where({ user_id: req.user!.id, is_read: false }).update({ is_read: true });
    res.json({ success: true });
  } catch (err) { next(err); }
};
