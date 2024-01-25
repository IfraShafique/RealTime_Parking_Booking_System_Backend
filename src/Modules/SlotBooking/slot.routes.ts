import express from "express";
import { cancelBookingController, getAllBookingsController, getSlotBookingByIdController, slotBookingController } from "./slot.controller";

const slotBookingRouter = express.Router();

slotBookingRouter.post('/slotBooking', slotBookingController);
slotBookingRouter.get('/getSlotBooking/:userId', getSlotBookingByIdController);
slotBookingRouter.get('/get/users/Bookings', getAllBookingsController);
slotBookingRouter.delete('/delete/bookingById/:bookingId', cancelBookingController)

export default slotBookingRouter;