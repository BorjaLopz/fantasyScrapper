import { Player } from "./player.type";

export type MyTeam = {
  id: number;
  formation: string;
  userId: string;
  headline: [];
  players: Player[];
};
