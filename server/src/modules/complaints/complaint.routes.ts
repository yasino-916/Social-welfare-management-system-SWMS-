import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { UserRole } from '../../types/enums';
import * as ctrl from './complaint.controller';

const router = Router();

// Public — no account required (SRS §FR-22, FR-23)
router.post('/public', [
  body('description').notEmpty().withMessage('Description is required'),
  body('category_id').optional(),
  validate,
], ctrl.publicSubmit);

router.get('/public/:reference/status', ctrl.trackByReference);

// Authenticated complaint management
router.use(authenticate);

router.get('/', ctrl.listComplaints);
router.get('/:id', ctrl.getComplaint);

router.post('/:id/assign',
  authorize(UserRole.KEBELE_ADMIN, UserRole.SUPER_ADMIN),
  [body('assigned_to').notEmpty(), validate],
  ctrl.assign
);

router.post('/:id/action',
  [body('action_description').notEmpty(), validate],
  ctrl.addAction
);

router.post('/:id/escalate',
  [body('reason').notEmpty(), validate],
  ctrl.escalate
);

router.post('/:id/resolve',
  authorize(UserRole.KEBELE_ADMIN, UserRole.SUPER_ADMIN),
  [body('resolution').notEmpty(), validate],
  ctrl.resolve
);

router.post('/:id/close',
  authorize(UserRole.KEBELE_ADMIN, UserRole.SUPER_ADMIN),
  ctrl.close
);

export default router;
