// create an express server
import express from 'express';
import { join, resolve } from 'path';
import { config } from 'dotenv';
import cors from 'cors';

import contentRouter from './routes/content-routes.js'
import AssetRouter from './routes/asset-routes.js'

import { getAllEntries } from './controller/entry-controller.js';

config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/content-model" , contentRouter)
app.use("/assets" , AssetRouter)

app.get("/entries" , getAllEntries)


// Serve the images folder as static files
app.use('/assets-io', express.static('./assetBucket'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT || 5000 ; 
app.listen( port , ()=>{
    console.log(`server started at port ${port}`);
})
