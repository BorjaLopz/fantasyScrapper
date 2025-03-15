import {
  createTeamByUserIdController,
  getListTeamController,
  getTeamByUserIdController,
  getTeamController,
} from '@/controllers/team.controller';
import { Router } from 'express';

const teamRouter = Router();

teamRouter.get('/', getListTeamController);
teamRouter.get('/:teamId', getTeamController);
teamRouter.get('/user/:userId', getTeamByUserIdController);
teamRouter.post('/user/:userId', createTeamByUserIdController);

export default teamRouter;
