import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { enforceKebeleScope } from '../../middleware/authorize';
import * as ctrl from './beneficiary.controller';

const router = Router();
router.use(authenticate, enforceKebeleScope);

router.get('/', ctrl.listBeneficiaries);
router.get('/:id', ctrl.getBeneficiary);
router.post('/:id/suspend', ctrl.suspendBeneficiary);

export default router;
