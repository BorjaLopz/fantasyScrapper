import { Team } from "./team.type";

export type Player = {
  id: number;
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
  positionName: string
};
