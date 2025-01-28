
import { MongoClient } from "mongodb";

export const getConfigDetails = async(req, res) => {
    try {
            const workspace_uid = req.params.workspaceUid
            const client = new MongoClient(process.env.MONGODB_URI);
            const db = client.db(workspace_uid);
            const collection = db.collection('configuration');
            const result = await collection.find({workspace_uid: workspace_uid }).project({_id : 0}).toArray()
            client.close();
    
            if (result) {
                res.status(200).send({
                     ...result
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

export const upsertConfigDetails = async(req, res) => {
    try {
            const {workspace_uid, users} = req.body
            const client = new MongoClient(process.env.MONGODB_URI);
            const db = client.db(workspace_uid);
            const collection = db.collection('configuration');
            const result = await collection.updateOne({workspace_uid: req.body.workspace_uid }, {$set:{
                    ...req.body
                }},
                {upsert:true}
            );

            // const userDB = client.db('Users');
            // const userColl = userDB.collection('user-collection');
            // const userDetails = await userColl.find({}).project({_id : 0}).toArray()

            // let newWorkspaces
            // userDetails?.forEach(async(user) => {
            //     if (users?.includes(user.user_id)) {
            //         if (user?.workspaces?.includes(workspace_uid)) {
            //             newWorkspaces = user?.workspaces.filter((sp) => sp !== workspace_uid)
                        
            //         } else {
            //             newWorkspaces = user?.workspaces?.length > 0 ? [workspace_uid, ...user.workspaces] : [workspace_uid]
            //         }
            //         console.log(user.user_id, newWorkspaces)
            //         const userUpdate = await userColl.updateOne({user_id: user.user_id }, {$set:{
            //                 ...user,
            //                 workspaces: newWorkspaces
            //             }},
            //             {upsert:true}
            //         );
            //         console.log('status>>>>>>>>', userUpdate)
            //     }
            // })

    
            if (result.acknowledged) {
                res.status(200).send({
                    message: 'Configuration updated!'
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