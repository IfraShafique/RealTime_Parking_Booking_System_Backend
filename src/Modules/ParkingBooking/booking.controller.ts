import { NextFunction, Request, Response } from 'express';
import { parkingBookingServices, slotBookingServices } from './booking.services';
import { UserRegistrationModel,  } from '../Users/user.model';
import { IParkingBooking, ISlotBooking, parkingBookingModel } from './booking.model';

export const parkingBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await UserRegistrationModel.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      (error as any).statusCode = 404;
      return next(error);
    }

    const { image } = req.body;
    const savedBooking = await parkingBookingServices(image);

    if (!savedBooking || !savedBooking._id) {
      // Handle the case where savedBooking is undefined or _id is undefined
      const error = new Error("Failed to save parking booking");
      (error as any).statusCode = 500;
      return next(error);
    }

    // push the parking booking id to the user's parkingArea array
    user.parkingArea.push(savedBooking._id.toString());
    await user.save();

    res.status(201).json(savedBooking);
  } catch (error: unknown) {
    next(error);
  }
};

// Slot Booking Controller
export const slotBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await UserRegistrationModel.findById(userId);
    const parkingUser = await parkingBookingModel.findById(req.params.parkingAreaId);

    // if (!user) {
    //   const error = new Error("User not found");
    //   (error as any).statusCode = 404;
    //   return next(error);
    // }

    const slotBooking = {
        ...req.body,
      };

    const savedBooking = await slotBookingServices(slotBooking);
    console.log(savedBooking);

    if (!savedBooking || !savedBooking._id) {
      // Handle the case where savedBooking is undefined or _id is undefined
      const error = new Error("Failed to save parking booking");
      (error as any).statusCode = 500;
      return next(error);
    }

    // push the parking booking id to the user's parkingArea array
    // Use optional chaining to safely access the slotBooking array
    parkingUser?.slotBooking?.push(savedBooking._id.toString());
    await parkingUser?.save();

    res.status(201).json(savedBooking);
  } catch (error: unknown) {
    next(error);
  }
};
