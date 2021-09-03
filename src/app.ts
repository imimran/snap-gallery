import express, {Request, Response} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import  connectDB  from './db/db'
import  publicRoutes  from './routes/public'
import {PORT} from "./config/config"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.static('upload'))
app.use(express.json())
connectDB()



app.use('/api/v1', publicRoutes)

app.get('/', (req: Request, res: Response)=>{
    res.status(200).json({error: false, msg: 'Hello Imran'})
})


// app.use(express.static(path.join(__dirname, '/src/upload/')));
console.log("__dirname",__dirname);
app.use('/', express.static('upload'));


app.use((req: Request, res: Response)=>{
    res.status(500).json({error: true, msg: 'Request URL not found'})
})




app.listen(PORT, () => {
    console.log(`Server Runnaing on the PORT ${PORT}`);
})
