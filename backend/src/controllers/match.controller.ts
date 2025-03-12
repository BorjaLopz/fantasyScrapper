import { getMatchesService } from '@/services/match.service';
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
