import express from "express";
import { slotBookingController } from "./slot.controller";

const slotBookingRouter = express.Router();

slotBookingRouter.post('/slotBooking/:id', slotBookingController)

export default slotBookingRouter;