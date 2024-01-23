import { NextFunction, Request, Response } from 'express';
import { parkingBookingServices} from './booking.services';
import { UserRegistrationModel,  } from '../Users/user.model';
import { IParkingBooking, parkingBookingModel } from './booking.model';

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

    // Extracting the image and slotBooking properties explicitly
    const { image, slotBooking } = req.body;

    // Call parkingBookingServices with the required arguments
    const savedBooking = await parkingBookingServices(image, userId, slotBooking);

    if (!savedBooking || !savedBooking._id) {
      const error = new Error("Failed to save parking booking");
      (error as any).statusCode = 500;
      return next(error);
    }

    // push the parking booking id to the user's parkingArea array
    // push the parking booking id to the user's parkingArea array
    // user.parkingArea.push(savedBooking._id.toString());
    
    // // Push the slot booking id to the user's slotBooking array
    // user.slotBooking.push(savedBooking._id.toString());

    // Push the parking booking id to the user's parkingArea array
    user.parkingArea.push(savedBooking._id.toString());

    // Only push the slot booking id to the user's slotBooking array if slotBooking is provided
    if (slotBooking) {
      user.slotBooking.push(slotBooking);
    }
    await user.save();

    res.status(201).json(savedBooking);
  } catch (error: unknown) {
    next(error);
  }
};

