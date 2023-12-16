import express from 'express';
import {login, logout} from './auth.controller';

const loginRouter = express.Router();

loginRouter.post('/login', login);
loginRouter.get('/logout', logout);

export default loginRouter;

