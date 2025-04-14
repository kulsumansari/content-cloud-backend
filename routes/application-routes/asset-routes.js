import { Router } from 'express';
import multer from 'multer';
import { createAsset, getAssetByUID, getAllAssets, deleteAssetbyUID, getAssetsCount, updateAssetByUID } from '../../controller/asset-controller.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assetBucket/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage });

const router = Router();

router.route('/')
    .get(getAllAssets)

router.route('/count')
  .get(getAssetsCount)

router.route('/:assetUid')
    .get(getAssetByUID)
    .post([upload.single('file'), createAsset])
    .put(updateAssetByUID)
    .delete(deleteAssetbyUID)

export default router