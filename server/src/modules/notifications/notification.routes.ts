import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import * as ctrl from './notification.controller';

const router = Router();
router.use(authenticate);

router.get('/', ctrl.listNotifications);
router.put('/:id/read', ctrl.markRead);
router.put('/read-all', ctrl.markAllRead);

export default router;
