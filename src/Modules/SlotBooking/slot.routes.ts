import express from "express";
import { getSlotBookingByIdController, slotBookingController } from "./slot.controller";

const slotBookingRouter = express.Router();

slotBookingRouter.post('/slotBooking', slotBookingController);
slotBookingRouter.get('get/slotBooking/:id', getSlotBookingByIdController)

export default slotBookingRouter;