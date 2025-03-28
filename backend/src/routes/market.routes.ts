import { getMarketPlaeyrsController } from '@/controllers/market.controller';
import { Router } from 'express';

const marketRouter = Router();

marketRouter.get('/', getMarketPlaeyrsController);

export default marketRouter;
