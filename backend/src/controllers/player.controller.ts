import { getPlayerById, getPlayers } from '@/services/player.service';
import { TPlayerQueryFilters } from '@/types/player.type';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getListPlayers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queryFilters = req.query as TPlayerQueryFilters;
    const userList = await getPlayers(queryFilters);

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Player list retrieved successfully.',
      data: userList,
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
    const player = await getPlayerById(playerId);

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Player retrieved successfully.',
      data: player,
    });
  } catch (err) {
    console.log("err", err)
    return next(err);
  }
};
