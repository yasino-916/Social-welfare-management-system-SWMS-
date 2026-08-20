import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import * as service from './report.service';

export const dashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.getDashboard(req.user!) }); } catch (err) { next(err); }
};

export const households = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.getHouseholdReport(req.query, req.user!) }); } catch (err) { next(err); }
};

export const personsByAgeRange = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.getPersonsByAgeRange(req.query, req.user!) }); } catch (err) { next(err); }
};

export const applicationsByStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.getApplicationsByStatus(req.query, req.user!) }); } catch (err) { next(err); }
};

export const supportDistributions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.getSupportReport(req.query, req.user!) }); } catch (err) { next(err); }
};

export const complaintStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.getComplaintStats(req.query, req.user!) }); } catch (err) { next(err); }
};

export const exportReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { buffer, contentType, filename } = await service.exportReport(req.params.type, req.query, req.user!);
    res.set('Content-Type', contentType);
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) { next(err); }
};
