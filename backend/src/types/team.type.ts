export type TTeamData = {
  id: string,
  name: string,
  shortName: string,
  slug: string,
  dspId: number,
  store: string
  badgeColor: string,
  badgeGray: string,
  badgeWhite: string,
}

export type TTeamQueryFilters = {
  range?: {
    start: number;
    end: number;
  };
  sortBy?: {
    column: string;
    order: string;
  };
  filter?: TTeamFilter;
};

export type TTeamFilter = {
  name?: string;
};