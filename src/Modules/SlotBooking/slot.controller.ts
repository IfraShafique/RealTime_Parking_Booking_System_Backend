import { slotBookingServices } from "./slot.services";
import { ISlotBooking } from "./slot.model";
import { NextFunction, Response, Request } from "express";
import { UserRegistrationModel } from "../Users/user.model";
import { parkingBookingModel } from "../ParkingBooking/booking.model";
import mongoose from "mongoose";

// Slot Booking Controller
export const slotBookingController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      const { selectedDate, selectedTime, duration, slotImage, parkingAreaId } = req.body;
      // const parkingAreaId = req.body.parkingAreaId;
      const bookUser = await UserRegistrationModel.findById(userId);
  
      if (!bookUser) {
        const error = new Error("User not found");
        (error as any).statusCode = 404;
        return next(error);
      }
  
      const slotBooking = {
          ...req.body,
          bookUser: userId,
        };
        // delete slotBooking['bookUser']
  
      const savedParking = await slotBookingServices(slotBooking, res);
      console.log(savedParking);
  
      if (!savedParking || !savedParking._id) {
        // Handle the case where savedBooking is undefined or _id is undefined
        const error = new Error("Failed to save parking booking");
        (error as any).statusCode = 500;
        return next(error);
      } 
  
      // Push the slot booking id to the user database
      bookUser.slotBooking.push(savedParking._id.toString());
      await bookUser?.save();
      console.log('Request Object:', req);
console.log('User ID:', userId);
console.log('Parking Area ID:', parkingAreaId);
      
      

      const parkingArea = await parkingBookingModel.findById(parkingAreaId);
      console.log("Parking Area Id: ",parkingArea)
      if (!parkingArea) {
        const error = new Error("Parking area not found");
        (error as any).statusCode = 404;
        return next(error);
      }
  
       // Check if slotBooking is not null before assigning its value
      if (parkingArea.slotBooking !== null) {
        parkingArea.slotBooking = savedParking._id;
        await parkingArea.save();
      }
  
      
      res.status(201).json(savedParking);
    } catch (error: unknown) {
      next(error);
    }
  };
  