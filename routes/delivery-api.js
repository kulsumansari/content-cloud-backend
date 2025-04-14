import { Router} from 'express';

import { getAllModels, getModelbyUID } from '../controller/content-model.js';

import { MongoClient } from "mongodb"
import { config } from 'dotenv';
import { getAllEntriesByModelUid, getEntryByUID } from '../controller/entry-controller.js';
import { getAllAssets, getAssetByUID } from '../controller/asset-controller.js';

config()

const DeliveryRouter = Router();

async function authenticateRequest (req, res, next) {
    try {
        const {access_token, ws_api_key} = req.headers

        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db(ws_api_key);
        const resp = await db.collection('configuration').find({}).toArray();
        // console.log(resp?.[0]?.access_token)
        if(resp?.length > 0 && resp?.[0]?.access_token) {
            if(resp?.[0]?.access_token === access_token) {
                req.query.workspace_uid = ws_api_key
                console.log('authenticated, ----next----')
                return next()
            } else {
                res.status(401).send({
                    'message' : 'Invalid access_token, request could not be processed'
                })
            }
        }
    } catch (err) {
        console.log('>>>>>', err)
    }
}
 
// Deliver Routes from where user can fetch data via api, each request is authenticated via access_token
//  api headers: 
//      ws_api_key
//      access_token


// model fetch routes
DeliveryRouter.route("/content-model").get([authenticateRequest, getAllModels])


// // req.params content-model-uid
DeliveryRouter.route("/content-model/:uid").get([authenticateRequest, getModelbyUID])

// // entries fetch routes 
// // req.params content-model-uid
DeliveryRouter.route('/content-model/:modelUid/entries').get([authenticateRequest, getAllEntriesByModelUid])
// // req.params content-model-uid, entry-uid
DeliveryRouter.route('/content-model/:modelUid/entries/:entryUid').get([authenticateRequest, getEntryByUID])

// // assets fetch route
DeliveryRouter.route("/assets").get([authenticateRequest, getAllAssets])
// // req.params asset-uid
DeliveryRouter.route("/assets/:assetUid").get([authenticateRequest, getAssetByUID])

export default DeliveryRouter

