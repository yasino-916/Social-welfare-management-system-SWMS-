import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import * as service from './assessment.service';

export const getByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.getByApplication(req.params.applicationId) }); } catch (err) { next(err); }
};

export const createAssessment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await service.createAssessment(req.body, req.user!.id) }); } catch (err) { next(err); }
};

export const updateAssessment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.updateAssessment(req.params.id, req.body, req.user!.id) }); } catch (err) { next(err); }
};
