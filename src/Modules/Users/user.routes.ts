// user.routes.ts

import express from 'express';
import { adminDetailsController, changeEmailController, changePasswordController, userDetailsController, userRegistrationController } from './user.controller';
import { userValidator } from './user.middleware';

const userRouter = express.Router();

userRouter.post('/registration', userValidator, userRegistrationController);
userRouter.get('/get/users/details', userDetailsController);
userRouter.get('/get/admin/details', adminDetailsController);
userRouter.put('/edit/email/:userId', changeEmailController);
userRouter.put('/changePassword/:userId', changePasswordController)

export default userRouter; 
