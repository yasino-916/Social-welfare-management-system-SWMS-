import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import * as ctrl from './report.controller';

const router = Router();
router.use(authenticate);

router.get('/dashboard', ctrl.dashboard);
router.get('/households', ctrl.households);
router.get('/persons/age-range', ctrl.personsByAgeRange);
router.get('/applications/status', ctrl.applicationsByStatus);
router.get('/support', ctrl.supportDistributions);
router.get('/complaints', ctrl.complaintStats);
router.get('/export/:type', ctrl.exportReport);

export default router;
