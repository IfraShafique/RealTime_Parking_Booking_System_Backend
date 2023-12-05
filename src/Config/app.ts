import cors from 'cors';
import express, {NextFunction, Request, Response} from 'express';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import {dbConnect} from './db/db.config';
import userRoutes from '../Modules/Users/user.routes';
import loginRoutes from '../Modules/Authentication/auth.routes';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

// database connection function call here
dbConnect();

var corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    method: ["GET","POST","DELETE"],
  }

app.use(helmet());
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());


// Define Routes
app.use(userRoutes)
app.use(loginRoutes);
export default app;