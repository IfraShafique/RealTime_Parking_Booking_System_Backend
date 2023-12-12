import {Request, Response, NextFunction} from "express";
import { slotBookingModel } from "./booking.model";

export const isSlotAvailable = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {selectedDate, selectedTime, duration, slot} = req.body;

        // Calculate the end time
        const startTime = new Date(`${selectedDate} ${selectedTime}`);
        const endTime = new Date(startTime.getTime() + parseInt(duration, 10) * 60 * 1000);

        const existingSlot = await slotBookingModel.findOne({
            selectedDate, 
            slot, 
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
        

        if(existingSlot ){
            const err = new Error("Slot is already booked and not available.") as any;
            err.statusCode = 422;
            return next(err);
        }
    } catch (error) {
        res.status(500).json({
            message: (error as any).message,
        });
    }
}