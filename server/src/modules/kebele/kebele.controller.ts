import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import db from '../../config/database';
import { v4 as uuidv4 } from 'uuid';

export const listKebeles = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await db('kebeles').orderBy('name') }); } catch (err) { next(err); }
};

export const getKebele = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await db('kebeles').where({ id: req.params.id }).first() }); } catch (err) { next(err); }
};

export const createKebele = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = uuidv4();
    await db('kebeles').insert({ id, ...req.body, created_at: new Date(), updated_at: new Date() });
    res.status(201).json({ success: true, data: await db('kebeles').where({ id }).first() });
  } catch (err) { next(err); }
};

export const updateKebele = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await db('kebeles').where({ id: req.params.id }).update({ ...req.body, updated_at: new Date() });
    res.json({ success: true, data: await db('kebeles').where({ id: req.params.id }).first() });
  } catch (err) { next(err); }
};

export const deleteKebele = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await db('kebeles').where({ id: req.params.id }).del();
    res.json({ success: true, message: 'Kebele deleted successfully' });
  } catch (err) { next(err); }
};
