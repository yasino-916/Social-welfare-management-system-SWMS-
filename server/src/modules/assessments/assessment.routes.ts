import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { UserRole } from '../../types/enums';
import * as ctrl from './assessment.controller';

const router = Router();
router.use(authenticate, authorize(UserRole.KEBELE_ADMIN, UserRole.SUPER_ADMIN));

router.get('/application/:applicationId', ctrl.getByApplication);
router.post('/', [
  body('application_id').notEmpty(),
  body('vulnerability_level').notEmpty(),
  validate,
], ctrl.createAssessment);
router.put('/:id', ctrl.updateAssessment);

export default router;
