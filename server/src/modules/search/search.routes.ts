import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { enforceKebeleScope } from '../../middleware/authorize';
import * as ctrl from './search.controller';

const router = Router();
router.use(authenticate, enforceKebeleScope);

// SRS §20 — multi-field search with RBAC scoping
router.get('/', ctrl.search);

export default router;
