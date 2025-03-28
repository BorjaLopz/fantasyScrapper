import { getMarketPlayersController, setMarketBidController } from '@/controllers/market.controller';
import { Router } from 'express';

const marketRouter = Router();

marketRouter.get('/', getMarketPlayersController);
marketRouter.post('/', setMarketBidController);

export default marketRouter;
