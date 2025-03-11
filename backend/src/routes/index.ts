import { Request, Response, Router } from 'express';

import { authorizeRole } from '@/middlewares/auth-role.middleware';
import { authRouter } from './auth.routes';
import playerRouter from './player.routes';
import userRouter from './user.routes';

const router = Router();

router.get('/health-check', (_req: Request, res: Response) =>
  res.sendStatus(200),
);

router.use('/users', authorizeRole, userRouter);
router.use('/players', playerRouter);
router.use('/auth', authRouter);

export default router;
