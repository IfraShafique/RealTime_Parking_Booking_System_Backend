import mongoose, {Document, ObjectId, Schema} from 'mongoose';

export interface IParkingBooking extends Document{
    _id?: ObjectId,
    image: string,
    users: ObjectId | null;
    slotBooking: ObjectId | null;
}

export const parkingBookingSchema: Schema = new Schema({
    image: {type: String, required: true },
    users: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},  
    slotBooking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'slotBooking',
        default: null,
      },
})

const parkingBookingModel = mongoose.model<IParkingBooking>('parkingArea', parkingBookingSchema);

const changeDetect = parkingBookingModel.watch();

changeDetect.on('change', (change) => {
    console.log('user change detected', change)
})

export {parkingBookingModel};

