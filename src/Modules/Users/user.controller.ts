import { NextFunction, Request, Response } from 'express';
import { userRegstrationService, isEmailExistService } from './user.services';


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
        };
        await userRegstrationService(user, res);
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
// export const userRegistrationController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const isUserExist = await isEmailExistService(req.body.email, next);

//     if(!isUserExist){
//       const user = {
//         ...req.body,
//       };
      
//     }
//     else{
//       const error = new Error("User Alreadt Exist");
//       // error.statusCode = 403;
//       return next(error);
//     }
//     const newUser = {
//       date: req.body.date,
//       name: req.body.name,
//       email: req.body.email,
//       contact: req.body.contact,
//       password: req.body.password,
//       role: req.body.role || 'user',
//     };

//     console.log('Received data: ', newUser);

//     const user = await userRegstrationService.createUser(newUser);
//     console.log('User', user);

//     res.json(user);
//   } catch (error: any) {
//     console.error('Error registering user: ', error);
//     res.status(500).json({ error: error.message });
//   }
// };
