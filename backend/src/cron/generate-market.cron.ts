import { logger } from '@/config/pino';
import prisma from '@/config/prisma';
import { randomSelection } from '@/utils/array.utils';
import { Player } from '@prisma/client';
import { schedule } from 'node-cron';

export const generateMarketData = () => {
  logger.info('Generating market');
  // Generate market data
  generateMarket();
  // Register scheduler
  schedule('0 0 * * *', () => generateMarket());
};

const generateMarket = async () => {
  const result: Player[] = [];
  const allPlayers = await prisma.player.findMany({
    where: {
      userTeam: null,
      playerStatus: { not: 'out_of_league' },
    },
    include: {
      team: true,
    },
  });

  const gks = allPlayers.filter((pl) => pl.positionId === 1);
  result.push(...randomSelection<Player>(2, gks));

  const dfs = allPlayers.filter((pl) => pl.positionId === 2);
  result.push(...randomSelection<Player>(3, dfs));

  const mds = allPlayers.filter((pl) => pl.positionId === 3);
  result.push(...randomSelection<Player>(3, mds));

  const sts = allPlayers.filter((pl) => pl.positionId === 4);
  result.push(...randomSelection<Player>(3, sts));

  await prisma.market.deleteMany();
  await prisma.market.create({
    data: {
      players: {
        connect: [...result],
      },
    },
  });
  // for await (const player of result) {
  // await prisma.market.create({
  //   data: {
  //     players: {
  //       connect: { id: player.id },
  //     },
  //   },
  // });
  // await prisma.player.
  // }
  logger.info('Market generated');
};
