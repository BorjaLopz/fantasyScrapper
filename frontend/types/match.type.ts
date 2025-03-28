export type Match = {
  id: number;
  gameWeek: number;
  date: Date;
  startTime: string;
  homeTeam: string;
  score: string;
  awayTeam: string;
  notes: string;
};

export type Matchday = {
  gameWeek: number;
};
