import mongoose from 'mongoose'
import {MONGO_URL} from "../config/config"

// const options  = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false

// }

const connectDB = () => {
    const db = mongoose.connect(MONGO_URL)
    
    // console.log('Connected to the mongodb');
    const conection = mongoose.connection
    conection.on('error', () => console.log('Cound not connected on the db'))
    conection.on('connected', () => console.log('Connected to the mongodb'))
   
}
export default connectDB