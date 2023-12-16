import { NextFunction, Request, Response } from "express";
import { UserRegistrationModel } from "../Users/user.model";
import * as jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../Constant/index';
import * as bcrypt from 'bcrypt';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    
    const user = await UserRegistrationModel.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      (error as any).statusCode = 403;
      return next(error);
    }

    let token;

    if (user.password) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: "5hrs" });

        res.setHeader("jwt", token);

        return res.json({ role: user.role, token: token, id: user._id });
        // Use 'return' to exit the function after sending the response
      } else {
        const error = new Error("Incorrect password");
        (error as any).statusCode = 403;
        return next(error);
      }
    }

    // Remove 'next();' from here
  } catch (error) {
    return next(error);
  }
};

export const logout = async(
  req: Request,
  res: Response,
) => {
  res.clearCookie("jwt");

  res.status(200).json({message: "User logout successfully"})
}

// export const login = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   try {
//     const user = await UserRegistrationModel.findOne({ email });

//     if (!user) {
//       const error = new Error("User not found");
//       (error as any).statusCode = 403;
//       return next(error);
//     }

//     let token;

//     // Check if email is defined before using it
//     if (user.password) {
//       // Password bcryption
//       const passwordMatch = await bcrypt.compare(password, user.password);

//       if (passwordMatch) {
//         token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: "5hrs" });
//         res.header("jwt", token).json({ role: user.role, token: token, id: user._id });

//         // token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: "5hrs" });
        
//         // res.setHeader("jwt", token);

//         // res.json({ role: user.role, token: token, id: user._id });
//       } else {
//         const error = new Error("Incorrect password");
//         (error as any).statusCode = 403;
//         return next(error);
//       }
//     }
    

//     next();
//   } catch (error) {
//     next(error);
//   }
// };
