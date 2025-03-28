import { Player } from "./player.type";

export type MyTeam = {
  id: number;
  formation: string;
  userId: string;
  headline: [];
  players: Player[];
  teamValue: number
};

export type Team = {
  badgeColor: string;
  badgeGray: string;
  badgeWhite: string;
  dspId: number;
  fantasyTeamId: string;
  id: number;
  name: string;
  shortName: string;
  slug: string;
  store: string;
}