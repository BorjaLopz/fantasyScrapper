import { TPlayerListData } from '@/types/player.type';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getListPlayers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const playersResponse = await fetch('https://api-fantasy.llt-services.com/api/v4/players?x-lang=es');
    const headerDate = playersResponse.headers && playersResponse.headers.get('date') ? playersResponse.headers.get('date') : 'no response date';
    console.log('Status Code:', playersResponse.status);
    console.log('Date in Response header:', headerDate);

    const result: any[] = []
    const players = await playersResponse.json() as TPlayerListData[]
    for await (const pl of players) {
      const playerResponse = await fetch(`https://api-fantasy.llt-services.com/api/v3/player/${pl.id}?x-lang=es`);
      const headerDate = playerResponse.headers && playerResponse.headers.get('date') ? playerResponse.headers.get('date') : 'no response date';
      console.log('Status Code:', playerResponse.status);
      console.log('Date in Response header:', headerDate);

      result.push(await playerResponse.json())
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Player list retrieved successfully.',
      data: result
    });
  } catch (err) {
    console.log(err); //can be console.error
    return next(err);
  }
};
