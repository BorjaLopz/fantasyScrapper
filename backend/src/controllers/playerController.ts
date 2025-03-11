import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import https from 'node:https';

export const getListPlayers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let data: any = [];
    const request = https
      .get(
        'https://api-fantasy.llt-services.com/api/v4/players?x-lang=es',
        (res) => {
          const headerDate =
            res.headers && res.headers.date
              ? res.headers.date
              : 'no response date';
          console.log('Status Code:', res.statusCode);
          console.log('Date in Response header:', headerDate);

          res.on('data', (chunk) => {
            data.push(chunk);
          });

          res.on('end', () => {
            console.log(
              'Response ended: ',
              JSON.parse(Buffer.concat(data).toString()),
            );
          });
        },
      )
      .on('error', (err) => {
        console.log('Error: ', err.message);
      });

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Player list retrieved successfully.',
      data: data,
    });
  } catch (err) {
    return next(err);
  }
};
