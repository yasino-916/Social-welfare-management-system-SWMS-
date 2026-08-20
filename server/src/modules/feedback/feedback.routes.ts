import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import * as ctrl from './feedback.controller';

const router = Router();

// Public submission — no account required (SRS §FR-21)
router.post('/public', [
  body('message').notEmpty().withMessage('Message is required'),
  validate,
], ctrl.publicSubmit);

// Admin feedback management
router.use(authenticate);
router.get('/', ctrl.listFeedback);
router.get('/:id', ctrl.getFeedback);
router.put('/:id/status', [body('status').notEmpty(), validate], ctrl.updateStatus);

export default router;
