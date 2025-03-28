import prisma from '@/config/prisma';

export const getMarketPlayersRepository = async () => {
  return await prisma.market.findFirst({
    include: {
      players: {
        include: {
          team: true,
          userTeam: {
            select: {
              user: true
            }
          }
        },
      },
    },
  });
};

export const addMarketBidRepository = async (userId: string, playerId: string) => {
};