import prisma from '@/config/prisma';
import {
  countTeams,
  findTeamById,
  findTeamByUserId,
  findTeams,
} from '@/repositories/team.repository';
import { findUserById } from '@/repositories/user.repository';
import { TTeamQueryFilters } from '@/types/team.type';
import { randomSelection } from '@/utils/array.utils';
import { Player, Prisma } from '@prisma/client';

export const getTeamsService = async (filters: TTeamQueryFilters) => {
  const totalCount = await countTeams(filters);
  const usersData = await findTeams(filters);

  return { users: usersData, total: totalCount || 0 };
};

export const getTeamByIdService = async (id: string) => {
  return await findTeamById(id);
};

export const getTeamByUserIdService = async (userId: string) => {
  return await findTeamByUserId(userId);
};

export const createUserTeamByUserIdService = async (userId: string) => {
  let user = await findUserById(userId);
  if (!(await findTeamByUserId(userId))?.id)
    await prisma.userTeam.create({
      data: {
        user: {
          connect: { username: user?.username },
        },
        players: {
          connect: await generateUserTeam(),
        },
      },
    });

  return await findTeamByUserId(userId);
};

const generateUserTeam = async () => {
  const result: Player[] = [];
  // Get 11 players there are NOT in MARKET and NOT in other USERS TEAMS
  const unselectablePlayers: string[] = [];
  const userTeams =
    (await prisma.userTeam.findMany({
      include: { players: { select: { fantasyPlayerId: true } } },
    })) || [];
  userTeams.forEach((ut) => {
    if (ut.players) {
      ut.players.forEach((pl) => unselectablePlayers.push(pl.fantasyPlayerId));
    }
  });

  // TODO: add market here
  const allPlayers = await prisma.player.findMany({
    where: {
      fantasyPlayerId: {
        notIn: unselectablePlayers,
      },
    },
  });

  // Add 1 "portero" position
  const gks = allPlayers.filter((pl) => pl.positionId === 1);
  result.push(gks[Math.floor(Math.random() * gks.length)]);

  const dfs = allPlayers.filter((pl) => pl.positionId === 2);
  result.push(...randomSelection<Player>(5, dfs));

  const mds = allPlayers.filter((pl) => pl.positionId === 3);
  result.push(...randomSelection<Player>(5, mds));

  const sts = allPlayers.filter((pl) => pl.positionId === 4);
  result.push(...randomSelection<Player>(3, sts));

  return result;
};
