// parking.services.ts
import { IParkingBooking, parkingBookingModel, ISlotBooking, slotBookingModel } from "./booking.model";
import { Response } from "express";

export const parkingBookingServices = async (
  image: string
): Promise<IParkingBooking> => {
  try {
    const parkingArea = new parkingBookingModel({ image, slots: [] });
    const newArea = await parkingArea.save();
    return newArea;
  } catch (error: unknown) {
    throw (error);
  }
};

// Update the parkingarea database with the slotbooking id
export const updateUserParkingArea = async (
  userId: string,
  slotBookingId: string,
  res: Response,
): Promise<void> => {
  try {
    const user = await parkingBookingModel.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      (error as any).statusCode = 404;
      throw error;
    }

    user.slotBooking.push(slotBookingId);
    await user.save();

    res.status(200).json({ message: 'Parking Area updated successfully' });
  } catch (error: unknown) {
    console.error('Error updating user parking area:', error);
    throw error;
  }
};

// Slot booking services
export const slotBookingServices = async (
  slot: ISlotBooking
): Promise<ISlotBooking> => {
  try {
    const newSlot = new slotBookingModel(slot);
    const savedSlot = await newSlot.save();

    // If parkingAreaId is provided, update the slot with the parkingArea reference
    if (slot.parkingAreaId) {
      savedSlot.parkingAreaId = slot.parkingAreaId;
      await savedSlot.save();
    }

    return savedSlot;
  } catch (error: unknown) {
    throw (error);
  }
};
