import { getListMatchesController } from '@/controllers/match.controller';
import { Router } from 'express';

const matchRouter = Router();

matchRouter.get('/', getListMatchesController);

export default matchRouter;
