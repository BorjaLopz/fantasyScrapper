import prisma from '@/config/prisma';
import { TPlayerQueryFilters } from '@/types/player.type';

export const findPlayers = async ({ range, filter }: TPlayerQueryFilters) => {
  const { start = 0, end = 10 } = range || {};

  const skip = Number(start) || 0;
  const skipEnd = Number(end) || 0;
  const take = skipEnd - skip;

  return await prisma.player.findMany({
    include: {
      stats: true,
      team: true,
    },
    where: filter ? { name: filter.name } : undefined,
    orderBy: { name: 'desc' },
    skip,
    take,
  });
};

export const countPlayers = async ({ filter }: TPlayerQueryFilters) => {
  return await prisma.player.count({
    where: filter ? { name: filter.name } : undefined,
  });
};

export const findPlayerById = async (id: string) => {
  console.log('id_repository', id);
  return await prisma.player.findUnique({
    include: {
      stats: true,
      team: true,
    },
    where: {
      fantasyPlayerId: id,
    },
  });
};

export const updatePlayerPositionNameByIdRepository = async (
  id: number,
  positionName: string,
  positionNameIndex: number,
) => {
  await prisma.player.update({
    data: {
      positionName: positionName,
      positionNameIndex: positionNameIndex,
    },
    where: { id: id },
  });
};
