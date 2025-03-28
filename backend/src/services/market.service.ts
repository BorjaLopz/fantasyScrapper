import { getMarketPlayersRepository } from '@/repositories/market.repository';

export const getMarketPlayersService = async () => {
  return await getMarketPlayersRepository();
};
