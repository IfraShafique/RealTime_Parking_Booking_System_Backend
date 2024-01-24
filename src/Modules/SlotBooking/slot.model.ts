import mongoose, {Document, ObjectId, Schema} from "mongoose";

export interface ISlotBooking extends Document{
    _id?: ObjectId,
    date: Date,
    selectedDate: String,
    selectedTime: Date,
    duration: string,
    slotImage: String,
    booked: boolean,
    slot: String;
    bookUser: ObjectId | null;
    selectedImage: String;
}

export const slotBookingSchema: Schema = new Schema({
    date: {type: Date, default: Date.now()},
    selectedDate: {type: String,  required: true,},
    selectedTime: {type: String,   required: true,},
    duration: {type: String,  required: true,},
    slotImage: {type: String,  required: true,},
    booked: {type: Boolean, default: true, required: true,},
    selectedImage: {type: String, required: true,},
    bookUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    
})

slotBookingSchema.pre<ISlotBooking>('save', function (next) {
    // Convert user's local date to UTC before saving to the database
    if (this.date instanceof Date) {
      const utcDateString = this.date.toISOString();
      this.date = new Date(utcDateString);
    }
    next();
  });

const slotBookingModel = mongoose.model<ISlotBooking>('slotBooking', slotBookingSchema);

const changeStream = slotBookingModel.watch();

changeStream.on('change', (change)=> {
  console.log('user change detected:', change);
});

export {slotBookingModel};