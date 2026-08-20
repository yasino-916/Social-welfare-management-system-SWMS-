import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { UserRole } from '../../types/enums';
import * as ctrl from './wereda.controller';

const router = Router();
router.use(authenticate, authorize(UserRole.SUPER_ADMIN));

router.get('/', ctrl.getWereda);
router.put('/', ctrl.updateWereda);

export default router;
