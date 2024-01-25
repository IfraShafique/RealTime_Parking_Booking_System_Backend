// user.routes.ts

import express from 'express';
import { userDetailsController, userRegistrationController } from './user.controller';
import { userValidator } from './user.middleware';

const userRouter = express.Router();

userRouter.post('/registration', userValidator, userRegistrationController);
userRouter.get('/get/users/details', userDetailsController)

export default userRouter; 
