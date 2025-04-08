import prisma from '@/config/prisma';
import { getMarketPlayersRepository } from '@/repositories/market.repository';
import { findPlayerById } from '@/repositories/player.repository';
import { findUserById } from '@/repositories/user.repository';
import { groupBy } from 'lodash';

export const getMarketPlayersService = async () => {
  return await getMarketPlayersRepository();
};

export const getOperationsService = async (userId: string) => {
  const userTeam = await prisma.userTeam.findFirst({
    where: { userId: userId }
  })

  // Bids from others
  const playersInTeam = await prisma.player.findMany({
    where: {
      marketId: { not: null },
      AND: {
        userTeamId: userTeam?.id
      }
    }
  })
  const playersInMarket = await prisma.player.findMany({
    where: {
      marketId: { not: null },
      AND: {
        userTeamId: null
      }
    }
  })

  const bids = await prisma.marketBids.findMany({
    select: {
      bid: true,
      player: {
        include: {
          market: true
        }
      },
      user: true
    },
    where: {
      playerId: {
        in: [...playersInMarket, ...playersInTeam].map(pl => pl.id)
      },
    }
  })

  const grouped = groupBy(bids, bid => bid.player.nickname);
  const groupedArray = Object.keys(grouped).map(key => ({ player: grouped[key][0].player, bids: grouped[key] }))

  return groupedArray
}

export const setMarketBidService = async (userId: string, playerId: string, bid: number) => {
  const user = await findUserById(userId);
  if (!user) return

  const player = await findPlayerById(playerId)
  if (!player) return

  if (bid > user.bank!.quantity.toNumber()) return

  const marketBid = await prisma.marketBids.upsert({
    create: {
      bid: bid,
      playerId: player.id,
      userId: user.id
    },
    update: {
      bid: bid
    },
    where: {
      playerId: player.id,
      userId: user.id
    }
  });

  const userBank = await prisma.userBank.update({
    data: {
      quantity: user.bank!.quantity.toNumber() - bid
    },
    where: {
      userId: user.id
    }
  })

  return { bid: marketBid, userBank: userBank }
};

export const getMarketBidService = async (userId: string, playerId: string) => {
  return await prisma.marketBids.findFirst({
    where: {
      userId: userId,
      playerId: playerId
    },
    orderBy: {
      bid: 'asc'
    }
  })
}