import { ISlotBooking, slotBookingModel } from "./slot.model";
import {Request, Response, NextFunction, response} from "express"
import { parkingBookingModel } from "../ParkingBooking/booking.model";
import { UserRegistrationModel } from "../Users/user.model";


// Validate that if slot available or not
export const isSlotAvailableService = async (
   selectedDate: string,
   selectedTime: string,
   selectedImage: string,
   duration: string,
   slotImage: string
   ): Promise<boolean> => {
  try {
      // const { selectedDate, selectedTime, duration, slot: slotNumber,selectedImage } = req.body;

      // Calculate the end time
      const startTime = new Date(`${selectedDate} ${selectedTime}`);
      const endTime = new Date(startTime.getTime() + parseInt(duration.toString(), 10) * 60 * 1000);
      console.log("end time: ", endTime);
      console.log("start time: ", startTime);

      const existingSlot = await slotBookingModel.findOne({
          selectedDate,
          selectedTime,
          selectedImage,
          duration,
          slotImage,
          booked: true,
        });
          if (existingSlot) {
            // Check if the current time is past the end time of the slot
            // const date = new Date(selectedDate);
            const currentTime = new Date();
            const slotEndTime = new Date(existingSlot.selectedTime.getTime() + parseInt(existingSlot.duration, 10) * 60 * 1000);
            console.log("CT",currentTime);
            console.log("ST",slotEndTime);
            if (currentTime > slotEndTime) {
              // Slot duration has passed, make the slot available again
              existingSlot.booked = false;
              await existingSlot.save();
              return true;
            }
      
            return false; // Slot is booked and within the duration
          }
      //     $or: [
      //         {
      //             $and: [
      //                 { startTime: { $lte: startTime } },
      //                 { endTime: { $gt: startTime } },
      //             ],
      //         },
      //         {
      //             $and: [
      //                 { startTime: { $lt: endTime } },
      //                 { endTime: { $gte: endTime } },
      //             ],
      //         },
      //         {
      //             $and: [
      //                 { startTime: { $gte: startTime } },
      //                 { endTime: { $lte: endTime } },
      //             ],
      //         },
      //     ],
      

      return !existingSlot; // Returns true if the slot is available, false otherwise
  } catch (error) {
      console.error("Error in slot availability: ", error);
      throw error;
  }
};

// Slot booking services
export const slotBookingServices = async (
    slot: ISlotBooking,
    res: Response,
  ): Promise<ISlotBooking | undefined> => {
    try {   
      const newSlot = new slotBookingModel(slot);
      const savedSlot = await newSlot.save();
      // const isAvailable = await isSlotAvailable(slot);

      // if(!isAvailable){
      //   res.status(400).json({ message: "Slot is not available." });
      //   return;
      //   }
  
     await savedSlot.save();  
  
      return savedSlot;
    } catch (error: unknown) {
      throw (error);
    }
  };

  export const getBookingsByIdServices = async (userId: string) => {
    try {
      const bookings = await UserRegistrationModel.findById(userId).populate('slotBooking');
      return bookings;
    } catch (error) {
      throw error;
    }
  };

  