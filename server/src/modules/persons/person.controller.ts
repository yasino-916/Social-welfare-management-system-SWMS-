import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import * as service from './person.service';

export const checkDuplicate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await service.checkDuplicate(req.body);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const listPersons = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.listPersons(req.query);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const createPerson = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.createPerson(req.body, req.user!.id);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const createPersonPublic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.createPerson(req.body, undefined);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

export const getPerson = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.getPersonById(req.params.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

export const updatePerson = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await service.updatePerson(req.params.id, req.body, req.user!.id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
};
