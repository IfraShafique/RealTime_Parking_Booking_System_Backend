// user.routes.ts

import express from 'express';
import { userRegistrationController } from './user.controller';
import { userValidator } from './user.middleware';

const userRouter = express.Router();

userRouter.route('/registration').post(userValidator, userRegistrationController);

export default userRouter; 
