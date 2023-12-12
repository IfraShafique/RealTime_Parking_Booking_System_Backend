import { NextFunction, Request, Response } from "express";
import { UserRegistrationModel } from "../Users/user.model";
import * as Jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../../Constant";

declare module "express" {
  export interface Request {
    user?: any; // Replace 'any' with the actual type of your user object
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Verify Token Middleware");
    const token = req.headers.authorization;
    console.log("token", token);
    if (!token) {
      const error = new Error("Unauthorized");
      (error as any).statusCode = 401;
      return next(error);
    }
    const decoded = Jwt.verify(token, SECRET_KEY) as Jwt.JwtPayload;
    console.log('Decoded Token:', decoded);

    const user = await UserRegistrationModel.findById(decoded._id);

    if (!user) {
      const error = new Error("Unauthorized User");
      (error as any).statusCode = 401;
      return next(error);
    }

    req.user = user;
    return next();  // Add a return statement here
  } catch (error) {
    // Handle token verification errors
    // console.error(error);
    const authError = new Error("Unauthorized");
    (authError as any).statusCode = 401;
    return next(authError);
  }
};
