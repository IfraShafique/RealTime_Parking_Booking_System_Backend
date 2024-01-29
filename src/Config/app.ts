import cors from 'cors';
import express, {NextFunction, Request, Response} from 'express';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import {dbConnect} from './db/db.config';
import userRoutes from '../Modules/Users/user.routes';
import loginRoutes from '../Modules/Authentication/auth.routes';
import parkingAreaRoutes from '../Modules/ParkingBooking/booking.routes';
import slotBookingRoutes from '../Modules/SlotBooking/slot.routes';
import bodyParser from 'body-parser';
import contactUsRoutes from '../Modules/ContactUs/contactUs.routes';

dotenv.config();
const app = express();

// database connection function call here
dbConnect();

// var corsOptions ={
//     origin:'http://real-time-parking-booking-system.vercel.app', 
//     credentials:true,            //access-control-allow-credentials:true
//     method: ["GET","POST","DELETE"],
//   }

var corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ['https://real-time-parking-booking-system.vercel.app'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
}



app.use(helmet());
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
// app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Define Routes
app.use(userRoutes)   
app.use(loginRoutes);
app.use(parkingAreaRoutes);
app.use(slotBookingRoutes);
app.use(contactUsRoutes)

export default app;
