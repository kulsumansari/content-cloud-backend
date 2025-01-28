
import { MongoClient } from "mongodb";

export const getUserDetails = async(req, res) => {
    try {
            const client = new MongoClient(process.env.MONGODB_URI);
            const db = client.db('Users');
            const collection = db.collection('user-collection');
            const result = await collection.find({
                user_id: req.query.userId,
                password: req.query.password
            }).project({_id : 0}).toArray()
            client.close();
    
            if (result) {
                res.status(200).send({
                    user_id: result[0]?.user_id,
                    workspaces: result[0]?.workspaces
                })
            }
            else throw {
                errorResponse: { code: 404 }
            }
            
        } catch (error) {
            let errMsg = 'Internal Server Error'
            if (error?.errorResponse?.code === 11000) errMsg = 'User Id is not unique!'
             if (error?.errorResponse?.code === 404) errMsg = 'User Id not found! Kindly Register'
            res.status(500).send({
                message: errMsg
            })
        }
}

export const upsertUser = async(req, res) => {
    try {
            const client = new MongoClient(process.env.MONGODB_URI);
            const db = client.db('Users');
            const collection = db.collection('user-collection');
            const result = await collection.updateOne({user_id: req.params.user_id }, {$set:{
                    ...req.body
                }},
                {upsert:true}
            );
            client.close();
    
            if (result.acknowledged) {
                res.status(200).send({
                    message: 'User updated!'
                })
            }
            else throw 'error'
            
        } catch (error) {
            console.log("🚀 ~ upsertUser ~ error:", error)
            let errMsg = 'Internal Server Error'
            if (error?.errorResponse?.code === 11000) errMsg = 'User Id is not unique!'
            res.status(500).send({
                message: errMsg
            })
        }
}