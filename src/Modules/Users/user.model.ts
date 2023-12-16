import mongoose, {Document, ObjectId, Schema} from 'mongoose';
import { IParkingBooking } from '../ParkingBooking/booking.model';
// import uniqueValidator from 'mongoose-unique-validator';
// import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';

export interface IUser extends Document {
    _id?: ObjectId;
    date: Date;
    name: string;
    email: string;
    contact: string;
    password?: string;
    role: string;
    parkingArea: string[];
}

const UserSchema: Schema = new Schema({
    date: {type: Date, default: Date.now()},
    name: {type: String, required: true, default: ''},
    email: {type: String, required: true, default: '', unique: true},
    contact: {type: String, required: true, default: ''},
    password: {type: String, required: true, default: ''},
    role: {type: String, required: true, default: 'user'},
    parkingArea: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'parkingArea', 
      
    }],
})

UserSchema.pre<IUser>('save', function (next) {
    // Convert user's local date to UTC before saving to the database
    if (this.date instanceof Date) {
      const utcDateString = this.date.toISOString();
      this.date = new Date(utcDateString);
    }
    next();
  });

// UserSchema.plugin(uniqueValidator); 
// UserSchema.plugin(softDeletePlugin);

const UserRegistrationModel = mongoose.model<IUser>(
    'User',
    UserSchema,
);

const changeStream = UserRegistrationModel.watch();

changeStream.on('change', (change)=> {
  console.log('user change detected:', change);
});

export {UserRegistrationModel};
