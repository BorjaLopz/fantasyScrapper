import {
  createUserTeamByUserIdService,
  getTeamByIdService,
  getTeamByUserIdService,
  getTeamsService,
  updateTeamFormationService,
} from '@/services/team.service';
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

export const getTeamByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId;

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Team retrieved successfully.',
      data: await getTeamByUserIdService(userId),
    });
  } catch (err) {
    return next(err);
  }
};

export const createTeamByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId;

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Team created successfully.',
      data: await createUserTeamByUserIdService(userId),
    });
  } catch (err) {
    return next(err);
  }
};

export const updateTeamFormationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const teamId = req.params.teamId;
    const formation = req.body.formation;

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Team updated successfully.',
      data: await updateTeamFormationService(Number(teamId), formation),
    });
  } catch (err) {
    return next(err);
  }
};
