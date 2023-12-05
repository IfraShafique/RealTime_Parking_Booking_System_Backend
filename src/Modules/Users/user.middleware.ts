import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

export const userValidator = [
    // check('Date', 'Select the date.').not().isEmpty(),
    check('name', 'Name is required.').not().isEmpty(),
    check('email', 'Email is required.').not().isEmpty(),
    check('contact', 'Contact is required.').not().isEmpty(),
    check('password', 'Password is required.').not().isEmpty(),

    (req: Request, res: Response, next: NextFunction): void =>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            const err = new Error((error as any).errors[0].msg) as any;
            err.statusCode = 422;
            err.data = error;
            return next(err)
        }
        next();
    },
]