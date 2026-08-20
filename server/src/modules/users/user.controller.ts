import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types/express';
import * as userService from './user.service';

export const listUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userService.listUsers(req.query);
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.createUser(req.body, req.user!.id);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user!.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const suspendUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await userService.suspendUser(req.params.id, req.user!.id);
    res.json({ success: true, message: 'User suspended' });
  } catch (err) {
    next(err);
  }
};

export const assignKebele = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await userService.assignKebele(req.params.id, req.body.kebele_id, req.user!.id);
    res.json({ success: true, message: 'Kebele assignment updated' });
  } catch (err) {
    next(err);
  }
};
