import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT!;
export const APP_URL = process.env.APP_URL!;
export const MONGO_URL = process.env.MONGO_URL!;