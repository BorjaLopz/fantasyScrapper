import { Team } from "./team.type";
import { User } from "./user.type";

export type Player = {
  id: string;
  fantasyPlayerId: string;
  name: string;
  nickname: string;
  image: string;
  points: string;
  weekPoints: string;
  averagePoints: string;
  lastSeasonPoints: string;
  slug: string;
  positionId: number;
  position: string;
  marketValue: string;
  playerStatus: string;
  teamId: number;
  team: Team;
  userTeamId: number;
  headlineId: number;
  positionName: string;
  positionNameIndex: number;
  userTeam: {
    user: User
  },
  marketBids: {
    id: string,
    bid: number,
    playerId: string,
    userId: string
  }[]
  market: {
    id: string
  }
};
