import { ISlotBooking, slotBookingModel } from "./slot.model";
import {Request, Response, NextFunction} from "express"

// Validate that if slot available or not
export const isSlotAvailable = async (slot: ISlotBooking): Promise<boolean> => {
  try {
      const { selectedDate, selectedTime, duration, slot: slotNumber } = slot;

      // Calculate the end time
      const startTime = new Date(`${selectedDate} ${selectedTime}`);
      const endTime = new Date(startTime.getTime() + parseInt(duration.toString(), 10) * 60 * 1000);

      const existingSlot = await slotBookingModel.findOne({
          selectedDate,
          slot: slotNumber,
          booked: true,
          $or: [
              {
                  $and: [
                      { startTime: { $lte: startTime } },
                      { endTime: { $gt: startTime } },
                  ],
              },
              {
                  $and: [
                      { startTime: { $lt: endTime } },
                      { endTime: { $gte: endTime } },
                  ],
              },
              {
                  $and: [
                      { startTime: { $gte: startTime } },
                      { endTime: { $lte: endTime } },
                  ],
              },
          ],
      });

      return !existingSlot; // Returns true if the slot is available, false otherwise
  } catch (error) {
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
      const isAvailable = await isSlotAvailable(slot);

      if(!isAvailable){
        res.status(400).json({ message: "Slot is not available." });
        return;
        }
  
      // If parkingAreaId is provided, update the slot with the parkingArea reference
    //   if (slot.parkingAreaId) {
    //     // Update the parking area with the slot booking reference
    //     await updateParkingArea(slot.parkingAreaId, savedSlot._id);
    //   } 
      await savedSlot.save();  
  
      return savedSlot;
    } catch (error: unknown) {
      throw (error);
    }
  };



  