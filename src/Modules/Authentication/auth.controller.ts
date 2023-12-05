import { NextFunction, Request, Response } from "express";
import { UserRegistrationModel } from "../Users/user.model";
import * as jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../Constant/index';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserRegistrationModel.findOne({ email });
    try {
        if (!user) {
            const error = new Error("User not found");
            (error as any).statusCode = 403;
            return next(error);
        }

        let token; // Declare the token variable outside the if block

        if (user.password === password) {
            token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '5hrs' });
            res.json({ user, token });
        }

        // Move this part outside the if block
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
        });
        
        res.json({ role: user.role, id: user._id });
        
        next();

    } catch (error) {
        next(error);
    }
}
