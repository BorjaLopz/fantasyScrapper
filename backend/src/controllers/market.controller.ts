import { getMarketBidService, getMarketPlayersService, getOperationsService, setMarketBidService } from '@/services/market.service';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getMarketPlayersController = async (
  _: Request,
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

export const getMarketBidController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, playerId } = req.params;

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Market bid successfully retrieved.',
      data: await getMarketBidService(userId, playerId),
    });
  } catch (err) {
    return next(err);
  }
};

export const getOperationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Operations successfully retrieved.',
      data: await getOperationsService(userId),
    });
  } catch (err) {
    return next(err);
  }
};

export const setMarketBidController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, playerId, bid } = req.body

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Market bid successfully inserted.',
      data: await setMarketBidService(userId, playerId, bid),
    });
  } catch (err) {
    return next(err);
  }
};
