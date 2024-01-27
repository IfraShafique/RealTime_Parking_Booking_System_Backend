import { NextFunction, Request, Response } from 'express';
import { userRegistrationService, isEmailExistService, editEmailServices, adminDetailsServices, changePasswordService } from './user.services';
import { userDetailsServices } from './user.services';
import { UserRegistrationModel, IUser } from './user.model';
import * as bcrypt from 'bcrypt'

export const userRegistrationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try{
      const isUserExist = await isEmailExistService(req.body.email, next);

      if (!isUserExist) {
          const user = {
          ...req.body,
          parkingArea: req.body.parkingArea,
          slotBooking: req.body.slotBooking,
        };
        await userRegistrationService(user, res);
        
        
        
      } else {
        const error = new Error('User Already Exist');
        (error as any).statusCode = 403;
        return next(error);
      }

  }catch(error){
      // error.statusCode = 403;
      next(error);
  }
}

// get user details
export const userDetailsController = async(
  req: Request,
  res:Response,
  next: NextFunction
):Promise<void> => {
  try {
    const users = await userDetailsServices();
     if(!users){
      res.status(404).json({message: "No user exists"})
     }
     else{
      res.status(200).json(users)
     }
  } catch (error) {
      res.status(500).json({error: (error as any).message})
  }
}

// change email address controller
export const changeEmailController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, name, contact } = req.body;
    const userId = req.params.userId;

    const editing = await editEmailServices(userId, email, name, contact);
    res.status(200).json({ message: "Email changed successfully", user: editing });
  } catch (error) {
    res.status(500).json({ error: (error as any).message, stack: (error as any).stack });
  }
};

// get admin details
export const adminDetailsController = async(
  req: Request,
  res:Response,
  next: NextFunction
):Promise<void> => {
  try {
    const users = await adminDetailsServices();
     if(!users){
      res.status(404).json({message: "No user exists"})
     }
     else{
      res.status(200).json(users)
     }
  } catch (error) {
      res.status(500).json({error: (error as any).message})
  }
}

// change password controller

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await UserRegistrationModel.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Ensure oldPassword is not undefined
    if (!oldPassword) {
      res.status(400).json({ error: 'Old password is required' });
      return;
    }

    // compare password
    const comparePassword = await bcrypt.compare(oldPassword, user.password || '');

    if (!comparePassword) {
      res.status(401).json({ error: 'Old password is incorrect' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateUser = await changePasswordService(userId, hashedPassword);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};