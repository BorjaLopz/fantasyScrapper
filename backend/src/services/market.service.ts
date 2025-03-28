import prisma from '@/config/prisma';
import {
  countTeams,
  findTeamById,
  findTeamByUserId,
  findTeams,
  updateTeamFormation,
} from '@/repositories/team.repository';
import { findUserById } from '@/repositories/user.repository';
import { TTeamQueryFilters } from '@/types/team.type';
import { randomSelection } from '@/utils/array.utils';
import { Player } from '@prisma/client';

export const getDailyMarketService = async () => {
  // get all players excluding user team players
  const allPlayers = await prisma.player.findMany({
    where: {
      userTeam: null,
    },
  });

  // const gks = allPlayers.filter((pl) => pl.positionId === 1);
  // result.push(gks[Math.floor(Math.random() * gks.length)]);

  // const dfs = allPlayers.filter((pl) => pl.positionId === 2);
  // result.push(...randomSelection<Player>(5, dfs));

  // const mds = allPlayers.filter((pl) => pl.positionId === 3);
  // result.push(...randomSelection<Player>(5, mds));

  // const sts = allPlayers.filter((pl) => pl.positionId === 4);
  // result.push(...randomSelection<Player>(3, sts));
};
