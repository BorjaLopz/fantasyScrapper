export type TMatchQueryFilters = {
  range?: {
    start: number;
    end: number;
  };
  sortBy?: {
    column: string;
    order: string;
  };
  filter?: TMatchFilter;
};

export type TMatchFilter = {
  homeTeams?: string;
  awayTeams?: string;
  dates?: Date
};