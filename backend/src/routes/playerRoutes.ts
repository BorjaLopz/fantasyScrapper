import { getListPlayers } from '@/controllers/playerController';
import { validateRequest } from '@/middlewares/requestValidatorMiddleware';
import { getListPlayersSchema } from '@/requests/playerRequest';
import { Router } from 'express';

const playerRouter = Router();

// playerRouter.get('/', validateRequest(getListPlayersSchema), getListPlayers);
playerRouter.get('/', getListPlayers);

export default playerRouter;
