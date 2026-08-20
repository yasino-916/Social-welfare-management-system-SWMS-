import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import * as ctrl from './decision.controller';

const router = Router();
router.use(authenticate);

// Full decision history for an application (SRS §32)
router.get('/application/:applicationId', ctrl.getByApplication);
router.get('/batch/:batchId', ctrl.getBatch);

export default router;
