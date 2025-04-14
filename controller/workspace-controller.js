import { MongoClient } from "mongodb";

const excludeDB = ['admin', 'local', 'Users' ]
export const getAllWorkspaces = async(req, res)=> {
    try {
      const client = new MongoClient(process.env.MONGODB_URI);
      const admin = client.db("admin");
    
      const result = await admin.command({ listDatabases: 1, nameOnly: true });
      const databases = result?.databases.filter((db) => !excludeDB.includes(db.name) )
        res.status(200).json(databases)
    }catch(err){
      console.log("🚀 ~ app.post ~ err:", err)
    }
}

export const createWorkspace = async(req, res)=> {
    try {
      const {workspace_uid} = req.body
      if (!workspace_uid || workspace_uid === null) {
        res.status(404).json({})
      }
      const client = new MongoClient(process.env.MONGODB_URI);
      if (workspace_uid) {
        const db = client.db(workspace_uid);
        const collection = db.collection('configuration');
        // console.log(req.body)
        const result = await collection.updateOne({workspace_uid: req.body.workspace_uid }, {$set:{
              ...req.body
          }},
          {upsert:true}
        );
        if (result.acknowledged) {
          // console.log('====== acknowledge ========')
          const db = client.db('Users');
          const collection = db.collection('user-collection');
          req?.body?.users?.length > 0  && req.body.users.forEach(async(u_id) => {
            const res1 = await collection.updateOne({user_id: u_id }, {$push:{ workspaces: workspace_uid}},
            
            {upsert:true}
          )})
          // client.close();
          res.status(200).json(result)
        }
        
      } else {
        throw 'Workspace Uid is not provided'
      }
    }catch(err){
      console.log("🚀 ~ app.post ~ err:", err)
    }
}

export const deleteWorkspace = async(req, res)=> {
    try {
      const {workspace_uid} = req.body
      const client = new MongoClient(process.env.MONGODB_URI);
      if (workspace_uid) {
        const db = client.db(workspace_uid);
        const config = await db.collection('configuration')?.find({}).project({_id : 0}).toArray()
        // Dropping the database
        const result = await db.dropDatabase();
        if (result === true) {
          // update user's DB 
          const userDB = client.db('Users');
          const userColl = userDB.collection('user-collection');

          if (config?.[0]?.users?.length > 0) {
            const userDetails = await userColl.find({user_id: {$in: config?.[0]?.users}}).project({_id : 0}).toArray()
            userDetails?.forEach(async(user) => {
              let newWorkspaces = []
              if (user?.workspaces?.includes(workspace_uid)) {
                  newWorkspaces = user?.workspaces.filter((sp) => sp !== workspace_uid)
              }
              const userUpdate = await userColl.updateOne({user_id: user.user_id }, {$set:{
                    ...user,
                    workspaces: newWorkspaces
                }},
                {upsert:true}
              );
            })
          }
        }
        res.status(200).json(result)
      } 
      else {
        throw 'Workspace Uid is not provided'
      }
    } catch(err){
      console.log("🚀 ~ app.post ~ err:", err)
    }
}

export const addUserToWorkspace = async(req, res)=> {
  try {
    const { workspace_uid, users } = req.body
    const client = new MongoClient(process.env.MONGODB_URI);
    if (workspace_uid) {
      // update workspace configuration
      const db = client.db(workspace_uid);
      const collection = db.collection('configuration');
      users?.length > 0 && users.forEach(async(user)=> {
        const result = await collection.updateOne({workspace_uid: req.body.workspace_uid }, {$push:{ users: user}},
          {upsert:true}
        );
      })

      // update user's DB 
      const userDB = client.db('Users');
      const userColl = userDB.collection('user-collection');
      const userDetails = await userColl.find({}).project({_id : 0}).toArray()

      let newWorkspaces, existingUsers = []

      userDetails?.forEach(async(user) => {
          existingUsers.push(user.user_id)
          if (users?.includes(user.user_id)) {
              newWorkspaces = user?.workspaces?.length > 0 ? [workspace_uid, ...user.workspaces] : [workspace_uid]
              const userUpdate = await userColl.updateOne({user_id: user.user_id }, {$set:{
                      ...user,
                      workspaces: newWorkspaces
                  }},
                  {upsert:true}
              );
          }
      })

      const nonExistingUsers = users.filter((u) => !existingUsers.includes(u))

      nonExistingUsers?.length > 0 && nonExistingUsers.forEach(async(neu) => {
            const res1 = await userColl.updateOne({user_id: neu }, {$set:{
                workspaces: [workspace_uid]
            }},
            {upsert:true}
        );
        client.close();
      })
      
      res.status(200).json({
        message: 'users list updated!'
      })


    } else {
      throw 'Workspace Uid is not provided'
    }
  }catch(err){
    console.log("🚀 ~ app.post ~ err:", err)
  }
}

export const removeUserToWorkspace =  async(req, res)=> {
  try {
    const { workspace_uid, users } = req.body
    const client = new MongoClient(process.env.MONGODB_URI);
    if (workspace_uid) {
      const db = client.db(workspace_uid);
      const collection = db.collection('configuration');
      const workspaceDetails = await collection.findOne({workspace_uid: req.body.workspace_uid })
      const newUsersList = workspaceDetails?.users?.filter((usr) => !users?.includes(usr))
      const result = await collection.updateOne({workspace_uid: req.body.workspace_uid }, {$set:{ users: newUsersList}},
        {upsert:true}
      );
      
      const userDB = client.db('Users');
      const userColl = userDB.collection('user-collection');
      const userDetails = await userColl.find({}).project({_id : 0}).toArray()
      
      userDetails?.forEach(async(user) => {
          let newWorkspaces = []
          if (users?.includes(user.user_id)) {
            if (user?.workspaces?.includes(workspace_uid)) {
                newWorkspaces = user?.workspaces.filter((sp) => sp !== workspace_uid)
            }
            const userUpdate = await userColl.updateOne({user_id: user.user_id }, {$set:{
                  ...user,
                  workspaces: newWorkspaces
              }},
              {upsert:true}
            );
          }
      })
      
      res.status(200).json({
        message: 'users list updated!'
      })
    } else {
      throw 'Workspace Uid is not provided'
    }
  }catch(err){
    console.log("🚀 ~ app.post ~ err:", err)
  }
}