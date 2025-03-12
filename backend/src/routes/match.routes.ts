import { getListMatchesController } from '@/controllers/match.controller';
import { validateRequest } from '@/middlewares/request-validator.middleware';
import { getListMatchesSchema } from '@/requests/match-request';
import { Router } from 'express';

const matchRouter = Router();

matchRouter.get('/', validateRequest(getListMatchesSchema), getListMatchesController);

export default matchRouter;
