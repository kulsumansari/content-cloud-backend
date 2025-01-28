import { MongoClient } from "mongodb"
import { config } from 'dotenv';
config()

const excludeCollections = ['Schema', 'assets', 'configuration']

export const getAllEntries = async (req, res) => {
    try {
        const {workspace_uid} = req.query
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db(workspace_uid);
        const result = await db.listCollections().toArray()
        const collections = result.map((col) => col.name)
        let entries = []
        for ( let i=0; i < collections.length; i++) {
            if (!excludeCollections.includes(collections[i] )) {
                const collection = db.collection(`${collections[i]}`);
                const resp = await collection.find().project({_id : 0}).sort({updatedAt: -1}).toArray()
                entries = [...entries, ...resp]
            }
        }

        if (result) {
            res.status(200).send({
                'entries': [
                    ...entries
                ]
            })
        }
        else throw 'error'
        
    } catch (error) {
        console.log("🚀 ~ getAllModels ~ error:", error)
        res.status(404).send({
            message: 'model not exist'
        })
    }
}

export const getAllEntriesByModelUid = async (req, res) => {
    try {
        const {workspace_uid} = req.query
        const modelUid = req.params.modelUid
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db(workspace_uid);
        const collection = db.collection(`${modelUid}`);
        const result = await collection.find({schema_uid: modelUid}).project({_id : 0}).sort({updatedAt: -1}).toArray()
        client.close();

        if (result) {
            res.status(200).send({
                'entries': [
                    ...result
                ]
            })
        }
        else throw 'error'
        
    } catch (error) {
        console.log("🚀 ~ getAllModels ~ error:", error)
        res.status(404).send({
            message: 'model not exist'
        })
    }
}

export const getEntryByUID = async (req, res) => {
    try {
        const {workspace_uid} = req.query
        const modelUid = req.params.modelUid
        const entryUid = req.params.entryUid
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db(workspace_uid);
        const collection = db.collection(`${modelUid}`);
        const result = await collection.find({entry_uid: entryUid}).project({_id : 0}).toArray()
        client.close();

        if (result) {
            res.status(200).send({
                'entries': [...result]
            })
        }
        else throw 'error'
        
    } catch (error) {
        console.log("🚀 ~ getModelbyUID ~ error:", error)
        res.status(404).send({
            message: 'model not exist'
        })
    }
}


export const createEntry = async (req, res) => {
    try {
        const {workspace_uid} = req.query
        const modelUid = req.params.modelUid
        // const entryUid = req.params.entryUid
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db(workspace_uid);
        const collection = db.collection(`${modelUid}`);
        const entryObj = await collection.find({title: req.body.title}).toArray()
        if (entryObj?.length > 0) {
            throw {
                errorResponse: { code : 11000 }
            }
        }
        const result = await collection.insertOne({
            ...req.body,
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString()
        });
        client.close();

        if (result.acknowledged) {
            res.status(201).send({
                message: 'Entry has been created!'
            })
        }
        
    } catch (error) {
        console.log("🚀 ~ createContentModelByID ~ error:", error)
        let errMsg = 'Internal Server Error'
        if (error?.errorResponse?.code === 11000) errMsg = 'Entry Title is not unique!'
        res.status(400).send({
            message: errMsg
        })
    }
}

// upsert route to update the embeddings in mongodb database for given uid
export const updateEntryByUID = async(req, res) => {
    try {
        const {workspace_uid} = req.query
        const modelUid = req.params.modelUid
        const entryUid = req.params.entryUid
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db(workspace_uid);
        const collection = db.collection(`${modelUid}`);
        const entryObj = await collection.find({title: req.body.title}).toArray()
        if (entryObj?.length > 1) {
            throw {
                errorResponse: { code : 11000 }
            }
        }
        const result = await collection.updateOne({entry_uid: entryUid }, {$set:{
                ...req.body,
                updatedAt: new Date().toLocaleString()
            }},
            {upsert:false}
        );
        client.close();

        if (result.acknowledged) {
            res.status(200).send({
                message: 'Entry has been updated!'
            })
        }
        else throw 'Bad Request'
        
    } catch (error) {
        console.log("🚀 ~ updateContentModelByID ~ error:", error)
        let errMsg = 'Internal Server Error'
        if (error?.errorResponse?.code === 11000) errMsg = 'Entry Title is not unique!'
        res.status(400).send({
            message: errMsg
        })
    }
}

export const deleteEntrybyUID = async (req, res) => {
    try {
        const {workspace_uid} = req.query
        const modelUid = req.params.modelUid
        const entryUid = req.params.entryUid
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db(workspace_uid);
        const collection = db.collection(`${modelUid}`);
        const result = await collection.deleteOne({entry_uid: entryUid})
        // console.log("🚀 ~ deleteModelbyUID ~ result:", result)
        client.close();

        if (result?.acknowledged) {
            res.status(200).send({
                message: `${entryUid} entry has been deleted!`
            })
        }
        else throw 'error'
        
    } catch (error) {
        console.log("🚀 ~ deleteModelbyUID ~ error:", error)
        res.status(404).send({
            message: 'model not exist'
        })
    }
}

