import {
  countPlayers,
  findPlayerById,
  findPlayers,
  updatePlayerPositionNameByIdRepository,
} from '@/repositories/player.repository';
import { TPlayerQueryFilters } from '@/types/player.type';

export const getPlayersService = async (filters: TPlayerQueryFilters) => {
  const totalCount = await countPlayers(filters);
  const usersData = await findPlayers(filters);

  return { users: usersData, total: totalCount || 0 };
};

export const getPlayerByIdService = async (id: string) => {
  return await findPlayerById(id);
};

export const updatePlayersPositionService = async (
  players: {
    id: string;
    positionName: string;
    positionNameIndex: number;
  }[],
) => {
  for await (const player of players) {
    await updatePlayerPositionNameByIdRepository(
      player.id,
      player.positionName,
      player.positionNameIndex,
    );
  }
};
