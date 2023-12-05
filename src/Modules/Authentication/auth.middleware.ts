import { NextFunction, Request, Response } from "express";
import { UserRegistrationModel } from "../Users/user.model";
import * as Jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../../Constant";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    const error = new Error("Unauthorized");
    (error as any).statusCode = 401;
    return next(error);
  }

  const decoded = Jwt.verify(token, SECRET_KEY) as Jwt.JwtPayload;
  res.status(200).json("User successfully verified");

  const user = await UserRegistrationModel.findById(decoded._id);

  if (!user) {
    const error = new Error("Unauthorized");
    (error as any).statusCode = 401;
    return next(error);
  }
  req.user = user;
  next();
}