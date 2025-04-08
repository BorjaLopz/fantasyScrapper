import { logger } from '@/config/pino';
import prisma from '@/config/prisma';
import { Player } from '@prisma/client';
import { schedule } from 'node-cron';

export const generateMarketBids = () => {
  logger.info('Generating market bids');
  // Generate market data
  generateBids();
  // Register scheduler
  schedule('0 0 * * *', () => generateBids());
};

const generateBids = async () => {
  try {
    const laLigaUser = await prisma.user.findFirst({
      where: {
        username: 'laliga'
      }
    })
    const playersWithUser = await prisma.player.findMany({
      select: {
        id: true,
        userTeam: true,
        marketValue: true
      },
      where: {
        userTeamId: { not: null },
        AND: {
          marketId: { not: null },
        },
      }
    })

    playersWithUser.forEach(async pl => {
      const isPresent = await prisma.marketBids.findFirst({
        where: {
          playerId: pl.id
        }
      })

      if (!isPresent?.id) {
        await prisma.marketBids.create({
          data: {
            bid: ((35 / 100) * pl.marketValue.toNumber()).toFixed(2),
            playerId: pl.id,
            userId: laLigaUser?.id || ""
          }
        })
      }
    })
  } catch (error) {
    await generateBids()
  }

  logger.info('Bids generated');
};
