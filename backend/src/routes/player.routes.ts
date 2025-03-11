import { getListPlayers, getPlayerController } from '@/controllers/player.controller';
import { Router } from 'express';

const playerRouter = Router();

// playerRouter.get('/', validateRequest(getListPlayersSchema), getListPlayers);
playerRouter.get('/', getListPlayers);
playerRouter.get('/:playerId', getPlayerController);

export default playerRouter;
