import {
  addPlayerToMarketController,
  getListPlayersController,
  getPlayerController,
  removePlayerFromMarketController,
  updatePlayerPositionNameController,
} from '@/controllers/player.controller';
import { Router } from 'express';

const playerRouter = Router();

// playerRouter.get('/', validateRequest(getListPlayersSchema), getListPlayers);
playerRouter.get('/', getListPlayersController);
playerRouter.get('/:playerId', getPlayerController);
playerRouter.post('/market/:playerId', addPlayerToMarketController);
playerRouter.delete('/market/:playerId', removePlayerFromMarketController);
playerRouter.put('/position', updatePlayerPositionNameController);

export default playerRouter;
