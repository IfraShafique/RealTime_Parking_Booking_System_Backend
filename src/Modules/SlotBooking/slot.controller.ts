import { slotBookingServices, isSlotAvailableService, getBookingsByIdServices, getBookingsServices, cancelBookingByIdServices } from "./slot.services";
import { NextFunction, Response, Request, response } from "express";
import { UserRegistrationModel } from "../Users/user.model";
import nodemailer from "nodemailer";
import { USER,PASS } from "../../Constant";
import { rmSync } from "fs";

// create a node mailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: USER,
    pass: PASS
  }
})
// forward-email=ifrashafique123@gmail.com
export const slotBookingController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.body.userId;
    // find the user id from the request body
    const bookUser = await UserRegistrationModel.findById(userId);

    const {selectedDate, selectedTime, duration, selectedImage, slotImage} = req.body;

    // check if the slot available or not
    const isSlotAvailable = await isSlotAvailableService( selectedDate, selectedTime, selectedImage, duration,
      slotImage,);

    if(!isSlotAvailable){
      const error = new Error("Slot is already booked.");
      (error as any).statusCode = 404;
      throw error;
    }

    if (!bookUser) {
      const error = new Error("User not found");
      (error as any).statusCode = 404;
      return next(error);
    }

    const slotBooking = {
      ...req.body,
      bookUser: userId,
      selectedImage: selectedImage,
    };
    // delete slotBooking['bookUser']

    // saved the data in the database
    const savedParking = await slotBookingServices(slotBooking, res);
    console.log(savedParking);

    if (!savedParking || !savedParking._id) {
      // Handle the case where savedBooking is undefined or _id is undefined
      const error = new Error("Failed to save parking booking");
      (error as any).statusCode = 500;
      return next(error);
    }
    
    // fetch the users email
    const userEmail = bookUser.email;
    // call the email function
    await sendBookingConfirmationEmail(userEmail);

    // Push the slot booking id to the user database
    bookUser.slotBooking.push(savedParking._id.toString());
    await bookUser?.save();

    res.status(201).json(savedParking);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Slot is already booked') {
      res.status(400).json({ message: 'Slot is already booked' });
    } else {
      next(error);
    }
  }
};

// Function to send confirmation email
const sendBookingConfirmationEmail = async (toEmail: string) => {
  const mailOptions = {
    from: 'parkease001@gmail.com',
    to: toEmail,
    subject: 'Parking Booking Confirmation',
    text: "Your parking booking has been confirmed. Thank you for using our services"
  };
  await transporter.sendMail(mailOptions);
}
  
// get booking details by user id
export const getSlotBookingByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<void> => {

  try{
    
    const userId = req.params.userId;
    console.log(userId)
    const bookings = await getBookingsByIdServices(userId);

    if (!bookings) {
      res.status(404).json({ message: 'No bookings found' });
      return;
    }

    res.status(200).json(bookings);
  }
  catch(error){
    throw error;
  }
}

// fetch all bookings
export const getAllBookingsController = async(
  req: Request,
  res: Response,
):Promise<void> => {
  try {
    const allBookings = await getBookingsServices()
    if(!allBookings){
      res.status(404).json({message: "No bookings Found"})
    }
    res.status(200).json(allBookings);
  } catch (error) {
    res.status(500).json({error: (error as any).message})
  }
}

// delete bookings by id
export const cancelBookingController = async(
  req: Request,
  res: Response
): Promise <void> => {

  try {
    const bookingId = req.params.bookingId;
    // const bookingId = "65b18a532f5d4068a3814ac8"
    console.log(bookingId)
    const deleteBooking = await cancelBookingByIdServices(bookingId);
    // console.log(deleteBooking)
    if (!deleteBooking) {
      res.status(404).json({ message: "No Bookings Found" });
    } else {
      res.status(200).json(deleteBooking);
    }


  } catch (error) {
    res.status(500).json({error: (error as any).message})
  }
} 
 