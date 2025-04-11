import { logger } from '@/config/pino';
import prisma from '@/config/prisma';
import { randomSelection } from '@/utils/array.utils';
import { Player } from '@prisma/client';
import { schedule } from 'node-cron';
import { groupBy } from 'lodash';

export const generateMarketData = () => {
  logger.info('Generating market');
  // Generate market data
  generateMarket();
  // Register scheduler
  schedule('0 0 * * *', () => generateMarket());
};

const generateMarket = async () => {
  const result: Player[] = [];
  try {
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

    // sell players to biggest bid
    const bids = await prisma.marketBids.findMany({
      select: {
        bid: true,
        player: true,
        user: {
          include: {
            bank: true
          }
        }
      }
    })

    const grouped = groupBy(bids, employee => employee.player.nickname);
    const groupedArray = Object.keys(grouped).map(key => ({ key, value: grouped[key] }))

    groupedArray.forEach(async data => {
      const max = data.value.reduce((prev, current) => (prev && prev.bid > current.bid) ? prev : current)
      const userTeam = await prisma.userTeam.findFirst({
        select: {
          id: true
        },
        where: { userId: max.user.id }
      })

      await prisma.player.update({
        data: {
          userTeamId: userTeam?.id || '',
          marketId: null
        },
        where: {
          id: max.player.id
        }
      })

      await prisma.userBank.update({
        data: {
          quantity: (max.user.bank!.quantity.toNumber() - max.bid.toNumber())
        },
        where: {
          userId: max.user.id
        }
      })
    })
  } catch (error) {
    await generateMarket()
  }

  logger.info('Market generated');
};
