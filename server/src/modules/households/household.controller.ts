import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import * as service from './household.service';

export const listHouseholds = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.listHouseholds(req.query, req.user!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const createHousehold = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const payload = { ...req.body };
    if (req.user!.role !== 'SUPER_ADMIN' && req.user!.kebele_id) {
      payload.kebele_id = req.user!.kebele_id;
    }
    const data = await service.createHousehold(payload, req.user!.id);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const createHouseholdPublic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.createHousehold(req.body, undefined);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const getHousehold = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.getHouseholdById(req.params.id, req.user!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const updateHousehold = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.updateHousehold(req.params.id, req.body, req.user!.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const listMembers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.listMembers(req.params.id, req.user!);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const addMember = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.addMember(req.params.id, req.body, req.user!.id);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const addMemberPublic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.addMember(req.params.id, req.body, undefined);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};
