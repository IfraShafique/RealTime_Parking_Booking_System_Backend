import express from 'express';
import {login} from './auth.controller';

const loginRouter = express.Router();

loginRouter.post('/login', login);

export default loginRouter;

