import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import * as service from './feedback.service';

export const publicSubmit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.publicSubmit(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const listFeedback = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.listFeedback(req.query, req.user!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getFeedback = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.getFeedbackById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.updateStatus(req.params.id, req.body.status, req.user!.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
