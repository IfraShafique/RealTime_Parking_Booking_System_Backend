import { NextFunction, Request, Response } from 'express';
import { userRegistrationService, isEmailExistService } from './user.services';
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
