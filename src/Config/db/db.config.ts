import mongoose from "mongoose";
import {MONGO_URI} from '../../Constant/index';

mongoose.Promise = global.Promise;
export const dbConnect = (): void => {
    mongoose.connect(MONGO_URI, {});
    const connection = mongoose.connection;
    connection.once('open', function() {
        console.log(
            "*****Mongoose database connection established successfully*****"
        );
    });
};