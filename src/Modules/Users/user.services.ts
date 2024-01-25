// user.services.ts

import { NextFunction, Response } from 'express';
import { UserRegistrationModel, IUser } from './user.model';
import { ResponsePacket } from '../../Utils';
import { BCRYPT_SALT } from '../../Constant';
import bcrypt from 'bcrypt';
import { parkingBookingModel } from '../ParkingBooking/booking.model';
import { slotBookingModel } from '../SlotBooking/slot.model';

export const isEmailExistService = async (
  email: any,
  next: NextFunction,
): Promise<boolean | undefined | void> => {
  try {
    const isUser = await UserRegistrationModel.findOne({ email, isDeleted: false, status: 'Active' });
    return !!isUser;
  } catch (error) {
    (error as any).statusCode = 400;
    return next(error);
  }
};

export const userRegistrationService = async (
  data: IUser,
  res: Response,
): Promise<void> => {
  try {
    const salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT as string, 10));
    data.password = await bcrypt.hash(data.password as string, salt);

    // Initialize parkingAreas as an empty array by default
    const newUser = new UserRegistrationModel({
      ...data,
      parkingArea: [],
      slotBooking: [],
    });

    const result = await newUser.save();

    if ((result as any)._doc) delete (result as any)._doc.password;

    const resPacket = new ResponsePacket(
      201,
      true,
      'User Created Successfully',
      result,
    );

    res.status(201).json(resPacket);
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateUserParkingArea = async (
  userId: string,
  parkingAreaId: string,
  slotBookingId: string,
  res: Response,
): Promise<void> => {
  try {
    const user = await UserRegistrationModel.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      (error as any).statusCode = 404;
      throw error;
    }

    // Update parkingArea and slotBooking separately
    user.parkingArea.push(parkingAreaId);
    user.slotBooking.push(slotBookingId);
    await user.save();

    res.status(200).json({ message: 'Parking Area updated successfully' });
  } catch (error: unknown) {
    console.error('Error updating user parking area:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// get the user details
export const userDetailsServices = async() => {
  try {
    const users = await UserRegistrationModel.find({role: 'user'});
    return users;
  } catch (error) {
    throw error;
  }
}
