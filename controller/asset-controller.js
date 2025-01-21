import { MongoClient } from "mongodb"
import { config } from 'dotenv';

config()

const bucketUrl = 'http://localhost:5000/assets-io/'

export const getAllAssets = async (req, res) => {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db('CMS');
        const collection = db.collection(`assets`);
        const result = await collection.find({}).project({_id : 0}).toArray()
        client.close();

        if (result) {
            res.status(200).send({
                assets: result
            })
        }
        else throw 'error'
        
    } catch (error) {
        console.log("🚀 ~ getAllAssets ~ error:", error)
        res.status(404).send({
            message: 'Unable to fetch Assets'
        })
    }
}

export const getAssetsCount = async (req, res) => {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db('CMS');
        const collection = db.collection(`assets`);
        console.log('------ countj ---------')
        const result = await collection.countDocuments({})
        console.log("🚀 ~ getAssetsCount ~ result:", result)
        client.close();

        if (result) {
            res.status(200).send({
                count: result
            })
        }
        else throw 'error'
        
    } catch (error) {
        console.log("🚀 ~ getAllAssets ~ error:", error)
        res.status(404).send({
            message: 'Unable to fetch Assets'
        })
    }
}

export const getAssetByUID = async (req, res) => {
    try {
        const assetUid = req.params.assetUid
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db('CMS');
        const collection = db.collection(`assets`);
        const result = await collection.find({asset_uid: assetUid}).project({_id : 0}).toArray()
        client.close();

        if (result) {
            res.status(200).send({
                ...result[0]
            })
        }
        else throw 'error'
        
    } catch (error) {
        console.log("🚀 ~ getAssetByUID ~ error:", error)
        res.status(404).send({
            message: 'Unable to fetch Asset:' + req.params.assetUid
        })
    }
}

export const createAsset = async(req, res) => {
    try {

        const assetUid = req.params.assetUid
        // const entryUid = req.params.entryUid
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db('CMS');
        const collection = db.collection('assets');

        const assetObj = await collection.find({asset_uid: assetUid}).toArray()
        if (assetObj?.length > 0) {
            throw {
                errorResponse: { code : 11000 }
            }
        }

        const reqObj = {
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            url: bucketUrl + req.file.originalname,
            asset_uid: assetUid,
            createdAt: new Date().toLocaleString(),
        }
       
        const result = await collection.insertOne(reqObj)
        
        client.close();

        if (result.acknowledged) {
            res.status(201).send({
                message: 'Asset has been created!',
                assets: [
                    reqObj
                ]
            })
        }
    } catch (error) {
        console.log(error, error?.message , error?.stack);
        res.status(400).json({
          error: { text: "Unable to upload the file", error },
        });
    }
}

export const deleteAssetbyUID = async (req, res) => {
    try {
        const assetUid = req.params.assetUid
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db('CMS');
        const collection = db.collection('assets');
        const result = await collection.deleteOne({asset_uid: assetUid})
        // console.log("🚀 ~ deleteModelbyUID ~ result:", result)
        client.close();

        if (result?.acknowledged) {
            res.status(200).send({
                message: `${assetUid} asset has been deleted!`
            })
        }
        else throw 'error'
        
    } catch (error) {
        console.log("🚀 ~ deleteAssetbyUID ~ error:", error)
        res.status(404).send({
            message: 'Asset not exist'
        })
    }
}
