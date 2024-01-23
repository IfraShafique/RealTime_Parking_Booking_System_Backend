import express from "express";
import { parkingBookingController} from "./booking.controller";
// import { isSlotAvailable } from "./booking.middleware";

const parkingAreaRouter = express.Router();

parkingAreaRouter.post('/parkingAreaSelection/:id', parkingBookingController);



export default parkingAreaRouter;