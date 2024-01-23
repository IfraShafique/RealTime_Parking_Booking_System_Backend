import { IParkingBooking, parkingBookingModel } from "./booking.model";
import { Response } from "express";

export const parkingBookingServices = async (
  image: string,
  userId: string,
  slotBookingId?: string | null
): Promise<IParkingBooking> => {
  try {
    const parkingArea = new parkingBookingModel({
      image,
      users: userId,
      slotBooking: slotBookingId ,
    });
    const newArea = await parkingArea.save();
    return newArea;
  } catch (error: unknown) {
    throw error;
  }
};

// Update the parkingarea database with the slotbooking id
export const updateUserParkingArea = async (
  userId: string,
  slotBookingId: string,
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await parkingBookingModel.findById(userId).exec();

    if (!user) {
      const error = new Error('User not found');
      (error as any).statusCode = 404;
      throw error;
    }

    if (user.slotBooking) {
      (user.slotBooking as any).push(slotBookingId);
      await user.save();
    } else {
        const error = new Error('User not found');
        (error as any).statusCode = 404;
        throw error;
    }

    res.status(200).json({ message: 'Parking Area updated successfully' });
  } catch (error: unknown) {
    console.error('Error updating user parking area:', error);
    throw error;
  }
};

