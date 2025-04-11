import { getLeagueService } from '@/services/league.service';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getLeagueController = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'League retrieved successfully.',
      data: await getLeagueService(),
    });
  } catch (err) {
    return next(err);
  }
};