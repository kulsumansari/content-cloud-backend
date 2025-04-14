// create an express server
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';

import contentRouter from './routes/application-routes/content-routes.js'
import AssetRouter from './routes/application-routes/asset-routes.js'
import configRouter from './routes/application-routes/config-routes.js'
import userRoutes from './routes/application-routes/user-routes.js'
import workspaceRoutes from './routes/application-routes/workspace-routes.js'

import { getAllEntries } from './controller/entry-controller.js';
import DeliveryRouter from './routes/delivery-api.js';

config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// application-routes
app.use("/content-model" , contentRouter)
app.use("/assets" , AssetRouter)
app.use('/configuration', configRouter);
app.use('/users', userRoutes)
app.use('/workspace', workspaceRoutes)
app.get("/entries" , getAllEntries)


// delivery api routes
app.use('/delivery-api', DeliveryRouter) 


// Serve the images folder as static files
app.use('/assets-io', express.static('./assetBucket'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT || 5000 ; 
app.listen( port , ()=>{
    console.log(`server started at port ${port}`);
})
