import mongoose from 'mongoose'

// const options  = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false

// }
const MONGO_URI = "mongodb+srv://imran:zgq7N2w4xoNOPiXF@cluster0.kak5c.mongodb.net/image-gallery?retryWrites=true&w=majority"
const connectDB = () => {
    const db = mongoose.connect( process.env.MONGO_URL|| MONGO_URI)
    
    // console.log('Connected to the mongodb');
    const conection = mongoose.connection
    conection.on('error', () => console.log('Cound not connected on the db'))
    conection.on('connected', () => console.log('Connected to the mongodb'))
   
}
export default connectDB