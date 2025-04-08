import { getMarketBidController, getMarketPlayersController, getOperationsController, setMarketBidController } from '@/controllers/market.controller';
import { Router } from 'express';

const marketRouter = Router();

marketRouter.get('/', getMarketPlayersController);
marketRouter.get('/bid/:userId/:playerId', getMarketBidController);
marketRouter.get('/operations/:userId', getOperationsController);
marketRouter.post('/', setMarketBidController);

export default marketRouter;
