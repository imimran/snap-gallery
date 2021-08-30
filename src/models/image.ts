import mongoose, {Schema} from 'mongoose';

import IImage from '../interfaces/image';

const ImageSchema: Schema = new Schema({
    title:{
        type: String,
        required:true
    },
    imageURL:{
        type: String,
        required:true
    }
    
},{
    timestamps: true
})

const Image = mongoose.model<IImage>('images', ImageSchema)

export default Image;