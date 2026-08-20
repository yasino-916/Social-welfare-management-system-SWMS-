import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import * as service from './search.service';

export const search = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.search(req.query, req.user!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
