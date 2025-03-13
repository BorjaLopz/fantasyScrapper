import {
  countMatchesRepository,
  findMatchesRepository,
  getAllMatchdaysRepository,
  getCurrentMatchdayRepository,
  getCurrentMatchesForMatchDayRepository,
} from '@/repositories/match.repository';
import { TMatchQueryFilters } from '@/types/match.type';

export const getMatchesService = async (filters: TMatchQueryFilters) => {
  const totalCount = await countMatchesRepository(filters);

  const matchesData = await findMatchesRepository(filters);
  return { matches: matchesData, total: totalCount || 0 };
};

export const getCurrentMatchdayService = async () => {
  return await getCurrentMatchdayRepository();
};

export const getAllMatchdaysService = async () => {
  return await getAllMatchdaysRepository();
};

export const getCurrentMatchesForMatchDayService = async (matchDay: string) => {
  return await getCurrentMatchesForMatchDayRepository(
    matchDay && matchDay !== '' ? Number(matchDay) : null,
  );
};
