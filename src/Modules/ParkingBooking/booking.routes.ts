import express from "express";
import { parkingBookingController, slotBookingController } from "./booking.controller";
import { isSlotAvailable } from "./booking.middleware";

const parkingAreaRouter = express.Router();

parkingAreaRouter.post('/parkingAreaSelection/:id',isSlotAvailable, parkingBookingController);
parkingAreaRouter.post('/slotBooking', slotBookingController);


export default parkingAreaRouter;