import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import * as ctrl from './person.controller';

const router = Router();

router.use(authenticate);

// Duplicate check before creating a new person (SRS §10)
router.post('/check-duplicate', [
  body('full_name').notEmpty(),
  body('date_of_birth').optional().isISO8601(),
  validate,
], ctrl.checkDuplicate);

router.get('/', ctrl.listPersons);
router.post('/', [
  body('full_name').notEmpty(),
  body('gender').notEmpty(),
  validate,
], ctrl.createPerson);
router.get('/:id', ctrl.getPerson);
router.put('/:id', ctrl.updatePerson);

export default router;
