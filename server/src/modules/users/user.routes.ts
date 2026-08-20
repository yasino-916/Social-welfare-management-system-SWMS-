import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { UserRole } from '../../types/enums';
import * as userController from './user.controller';

const router = Router();

// All user management routes require Super Admin (SRS §4.3)
router.use(authenticate, authorize(UserRole.SUPER_ADMIN));

router.get('/', userController.listUsers);
router.post(
  '/',
  [
    body('full_name').notEmpty(),
    body('username').notEmpty(),
    body('password').isLength({ min: 8 }),
    body('role').isIn(Object.values(UserRole)),
    validate,
  ],
  userController.createUser
);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.post('/:id/suspend', userController.suspendUser);
router.post('/:id/assign-kebele', userController.assignKebele);

export default router;
