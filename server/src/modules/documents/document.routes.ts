import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { UserRole } from '../../types/enums';
import * as ctrl from './document.controller';

const router = Router();
router.use(authenticate);

router.get('/application/:applicationId', ctrl.getByApplication);
router.post('/', ctrl.uploadDocument);    // uses multer in controller
router.put('/:id/verify', authorize(UserRole.KEBELE_ADMIN, UserRole.SUPER_ADMIN), ctrl.verifyDocument);
router.put('/:id/reject', authorize(UserRole.KEBELE_ADMIN, UserRole.SUPER_ADMIN), ctrl.rejectDocument);
router.get('/:id/versions', ctrl.getVersionHistory);

export default router;
