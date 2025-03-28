import { API_URL } from "@/constants/api";
import { ApiResponse } from "@/types/api-response.type";
import { Player } from "@/types/player.type";
import axios from "axios";

export const getMarketPlayers = async () => {
  const response = await axios.get<
    ApiResponse<{ id: number; players: Player[] }>
  >(`${API_URL}/market`);

  return response.data;
};
