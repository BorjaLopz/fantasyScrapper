import { countPlayers, findPlayerById, findPlayers } from '@/repositories/player.repository';
import { TPlayerQueryFilters } from '@/types/player.type';

export const getPlayersService = async (filters: TPlayerQueryFilters) => {
  const totalCount = await countPlayers(filters);
  const usersData = await findPlayers(filters);

  return { users: usersData, total: totalCount || 0 };
};

export const getPlayerByIdService = async (id: string) => {
  console.log("llego service")
  return await findPlayerById(id);
};
