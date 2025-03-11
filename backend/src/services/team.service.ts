import { countTeams, findTeamById, findTeams } from '@/repositories/team.repository';
import { TTeamQueryFilters } from '@/types/team.type';

export const getTeamsService = async (filters: TTeamQueryFilters) => {
  const totalCount = await countTeams(filters);
  const usersData = await findTeams(filters);

  return { users: usersData, total: totalCount || 0 };
};

export const getTeamByIdService = async (id: string) => {
  return await findTeamById(id);
};
