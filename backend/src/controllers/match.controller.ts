import {
  getAllMatchdaysService,
  getCurrentMatchdayService,
  getCurrentMatchesForMatchDayService,
  getMatchesService,
} from '@/services/match.service';
import { TMatchQueryFilters } from '@/types/match.type';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getListMatchesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queryFilters = req.query as TMatchQueryFilters;

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Match list retrieved successfully.',
      data: await getMatchesService(queryFilters),
    });
  } catch (err) {
    return next(err);
  }
};

export const getCurrentMatchdayController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Current matchday retrieved successfully.',
      data: await getCurrentMatchdayService(),
    });
  } catch (err) {
    return next(err);
  }
};

export const getAllMatchdaysController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'All matchdays retrieved successfully.',
      data: await getAllMatchdaysService(),
    });
  } catch (err) {
    return next(err);
  }
};

export const getCurrentMatchesForMatchdayController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { matchDay } = req.params;

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Current matches retrieved successfully.',
      data: await getCurrentMatchesForMatchDayService(matchDay),
    });
  } catch (err) {
    return next(err);
  }
};
