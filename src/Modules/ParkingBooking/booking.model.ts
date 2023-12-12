import mongoose, {Document, ObjectId, Schema} from 'mongoose';

export interface IParkingBooking extends Document{
    _id?: ObjectId,
    image: string,
    users: string[];
    
    slotBooking: string[];
}

export const parkingBookingSchema: Schema = new Schema({
    image: {type: String, required: true },
    slotBooking: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'slotBooking',
    }]
})

const parkingBookingModel = mongoose.model<IParkingBooking>('parkingArea', parkingBookingSchema);

// const changeStream = parkingBookingModel.watch();

// changeStream.on('change', (change) => {
//     console.log('user change detected', change)
// })

export {parkingBookingModel};

export interface ISlotBooking extends Document{
    _id?: ObjectId,
    date: Date,
    selectedDate: String,
    selectedTime: String,
    duration: String,
    slotImage: String,
    booked: boolean,
    parkingAreaId?: string; 
}

export const slotBookingSchema: Schema = new Schema({
    date: {type: Date, default: Date.now()},
    selectedDate: {type: String,  required: true,},
    selectedTime: {type: String,   required: true,},
    duration: {type: String,  required: true,},
    slotImage: {type: String,  required: true,},
    booked: {type: Boolean, default: true, required: true,},
    parkingAreaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parkingArea',
      },
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

export {slotBookingModel};