import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { UserRole } from '../../types/enums';
import * as ctrl from './support.controller';

const router = Router();
router.use(authenticate);

router.get('/programs', ctrl.listPrograms);
router.post('/programs', authorize(UserRole.SUPER_ADMIN), [body('name').notEmpty(), validate], ctrl.createProgram);

router.get('/distributions', ctrl.listDistributions);
router.post('/distributions', authorize(UserRole.KEBELE_ADMIN, UserRole.SUPER_ADMIN), [
  body('household_id').notEmpty(),
  body('support_program_id').notEmpty(),
  body('distributed_at').isISO8601(),
  validate,
], ctrl.recordDistribution);
router.get('/distributions/:householdId/history', ctrl.getHouseholdHistory);

export default router;
