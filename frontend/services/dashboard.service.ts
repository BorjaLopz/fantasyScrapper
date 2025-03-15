import { API_URL } from "@/constants/Api";
import { ApiResponse } from "@/types/api-response.type";
import { Match, Matchday } from "@/types/match.type";
import axios from "axios";

export const getAllMatchesForMatchday = async (matchDay: number | null) => {
  const response = await axios.get<ApiResponse<Match[]>>(
    `${API_URL}/matches/matchday/${matchDay}`
  );

  return response.data;
};

export const getCurrentMatchday = async () => {
  const response = await axios.get<ApiResponse<number>>(
    `${API_URL}/matches/currentMatchday`
  );

  return response.data;
};

export const getAllMatchdays = async () => {
  const response = await axios.get<ApiResponse<Matchday[]>>(
    `${API_URL}/matches/matchday`
  );

  return response.data;
};
