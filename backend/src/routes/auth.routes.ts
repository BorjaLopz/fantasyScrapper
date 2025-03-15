import express from 'express';
import { login, logout, getSession } from '@/controllers/auth.controller';
import { loginSchema } from '@/requests/auth-request';
import { validateRequest } from '@/middlewares/request-validator.middleware';

export const authRouter = express.Router();

authRouter.post('/login', validateRequest(loginSchema), login);
authRouter.post('/logout', logout);
authRouter.get('/session', getSession);
