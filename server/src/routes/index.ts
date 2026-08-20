import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/user.routes';
import weredaRoutes from '../modules/wereda/wereda.routes';
import kebeleRoutes from '../modules/kebele/kebele.routes';
import personRoutes from '../modules/persons/person.routes';
import householdRoutes from '../modules/households/household.routes';
import applicationRoutes from '../modules/applications/application.routes';
import assessmentRoutes from '../modules/assessments/assessment.routes';
import documentRoutes from '../modules/documents/document.routes';
import decisionRoutes from '../modules/decisions/decision.routes';
import beneficiaryRoutes from '../modules/beneficiaries/beneficiary.routes';
import supportRoutes from '../modules/support/support.routes';
import feedbackRoutes from '../modules/feedback/feedback.routes';
import complaintRoutes from '../modules/complaints/complaint.routes';
import notificationRoutes from '../modules/notifications/notification.routes';
import auditRoutes from '../modules/audit/audit.routes';
import reportRoutes from '../modules/reports/report.routes';
import searchRoutes from '../modules/search/search.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes — no authentication required
router.use('/public/auth', authRoutes);
router.use('/public/feedback', feedbackRoutes);
router.use('/public/complaints', complaintRoutes);

// Public registration forms (no account needed)
import * as householdCtrl from '../modules/households/household.controller';
import * as personCtrl from '../modules/persons/person.controller';
import { validate } from '../middleware/validate';
import { body } from 'express-validator';

router.post('/public/households', [
  body('household_size').isInt({ min: 1 }),
  body('kebele_id').notEmpty(),
  validate
], householdCtrl.createHouseholdPublic);

import * as kebeleCtrl from '../modules/kebele/kebele.controller';
router.get('/public/kebeles', kebeleCtrl.listKebeles);

router.get('/public/registration-reasons', async (req, res, next) => {
  try {
    const db = require('../config/database').default;
    const data = await db('registration_reasons').orderBy('display_order');
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.post('/public/households/:id/members', [
  body('person_id').notEmpty(),
  body('relationship_to_head').notEmpty(),
  validate
], householdCtrl.addMemberPublic);

router.post('/public/persons', [
  body('full_name').notEmpty(),
  body('gender').notEmpty(),
  validate
], personCtrl.createPersonPublic);

import * as documentCtrl from '../modules/documents/document.controller';
router.post('/public/documents', documentCtrl.publicUploadDocument);

// Authenticated admin routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/wereda', weredaRoutes);
router.use('/kebeles', kebeleRoutes);
router.use('/persons', personRoutes);
router.use('/households', householdRoutes);
router.use('/applications', applicationRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/documents', documentRoutes);
router.use('/decisions', decisionRoutes);
router.use('/beneficiaries', beneficiaryRoutes);
router.use('/support', supportRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/complaints', complaintRoutes);
router.use('/notifications', notificationRoutes);
router.use('/audit', auditRoutes);
router.use('/reports', reportRoutes);
router.use('/search', searchRoutes);

export default router;
