import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/authenticate';
import { enforceKebeleScope } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import * as ctrl from './household.controller';

const router = Router();

router.use(authenticate, enforceKebeleScope);

router.get('/', ctrl.listHouseholds);
router.post(
  '/',
  [
    body('kebele_id').notEmpty(),
    body('household_size').isInt({ min: 1 }),
    validate,
  ],
  ctrl.createHousehold
);
router.get('/:id', ctrl.getHousehold);
router.put('/:id', ctrl.updateHousehold);
router.get('/:id/members', ctrl.listMembers);
router.post('/:id/members', ctrl.addMember);

export default router;
