import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import * as service from './support.service';

export const listPrograms = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.listPrograms() }); } catch (err) { next(err); }
};

export const createProgram = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await service.createProgram(req.body) }); } catch (err) { next(err); }
};

export const listDistributions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.listDistributions(req.query, req.user!) }); } catch (err) { next(err); }
};

export const recordDistribution = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await service.recordDistribution(req.body, req.user!.id) }); } catch (err) { next(err); }
};

export const getHouseholdHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.getHouseholdHistory(req.params.householdId) }); } catch (err) { next(err); }
};
