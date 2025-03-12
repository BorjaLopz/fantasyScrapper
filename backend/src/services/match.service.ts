import { countMatchesRepository, findMatchesRepository } from '@/repositories/match.repository';
import { TMatchQueryFilters } from '@/types/match.type';

export const getMatchesService = async (filters: TMatchQueryFilters) => {
  const totalCount = await countMatchesRepository(filters);

  const matchesData = await findMatchesRepository(filters);
  return { matches: matchesData, total: totalCount || 0 };
};
