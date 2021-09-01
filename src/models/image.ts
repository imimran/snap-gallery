'use strict'
import { model, Model, Schema} from 'mongoose';
import IImage from '../interfaces/image';


const ImageSchema: Schema = new Schema({
    title:{
        type: String,
        required:false
    },

    imageURL:{
        type: String,
        required:false
    },
    imageFullURL:{
        type: String,
        required:true
    }
    
},{
    timestamps: true
})


const Image: Model<IImage>= model<IImage>('images', ImageSchema)

export default Image;