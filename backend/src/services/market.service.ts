import prisma from '@/config/prisma';
import { getMarketPlayersRepository } from '@/repositories/market.repository';
import { findPlayerById } from '@/repositories/player.repository';
import { findUserById } from '@/repositories/user.repository';

export const getMarketPlayersService = async () => {
  return await getMarketPlayersRepository();
};

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
