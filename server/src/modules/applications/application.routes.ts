import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/authenticate';
import { authorize, enforceKebeleScope } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { UserRole } from '../../types/enums';
import * as ctrl from './application.controller';

const router = Router();

// Public self-registration (no account required — SRS §FR-01, FR-03)
router.post('/public', [
  body('household_id').notEmpty(),
  validate,
], ctrl.publicSubmit);

// Status check by reference number (public)
router.get('/public/status', ctrl.checkStatus);

// Authenticated routes
router.use(authenticate, enforceKebeleScope);

router.get('/', ctrl.listApplications);
router.get('/:id', ctrl.getApplication);

// Kebele-level decisions (SRS §14)
router.post(
  '/:id/kebele-decision',
  authorize(UserRole.KEBELE_ADMIN),
  [
    body('decision_type').isIn(['ACCEPT', 'REJECT', 'RETURN', 'MORE_INFO']),
    body('reason').if(body('decision_type').isIn(['REJECT', 'RETURN', 'MORE_INFO'])).notEmpty(),
    validate,
  ],
  ctrl.kebeleDecision
);

// Submit Kebele reviewed list to Wereda (SRS §15)
router.post(
  '/submit-to-wereda',
  authorize(UserRole.KEBELE_ADMIN),
  [body('application_ids').isArray({ min: 1 }), validate],
  ctrl.submitToWereda
);

// Wereda Super Admin decisions (SRS §16)
router.post(
  '/batch-decision',
  authorize(UserRole.SUPER_ADMIN),
  [
    body('decision_type').isIn(['ACCEPT_ALL', 'REJECT_ALL']),
    body('kebele_id').notEmpty(),
    body('reason').if(body('decision_type').equals('REJECT_ALL')).notEmpty(),
    validate,
  ],
  ctrl.batchDecision
);

router.post(
  '/:id/wereda-decision',
  authorize(UserRole.SUPER_ADMIN),
  [
    body('decision_type').isIn(['ACCEPT', 'REJECT', 'RETURN']),
    body('reason').if(body('decision_type').isIn(['REJECT', 'RETURN'])).notEmpty(),
    validate,
  ],
  ctrl.weredaDecision
);

export default router;
