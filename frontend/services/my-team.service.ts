import { API_URL } from "@/constants/api";
import { ApiResponse } from "@/types/api-response.type";
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
