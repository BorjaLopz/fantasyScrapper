import { getTeamByIdService, getTeamsService } from '@/services/team.service';
import { TTeamQueryFilters } from '@/types/team.type';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getListTeamController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queryFilters = req.query as TTeamQueryFilters;

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Team list retrieved successfully.',
      data: await getTeamsService(queryFilters),
    });
  } catch (err) {
    return next(err);
  }
};

export const getTeamController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teamId = req.params.playerId;

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Team retrieved successfully.',
      data: await getTeamByIdService(teamId),
    });
  } catch (err) {
    return next(err);
  }
};
