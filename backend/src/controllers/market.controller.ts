import { getMarketPlayersService } from '@/services/market.service';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getMarketPlaeyrsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Market list retrieved successfully.',
      data: await getMarketPlayersService(),
    });
  } catch (err) {
    return next(err);
  }
};
