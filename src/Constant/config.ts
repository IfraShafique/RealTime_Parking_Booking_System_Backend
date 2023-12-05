import * as dotenv from 'dotenv';
dotenv.config();
// Port datatype number
export const PORT: number = parseInt(process.env.PORT as string, 10 || 4000);
export const MONGO_URI: string = process.env.MONGO_URI || '';
export const SECRET_KEY: string = process.env.SECRET_KEY || '';
export const BCRYPT_SALT: string = process.env.BCRYPT_SALT || '';