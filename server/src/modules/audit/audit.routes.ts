import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { UserRole } from '../../types/enums';
import * as ctrl from './audit.controller';

const router = Router();
// Audit log access restricted to Super Admin (SRS §25)
router.use(authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.KEBELE_ADMIN));

router.get('/', ctrl.listAuditLogs);
router.get('/:id', ctrl.getAuditLog);

export default router;
