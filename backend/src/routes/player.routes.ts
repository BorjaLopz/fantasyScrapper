import {
  addPlayerToMarketController,
  getListPlayersController,
  getPlayerController,
  updatePlayerPositionNameController,
} from '@/controllers/player.controller';
import { Router } from 'express';

const playerRouter = Router();

// playerRouter.get('/', validateRequest(getListPlayersSchema), getListPlayers);
playerRouter.get('/', getListPlayersController);
playerRouter.get('/:playerId', getPlayerController);
playerRouter.post('/toMarket/:playerId/:userId', addPlayerToMarketController);
playerRouter.put('/position', updatePlayerPositionNameController);

export default playerRouter;
