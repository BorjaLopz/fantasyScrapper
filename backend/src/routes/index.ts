import { Request, Response, Router } from 'express';

import { authorizeRole } from '@/middlewares/authRoleMiddleware';
import { authRouter } from './authRoutes';
import playerRouter from './playerRoutes';
import userRouter from './userRoutes';

const router = Router();

router.get('/health-check', (_req: Request, res: Response) =>
  res.sendStatus(200),
);

router.use('/users', authorizeRole, userRouter);
router.use('/players', playerRouter);
router.use('/auth', authRouter);

export default router;
