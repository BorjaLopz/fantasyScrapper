import {
  getListPlayersController,
  getPlayerController,
  updatePlayerPositionNameController,
} from '@/controllers/player.controller';
import { Router } from 'express';

const playerRouter = Router();

// playerRouter.get('/', validateRequest(getListPlayersSchema), getListPlayers);
playerRouter.get('/', getListPlayersController);
playerRouter.get('/:playerId', getPlayerController);
playerRouter.put('/position', updatePlayerPositionNameController);

export default playerRouter;
