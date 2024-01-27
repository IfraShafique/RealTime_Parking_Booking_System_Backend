import mongoose, {Document, ObjectId, Schema} from "mongoose";

export interface IContactUs extends Document {
    _id?: ObjectId;
    date: Date;
    name: string;
    email: string;
    message: string;
}

const contactSchema: Schema = new Schema({
    date: {type: Date, default: Date.now()},
    name: {type: String, required: true},
    email: {type: String, required: true},
    message: {type: String, required: true},
}) 

const ContactUsModel = mongoose.model<IContactUs>(
    'ContactUs',
    contactSchema,
);


const changeStream = ContactUsModel.watch();

changeStream.on('change', (change)=> {
  console.log('user change detected:', change);
});

export {ContactUsModel};
