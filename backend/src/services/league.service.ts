import prisma from '@/config/prisma';
import { Player, User } from '@prisma/client';

export const getLeagueService = async () => {
  const userTeams = await prisma.userTeam.findMany({
    select: {
      user: true,
      players: true,
    }
  })

  const result: {
    user: User;
    players: Player[];
    points: number;
    value: number;
  }[] = []
  userTeams.forEach(ut => {
    const entity: {
      user: User;
      players: Player[];
      points: number
      value: number
    } = { ...ut, points: 0, value: 0 }
    ut.players.forEach(pl => {
      entity.points += pl.weekPoints.toNumber()
      entity.value += pl.marketValue.toNumber()
    })

    result.push(entity)
  })

  return result
};
