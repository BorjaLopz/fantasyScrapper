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
  const data = await findTeamByUserId(userId);
  if (
    data.players === undefined ||
    data.players === null ||
    data.players.length === 0
  ) {
    await createUserTeamByUserIdService(userId);
  }

  return data;
};

export const createUserTeamByUserIdService = async (userId: string) => {
  let user = await findUserById(userId);
  if (!(await findTeamByUserId(userId))?.id) {
    const players = await generateUserTeam();
    await prisma.userTeam.create({
      data: {
        user: {
          connect: { username: user?.username },
        },
        players: {
          connect: players,
        },
      },
    });

    const gk = players.find((player) => player.positionId === 1)!;
    await prisma.player.update({
      data: {
        positionName: 'GK',
        positionNameIndex: 1,
      },
      where: { id: gk.id },
    });

    const df = players.filter((player) => player.positionId === 2);
    await prisma.player.update({
      data: {
        positionName: 'CB',
        positionNameIndex: 2,
      },
      where: { id: df[0].id },
    });
    await prisma.player.update({
      data: {
        positionName: 'CB',
        positionNameIndex: 3,
      },
      where: { id: df[1].id },
    });
    await prisma.player.update({
      data: {
        positionName: 'RB',
        positionNameIndex: 4,
      },
      where: { id: df[2].id },
    });
    await prisma.player.update({
      data: {
        positionName: 'LB',
        positionNameIndex: 5,
      },
      where: { id: df[3].id },
    });

    const md = players.filter((player) => player.positionId === 3);
    await prisma.player.update({
      data: {
        positionName: 'CM',
        positionNameIndex: 6,
      },
      where: { id: md[0].id },
    });
    await prisma.player.update({
      data: {
        positionName: 'CM',
        positionNameIndex: 7,
      },
      where: { id: md[1].id },
    });
    await prisma.player.update({
      data: {
        positionName: 'CM',
        positionNameIndex: 8,
      },
      where: { id: md[2].id },
    });

    const st = players.filter((player) => player.positionId === 4);
    await prisma.player.update({
      data: {
        positionName: 'RW',
        positionNameIndex: 9,
      },
      where: { id: st[0].id },
    });
    await prisma.player.update({
      data: {
        positionName: 'LW',
        positionNameIndex: 10,
      },
      where: { id: st[1].id },
    });
    await prisma.player.update({
      data: {
        positionName: 'ST',
        positionNameIndex: 11,
      },
      where: { id: st[2].id },
    });
  }

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

  // TODO: add market to exclude here
  const allPlayers = await prisma.player.findMany({
    where: {
      playerStatus: { not: 'out_of_league' },
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
