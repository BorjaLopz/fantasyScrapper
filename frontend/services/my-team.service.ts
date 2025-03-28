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

export const updatePlayersPosisition = async (players: Player[]) => {
  const response = await axios.put<ApiResponse<void>>(
    `${API_URL}/players/position`,
    players
  );

  return response.data;
};

export const updateTeamFormation = async (teamId: number, formation: string) => {
  const response = await axios.put<ApiResponse<void>>(
    `${API_URL}/teams/formation/${teamId}`,
    { formation: formation },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};
