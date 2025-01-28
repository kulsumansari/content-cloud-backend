import { Router } from 'express';
import { getConfigDetails, upsertConfigDetails } from '../controller/config-controller.js';

const router = Router();

router.route('/')
    .post(upsertConfigDetails)

router.route('/:workspaceUid')
    .get(getConfigDetails)

export default router
