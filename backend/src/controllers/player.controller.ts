import { getPlayerByIdService, getPlayersService } from '@/services/player.service';
import { TPlayerQueryFilters } from '@/types/player.type';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getListPlayersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queryFilters = req.query as TPlayerQueryFilters;

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Player list retrieved successfully.',
      data: await getPlayersService(queryFilters),
    });
  } catch (err) {
    return next(err);
  }
};

export const getPlayerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const playerId = req.params.playerId;

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Player retrieved successfully.',
      data: await getPlayerByIdService(playerId),
    });
  } catch (err) {
    console.log("err", err)
    return next(err);
  }
};
