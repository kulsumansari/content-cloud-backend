import { Router } from 'express';
import { addUserToWorkspace, createWorkspace, deleteWorkspace, getAllWorkspaces, removeUserToWorkspace } from '../../controller/workspace-controller.js';

const router = Router();

router.route('/')
    .get(getAllWorkspaces)
    .post(createWorkspace)
    .delete(deleteWorkspace)


router.route('/addusers').post(addUserToWorkspace)
router.route('/removeusers').post(removeUserToWorkspace)


export default router
