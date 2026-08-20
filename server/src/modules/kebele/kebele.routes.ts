import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { UserRole } from '../../types/enums';
import * as ctrl from './kebele.controller';

const router = Router();
router.use(authenticate);

router.get('/', ctrl.listKebeles);
router.get('/:id', ctrl.getKebele);
router.post('/', authorize(UserRole.SUPER_ADMIN), [
  body('name').notEmpty(),
  body('code').notEmpty(),
  validate,
], ctrl.createKebele);
router.put('/:id', authorize(UserRole.SUPER_ADMIN), ctrl.updateKebele);
router.delete('/:id', authorize(UserRole.SUPER_ADMIN), ctrl.deleteKebele);

export default router;
