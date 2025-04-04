import { Request, Response, Router } from 'express';

import { authorizeRole } from '@/middlewares/auth-role.middleware';
import { authRouter } from './auth.routes';
import leagueRouter from './league.routes';
import marketRouter from './market.routes';
import matchRouter from './match.routes';
import playerRouter from './player.routes';
import teamRouter from './team.routes';
import userRouter from './user.routes';

const router = Router();

router.get('/health-check', (_req: Request, res: Response) =>
  res.sendStatus(200),
);

router.use('/users', authorizeRole, userRouter);
router.use('/league', leagueRouter);
router.use('/players', playerRouter);
router.use('/teams', teamRouter);
router.use('/matches', matchRouter);
router.use('/market', marketRouter);
router.use('/auth', authRouter);

export default router;
