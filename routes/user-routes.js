import { Router } from 'express';
import { upsertUser, getUserDetails } from '../controller/user-controller.js';

const router = Router();

router.route('/register')
    .post(upsertUser)

router.route('/verify')
    .get(getUserDetails)

export default router
