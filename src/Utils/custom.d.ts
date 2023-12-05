declare module 'mongoose-unique-validator';
declare namespace Express {
    export interface Request {
        user?: any;
        file?: any;
    }
}

interface Error{
    statusCode?: number;
    data?: any;
}