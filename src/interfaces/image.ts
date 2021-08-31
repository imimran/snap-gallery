import { Document } from 'mongoose';

interface IImage extends Document {
  title: string;
  slug: string;
  imageURL: string;
  
}

export default IImage