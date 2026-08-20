import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import * as service from './application.service';

export const publicSubmit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.publicSubmit(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const checkStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.checkStatus(req.query.reference as string, req.query.phone as string);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const listApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.listApplications(req.query, req.user!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.getApplicationById(req.params.id, req.user!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const kebeleDecision = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.kebeleDecision(req.params.id, req.body, req.user!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const submitToWereda = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.submitToWereda(req.body.application_ids, req.user!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const batchDecision = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.batchDecision(req.body, req.user!.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const weredaDecision = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.weredaDecision(req.params.id, req.body, req.user!.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
