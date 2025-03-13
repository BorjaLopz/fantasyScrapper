import {
  getAllMatchdaysController,
  getCurrentMatchdayController,
  getCurrentMatchesForMatchdayController,
  getListMatchesController,
} from '@/controllers/match.controller';
import { validateRequest } from '@/middlewares/request-validator.middleware';
import { getListMatchesSchema } from '@/requests/match-request';
import { Router } from 'express';

const matchRouter = Router();

matchRouter.get(
  '/',
  validateRequest(getListMatchesSchema),
  getListMatchesController,
);
matchRouter.get('/currentMatchday', getCurrentMatchdayController);
matchRouter.get('/matchday', getAllMatchdaysController);
matchRouter.get('/matchday/:matchDay', getCurrentMatchesForMatchdayController);

export default matchRouter;
