import { Document } from 'mongoose';

interface IImage extends Document {
  title: string;
  imageURL: string;
  imageFullURL:string;
}

export default IImage