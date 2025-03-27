import {
  createTeamByUserIdController,
  getListTeamController,
  getTeamByUserIdController,
  getTeamController,
  updateTeamFormationController,
} from '@/controllers/team.controller';
import { Router } from 'express';

const teamRouter = Router();

teamRouter.get('/', getListTeamController);
teamRouter.get('/:teamId', getTeamController);
teamRouter.put('/formation/:teamId', updateTeamFormationController);
teamRouter.get('/user/:userId', getTeamByUserIdController);
teamRouter.post('/user/:userId', createTeamByUserIdController);

export default teamRouter;
