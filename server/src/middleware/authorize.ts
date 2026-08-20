import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { UserRole } from '../types/enums';

/**
 * Restricts a route to one or more roles.
 * Must be used after authenticate middleware.
 *
 * Usage: router.get('/route', authenticate, authorize(UserRole.SUPER_ADMIN), handler)
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

/**
 * Enforces Kebele data isolation (SRS §23).
 * Kebele-scoped users can only access records for their assigned Kebele.
 * Super Admin has unrestricted access.
 */
export const enforceKebeleScope = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  if (req.user.role === UserRole.SUPER_ADMIN) {
    next();
    return;
  }

  // For non-super-admin users, inject their kebele_id into the request
  // so query layer automatically scopes results
  if (!req.user.kebele_id) {
    res.status(403).json({ success: false, message: 'No Kebele assignment found' });
    return;
  }

  next();
};
