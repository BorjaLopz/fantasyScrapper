import { getLeagueController } from '@/controllers/league.controller';
import { Router } from 'express';

const leagueRouter = Router();

leagueRouter.get('/', getLeagueController);

export default leagueRouter;
