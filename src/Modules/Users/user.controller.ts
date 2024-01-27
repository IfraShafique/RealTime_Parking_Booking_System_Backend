import { NextFunction, Request, Response } from 'express';
import { userRegistrationService, isEmailExistService, editEmailServices, adminDetailsServices } from './user.services';
import { userDetailsServices } from './user.services';

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
export const changeEmailController = async(
  req: Request,
  res: Response,
  next: NextFunction
):Promise<void> => {
  try {
    const email = req.body.email;
    const userId = req.params.userId;

    const editing = await editEmailServices(userId, email);
    res.json({message: "Email changed successfully"})
    res.status(200).json(editing)

  // update the email
  } catch (error) {
    res.status(500).json({error: (error as any).message})
  }
}

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