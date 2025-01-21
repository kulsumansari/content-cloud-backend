import { MongoClient } from "mongodb"
import { config } from 'dotenv';
config()

export const getAllModels = async (req, res) => {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db('CMS');
        const collection = db.collection('Schema');
        const result = await collection.find({}).toArray()
        // console.log("🚀 ~ getAllModels ~ result:", result)
        client.close();

        if (result) {
            res.status(200).send({
                'content-models': [
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

export const getModelbyUID = async (req, res) => {
    try {
        const modelUid = req.params.uid
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db('CMS');
        const collection = db.collection('Schema');
        const result = await collection.findOne({schema_uid: modelUid})
        // console.log("🚀 ~ getModelbyUID ~ result:", result?.schema_uid === modelUid)
        client.close();

        if (result) {
            res.status(200).send({
                'content-models': [result]
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

export const getModelCount = async (req, res) => {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db('CMS');
        const collection = db.collection(`Schema`);
        const result = await collection.countDocuments({})
        client.close();

        if (result) {
            res.status(200).send({
                count: result
            })
        }
        else throw 'error'
        
    } catch (error) {
        console.log("🚀 ~ getModelCount ~ error:", error)
        res.status(404).send({
            message: 'Unable to fetch Model Count'
        })
    }
}


export const createContentModelByID = async (req, res) => {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db('CMS');
        const collection = db.collection('Schema');
        const result = await collection.insertOne({
            ...req.body,
            createdAt: new Date().toLocaleString()
        });
        console.log("🚀 ~ createContentModelByID ~ result:", result)
        client.close();

        if (result.acknowledged) {
            res.status(201).send({
                message: 'content model created!'
            })
        }
        else throw 'error'
        
    } catch (error) {
        console.log("🚀 ~ createContentModelByID ~ error:", error)
        let errMsg = 'Internal Server Error'
        if (error?.errorResponse?.code === 11000) errMsg = 'Schema name is not unique!'
        res.status(500).send({
            message: errMsg
        })
    }
}

// upsert route to update the embeddings in mongodb database for given uid
export const updateContentModelByID = async(req, res) => {
    try {
        const modelUid = req.params.uid
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db('CMS');
        const collection = db.collection('Schema');
        const result = await collection.updateOne({schema_uid: modelUid }, {$set:{
                ...req.body,
                updatedAt: new Date().toLocaleString()
            }},
            {upsert:false}
        );
        client.close();

        if (result.acknowledged) {
            res.status(200).send({
                message: 'content model updatedS!'
            })
        }
        else throw 'error'
        
    } catch (error) {
        console.log("🚀 ~ updateContentModelByID ~ error:", error)
        let errMsg = 'Internal Server Error'
        if (error?.errorResponse?.code === 11000) errMsg = 'Schema name is not unique!'
        res.status(500).send({
            message: errMsg
        })
    }
}

export const deleteModelbyUID = async (req, res) => {
    try {
        const modelUid = req.params.uid
        const client = new MongoClient(process.env.MONGODB_URI);
        const db = client.db('CMS');
        const collection = db.collection('Schema');
        const result = await collection.deleteOne({schema_uid: modelUid})
        // console.log("🚀 ~ deleteModelbyUID ~ result:", result)
        client.close();

        if (result?.acknowledged) {
            res.status(200).send({
                message: `${modelUid} content-model has been deleted!`
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

