import { NextFunction, Response } from "express";
import {UserRegistrationModel, IUser} from './user.model'
import { ResponsePacket } from '../../Utils';
import { BCRYPT_SALT } from '../../Constant';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';


// Check if email exist or not
export const isEmailExistService = async (
    email: any,
    next: NextFunction,
): Promise<boolean | undefined | void> => {
    try {
        const isUser = await UserRegistrationModel.findOne({'email': email, isDeleted: false, status: 'Active'});
        if(isUser){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        (error as any).statusCode = 400;
        return next(error);
    }
};

// Create a new user
// export class userRegstrationService {
//     static async createUser(userData: any): Promise<any>{
//         return await UserRegistrationModel.create(userData)
//     }
// }
export const userRegstrationService = async (
  data: IUser,
  res: Response
): Promise<void> => {
  try {
    const salt = await bcrypt.genSalt(parseInt(BCRYPT_SALT as string));
    data.password = await bcrypt.hash(data.password as string, salt);

    const newUser = new UserRegistrationModel(data);
    const result = await newUser.save();

    if ((result as any)._doc) delete (result as any)._doc.password;

    const resPacket = new ResponsePacket(
      201,
      true,
      "User Created Successfully",
      result
    );

    // Send registration email
    // await sendRregistrationEmail(data.email);
    res.status(201).json(resPacket);
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
