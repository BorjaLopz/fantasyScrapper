import { API_URL } from "@/constants/api";
import { ApiResponse } from "@/types/api-response.type";
import { Player } from "@/types/player.type";
import { MyTeam } from "@/types/team.type";
import axios from "axios";

export const getTeamByUserId = async (userId: string) => {
  const response = await axios.get<ApiResponse<MyTeam>>(
    `${API_URL}/teams/user/${userId}`
  );

  return response.data;
};

export const createTeamByUserId = async (userId: string) => {
  const response = await axios.post<ApiResponse<void>>(
    `${API_URL}/teams/user/${userId}`
  );

  return response.data;
};

export const updatePlayersPosisitionName = async (players: Player[]) => {
  const response = await axios.put<ApiResponse<void>>(
    `${API_URL}/players/positionName`,
    players
  );

  return response.data;
};
