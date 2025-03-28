import prisma from '@/config/prisma';
import { TTeamQueryFilters } from '@/types/team.type';
import { Player } from '@prisma/client';

export const findTeams = async ({ range, filter }: TTeamQueryFilters) => {
  const { start = 0, end = 10 } = range || {};

  const skip = Number(start) || 0;
  const skipEnd = Number(end) || 0;
  const take = skipEnd - skip;

  return await prisma.team.findMany({
    include: {
      players: true,
    },
    where: filter ? { name: filter.name } : undefined,
    orderBy: { name: 'desc' },
    skip,
    take,
  });
};

export const countTeams = async ({ filter }: TTeamQueryFilters) => {
  return await prisma.team.count({
    where: filter ? { name: filter.name } : undefined,
  });
};

export const findTeamById = async (id: string) => {
  return await prisma.team.findUnique({
    include: {
      players: true,
    },
    where: {
      fantasyTeamId: id,
    },
  });
};

export const findTeamByUserId = async (userId: string) => {
  let teamValue = 0;
  const players = await prisma.userTeam.findFirst({
    include: {
      players: {
        include: {
          stats: false,
          team: true,
        },
        orderBy: {
          // positionId: 'asc',
          positionNameIndex: 'asc',
        },
      },
    },
    where: { userId: userId },
  });

  players?.players.forEach(
    (player) => (teamValue += player.marketValue.toNumber()),
  );

  return { ...players, teamValue: teamValue };
};

export const updateTeamFormation = async (
  teamId: string,
  formation: string,
) => {
  return prisma.userTeam.update({
    data: {
      formation: formation,
    },
    where: { id: teamId },
  });
};
