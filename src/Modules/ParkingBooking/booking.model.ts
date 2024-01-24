import mongoose, {Document, ObjectId, Schema} from 'mongoose';

export interface IParkingBooking extends Document{
    _id?: ObjectId,
    image: string,
    users: ObjectId | null;
    slotBooking: string;
}

export const parkingBookingSchema: Schema = new Schema({
    image: {type: String, required: true },
    users: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},  
    slotBooking: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'slotBooking',
        default: null,
      }],
})

const parkingBookingModel = mongoose.model<IParkingBooking>('parkingArea', parkingBookingSchema);

const changeDetect = parkingBookingModel.watch();

changeDetect.on('change', async (change) => {
    if (change.operationType === 'update') {
        const updatedDocument = await parkingBookingModel.findById(change.documentKey._id);
        if (updatedDocument && updatedDocument.slotBooking !== null) {
          console.log(`Slot booked with ID: ${updatedDocument.slotBooking}`);
          // You can perform additional actions here based on the update
        }
      }
})

export {parkingBookingModel};

