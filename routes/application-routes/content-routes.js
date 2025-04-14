import { Router } from 'express';
import { createContentModelByID, deleteModelbyUID, getAllModels, getModelbyUID, updateContentModelByID, getModelCount } from '../../controller/content-model.js'
import { createEntry, deleteEntrybyUID, getAllEntriesByModelUid, getEntryByUID, updateEntryByUID } from '../../controller/entry-controller.js'


const router = Router();

router.route('/')
    .get(getAllModels)
router.route('/count')
  .get(getModelCount)

router.route('/:uid')
    .get(getModelbyUID)
    .post(createContentModelByID)
    .put(updateContentModelByID)
    .delete(deleteModelbyUID)

router.route('/:modelUid/entries')
    .get(getAllEntriesByModelUid)

router.route('/:modelUid/entries/:entryUid')
    .get(getEntryByUID)
    .post(createEntry)
    .put(updateEntryByUID)
    .delete(deleteEntrybyUID)

export default router