import { getPlayerController } from '@/controllers/player.controller';
import { getListTeamController } from '@/controllers/team.controller';
import { Router } from 'express';

const teamRouter = Router();

teamRouter.get('/', getListTeamController);
teamRouter.get('/:teamId', getPlayerController);

export default teamRouter;
