// create an express server
import express from 'express';
import { join, resolve } from 'path';
import { config } from 'dotenv';
import cors from 'cors';

import contentModelRouter from './routes/content-model-routes.js'
import { getAllEntries } from './controller/entryController.js';

config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/content-model" , contentModelRouter)
app.get("/entries" , getAllEntries)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT || 5000 ; 
app.listen( port , ()=>{
    console.log(`server started at port ${port}`);
})
