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
    const convertToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    // Extract hours and minutes from the duration string
    const durationMatch = duration.match(/(\d+)\s*hours?/i);
    const durationInMinutes = durationMatch ? parseInt(durationMatch[1], 10) * 60 : 0;

    const startTimeMinutes = convertToMinutes(selectedTime);
    const endTimeMinutes = startTimeMinutes + durationInMinutes;

    // Check if there are any overlapping slots in the database
    const existingSlots = await slotBookingModel.find({
      selectedDate,
      selectedImage,
      slotImage,
      booked: true,
    });

    const isSlotAvailable = existingSlots.every(slot => {
      const slotStartTime = slot.startTime || convertToMinutes(slot.selectedTime);
      const slotEndTime = slot.endTime || (slotStartTime + (parseInt(slot.duration, 10) || 0));

      // Check for overlap condition
      const overlapCondition =
        (startTimeMinutes < slotEndTime && endTimeMinutes > slotStartTime);

      console.log('Overlap Condition:', overlapCondition);
      console.log('Slot Start Time:', slotStartTime);
      console.log('Slot End Time:', slotEndTime);
      console.log('Start Time (minutes):', startTimeMinutes);
      console.log('End Time (minutes):', endTimeMinutes);

      return !overlapCondition; // Slot is available if there is no overlap
    });

    console.log('Existing Slots:', existingSlots);
    return isSlotAvailable;
  } catch (error) {
    console.error("Error in slot availability: ", error);
    throw error;
  }
};
// export const isSlotAvailableService = async (
//    selectedDate: string,
//    selectedTime: string,
//    selectedImage: string,
//    duration: string,
//    slotImage: string
//    ): Promise<boolean> => {
//   try {
//       // const { selectedDate, selectedTime, duration, slot: slotNumber,selectedImage } = req.body;

//       // Calculate the end time
//       const startTime = new Date(`${selectedDate} ${selectedTime}`);
//       const endTime = new Date(startTime.getTime() + parseInt(duration.toString(), 10) * 60 * 1000);
//       console.log("end time: ", endTime);
//       console.log("start time: ", startTime);

//       const existingSlot = await slotBookingModel.findOne({
//           selectedDate,
//           selectedTime,
//           selectedImage,
//           duration,
//           slotImage,
//           booked: true,
//         });
//           if (existingSlot) {
//             // Check if the current time is past the end time of the slot
//             // const date = new Date(selectedDate);
//             const currentTime = new Date();
//             const slotEndTime = new Date(existingSlot.selectedTime.getTime() + parseInt(existingSlot.duration, 10) * 60 * 1000);
//             console.log("CT",currentTime);
//             console.log("ST",slotEndTime);
//             if (currentTime > slotEndTime) {
//               // Slot duration has passed, make the slot available again
//               existingSlot.booked = false;
//               await existingSlot.save();
//               return true;
//             }
      
//             return false; // Slot is booked and within the duration
//           }
//       //     $or: [
//       //         {
//       //             $and: [
//       //                 { startTime: { $lte: startTime } },
//       //                 { endTime: { $gt: startTime } },
//       //             ],
//       //         },
//       //         {
//       //             $and: [
//       //                 { startTime: { $lt: endTime } },
//       //                 { endTime: { $gte: endTime } },
//       //             ],
//       //         },
//       //         {
//       //             $and: [
//       //                 { startTime: { $gte: startTime } },
//       //                 { endTime: { $lte: endTime } },
//       //             ],
//       //         },
//       //     ],
      

//       return !existingSlot; // Returns true if the slot is available, false otherwise
//   } catch (error) {
//       console.error("Error in slot availability: ", error);
//       throw error;
//   }
// };

// Slot booking services
export const slotBookingServices = async (
    slot: ISlotBooking,
    res: Response,
  ): Promise<ISlotBooking | undefined> => {
    try {   
      const isAvailable = await isSlotAvailableService(
      slot.selectedDate,
      slot.selectedTime,
      slot.selectedImage,
      slot.duration,
      slot.slotImage
    );

    console.log("isAvailable: ", isAvailable);

    if (!isAvailable) {
      res.status(400).json({ message: "Slot is not available." });
      return;
    }
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

  // get request for fetching bookinng data by user id
  export const getBookingsByIdServices = async (userId: string) => {
    try {
      const bookings = await UserRegistrationModel.findById(userId).populate("slotBooking");
      console.log(bookings)
      return bookings;
    } catch (error) {
      throw error;
    }
  };

  // get request for fecthing all user bookings
  export const getBookingsServices = async () => {
    try {
      const allBookings = await slotBookingModel.find().populate({path:'bookUser'});
      return allBookings;
    } catch (error) {
      throw error;
    }
  }

  // cancellation functionality
    export const cancelBookingByIdServices = async(bookingId: string) => {
      try {
        const deleteBooking = await slotBookingModel.findByIdAndDelete(bookingId).lean();
        // const deleteBooking = await UserRegistrationModel.findByIdAndDelete(bookingId).populate({path: 'slotBooking'});
        
        // alse remove reference fromm user registration model
        await UserRegistrationModel.updateOne(
          { _id: deleteBooking.bookUser },
          { $pull: { slotBooking: bookingId } }
        );
    
        return deleteBooking;

      } catch (error) {
          throw error;
      } 
    }


  
