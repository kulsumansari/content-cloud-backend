import { Router } from 'express';
import multer from 'multer';
import { createAsset, getAssetByUID, getAllAssets, deleteAssetbyUID, getAssetsCount } from '../controller/asset-controller.js';

// Create storage engine for multer-gridfs-storage
// const storage = new GridFsStorage({
//     url: process.env.MONGODB_URI,
//     file: (req, file) => {
//       // Generate a unique file name, you can use any method to generate it.
//     //   const filename = `${Date.now()}_${file.originalname}`;
//       // It will be used by multer-gridfs-storage to save the file in MongoDB
//       const fileInfo = {
//         filename: file.originalname,
//         mimetype: file.mimetype,
//         contentType: file.contentType,
//         size: file.size,
//         // fieldname: file.fieldname,
//         createdAt: file.uploadAt,
//         bucketName: 'assetBucket' // specify the bucket name
//       };
//       return fileInfo;
//     }
//   });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assetBucket/')
  },
  filename: function (req, file, cb) {
    // console.log(file.originalname)
    cb(null, file.originalname)
  }
})

  const upload = multer({ storage });



// const previewFile = async(req, res) => {
//     try {
//         // const { fileId } = req.params;
//         const client = new MongoClient(process.env.MONGODB_URI);
//         const db = client.db('test');

//         var bucket = new GridFSBucket(db, {
//             bucketName: 'assetBucket'
//         });
    
//         // Check if file exists
//         let downloadStream = bucket.openDownloadStreamByName('download.png');
    
//         // pipe the stream to the response
//         downloadStream.pipe(res);
//       } catch (error) {
//         console.log(error);
//         res.status(400).json({error: { text: `Unable to download file`, error }});
//       }
// }

const router = Router();

router.route('/')
    .get(getAllAssets)

router.route('/count')
  .get(getAssetsCount)

router.route('/:assetUid')
    .get(getAssetByUID)
    .post([upload.single('file'), createAsset])
    .delete(deleteAssetbyUID)



export default router