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

export const getMarketBid = async (userId: string, playerId: string) => {
  const response = await axios.get<
    ApiResponse<{
      bid: number,
      id: string,
      playerId: string,
      userId: string
    }>
  >(`${API_URL}/market/bid/${userId}/${playerId}`);

  return response.data;
};

export const setMarketBid = async (userId: string, playerId: string, bid: number) => {
  const response = await axios.post<
    ApiResponse<any>
  >(`${API_URL}/market`, {
    userId, playerId, bid
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  return response.data;
};

// /toMarket/:playerId/:userId
export const addPlayerToMarket = async (playerId: string, userId: string) => {
  const response = await axios.post<
    ApiResponse<any>
  >(`${API_URL}/players/toMarket/${playerId}/${userId}`, {
    userId, playerId
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  return response.data;
};