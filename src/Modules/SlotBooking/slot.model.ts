import mongoose, { Document, ObjectId, Schema } from "mongoose";

// Function to convert time to minutes
const convertToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export interface ISlotBooking extends Document {

  _id?: ObjectId;
  date: Date;
  selectedDate: string;
  selectedTime: string;
  duration: string;
  slotImage: string;
  booked: boolean;
  slot: string;
  bookUser: ObjectId | null;
  selectedImage: string;
  startTime: number; // Add startTime property
  endTime: number;   // Add endTime property
}

export const slotBookingSchema: Schema = new Schema({
  date: { type: Date, default: Date.now() },
  selectedDate: { type: String, required: true },
  selectedTime: { type: String, required: true },
  duration: { type: String, required: true },
  slotImage: { type: String, required: true },
  booked: { type: Boolean, default: true, required: true },
  selectedImage: { type: String, required: true },
  bookUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// Middleware to convert user's local date to UTC and calculate startTime and endTime
slotBookingSchema.pre<ISlotBooking>('save', function (next) {
  if (this.date instanceof Date) {
    const utcDateString = this.date.toISOString();
    this.date = new Date(utcDateString);
  }

  // Calculate and set startTime and endTime
  const startTimeMinutes = convertToMinutes(this.selectedTime);
  const durationMinutes = parseInt(this.duration, 10);
  this.startTime = startTimeMinutes;
  this.endTime = startTimeMinutes + durationMinutes;
  console.log('Middleware - Start Time:', this.startTime);
  console.log('Middleware - End Time:', this.endTime);

  next(); // Move to the next middleware
});

const slotBookingModel = mongoose.model<ISlotBooking>('slotBooking', slotBookingSchema);

const changeStream = slotBookingModel.watch();

changeStream.on('change', (change) => {
  console.log('user change detected:', change);
});

export { slotBookingModel };


// import mongoose, {Document, ObjectId, Schema} from "mongoose";

// export interface ISlotBooking extends Document{
//     _id?: ObjectId,
//     date: Date,
//     selectedDate: String,
//     selectedTime: Date,
//     duration: string,
//     slotImage: String,
//     booked: boolean,
//     slot: String;
//     bookUser: ObjectId | null;
//     selectedImage: String;
// }

// export const slotBookingSchema: Schema = new Schema({
//     date: {type: Date, default: Date.now()},
//     selectedDate: {type: String,  required: true,},
//     selectedTime: {type: String,   required: true,},
//     duration: {type: String,  required: true,},
//     slotImage: {type: String,  required: true,},
//     booked: {type: Boolean, default: true, required: true,},
//     selectedImage: {type: String, required: true,},
//     bookUser: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    
// })

// slotBookingSchema.pre<ISlotBooking>('save', function (next) {
//     // Convert user's local date to UTC before saving to the database
//     if (this.date instanceof Date) {
//       const utcDateString = this.date.toISOString();
//       this.date = new Date(utcDateString);
//     }
//     next();
//   });

// const slotBookingModel = mongoose.model<ISlotBooking>('slotBooking', slotBookingSchema);

// const changeStream = slotBookingModel.watch();

// changeStream.on('change', (change)=> {
//   console.log('user change detected:', change);
// });

// export {slotBookingModel};
