import { Document } from 'mongoose';

interface IImage extends Document {
  title: string;
  imageURL: string;
  
}

export default IImage