import { API_URL } from "@/constants/api";
import { ApiResponse } from "@/types/api-response.type";
import { Player } from "@/types/player.type";
import { User } from "@/types/user.type";
import axios from "axios";

export const getLeague = async () => {
  const response = await axios.get<
    ApiResponse<{
      user: User;
      players: Player[];
      points: number;
      value: number
    }[]>
  >(`${API_URL}/league`);

  return response.data;
};
