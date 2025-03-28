import prisma from '@/config/prisma';
import { TMatchFilter, TMatchQueryFilters } from '@/types/match.type';

const buildOrderBy = (column: string, order: string) => {
  const keys = column.split('.');
  let orderBy: Record<string, any> = { [keys.pop()!]: order };

  while (keys.length) {
    orderBy = { [keys.pop()!]: orderBy };
  }

  return orderBy;
};

const filterMatches = (filter: TMatchFilter) => {
  let filters = {};

  const homeTeams = filter?.homeTeams || [];
  const awayTeams = filter?.awayTeams || [];
  const dates = filter?.dates || [];

  if (homeTeams.length) {
    filters = {
      ...filters,
      homeTeam: {
        in: homeTeams,
      },
    };
  }

  if (awayTeams.length) {
    filters = {
      ...filters,
      awayTeam: {
        in: awayTeams,
      },
    };
  }

  if (dates) {
    filters = {
      ...filters,
      date: {
        in: dates,
      },
    };
  }

  return filters;
};

export const findMatchesRepository = async ({
  range,
  sortBy,
  filter,
}: TMatchQueryFilters) => {
  const { start = 0, end = 10 } = range || {};
  const { column = 'updatedAt', order = 'desc' } = sortBy || {};

  const skip = Number(start) || 0;
  const skipEnd = Number(end) || 0;
  const take = skipEnd - skip;
  const orderBy = [];

  if (column && order) {
    const orderByColumn = buildOrderBy(column, order);
    orderBy.push(orderByColumn);
  }

  return await prisma.match.findMany({
    select: {
      id: true,
      gameWeek: true,
      date: true,
      startTime: true,
      homeTeam: true,
      awayTeam: true,
      score: true,
      notes: true,
    },
    where: filter ? filterMatches(filter) : undefined,
    orderBy,
    skip,
    take,
  });
};

export const countMatchesRepository = async ({
  filter,
}: TMatchQueryFilters) => {
  return await prisma.match.count({
    where: filter ? filterMatches(filter) : undefined,
  });
};

export const getCurrentMatchdayRepository = async () => {
  return (
    await prisma.match.findFirst({
      where: {
        AND: [
          {
            score: {
              equals: '',
            },
          },
          {
            date: {
              gte: new Date(),
            },
          },
          {
            notes: {
              equals: '',
            },
          },
        ],
      },
      orderBy: [{ date: 'asc' }],
    })
  )?.gameWeek;
};

export const getAllMatchdaysRepository = async () => {
  return await prisma.match.findMany({
    select: { gameWeek: true },
    distinct: 'gameWeek',
    orderBy: [{ gameWeek: 'asc' }],
  });
};

export const getCurrentMatchesForMatchDayRepository = async (
  matchDay: number | null,
) => {
  return await prisma.match.findMany({
    where: {
      gameWeek: matchDay ? matchDay : await getCurrentMatchdayRepository(),
    },
    orderBy: {
      date: 'asc',
    },
  });
};
