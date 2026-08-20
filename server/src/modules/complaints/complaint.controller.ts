import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import * as service from './complaint.service';

export const publicSubmit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.publicSubmit(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const trackByReference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getByReference(req.params.reference);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const listComplaints = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.listComplaints(req.query, req.user!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const getComplaint = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.getComplaintById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const assign = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.assign(req.params.id, req.body.assigned_to, req.user!.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const addAction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.addAction(req.params.id, req.body, req.user!.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const escalate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.escalate(req.params.id, req.body.reason, req.user!.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const resolve = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.resolve(req.params.id, req.body.resolution, req.user!.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const close = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.close(req.params.id, req.user!.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
