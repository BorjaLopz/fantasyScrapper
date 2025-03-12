import { z } from 'zod';

const getQueryParamsSchema = () => {
  const rangeSchema = z.object(
    {
      start: z.string({ required_error: 'Range start is required' }),
      end: z.string({ required_error: 'Range end is required' }),
    },
    { required_error: 'Range is required' },
  );

  const sortBySchema = z.object({
    column: z.string({ required_error: 'SortBy column is required' }),
    order: z.string({ required_error: 'SortBy order is required' }),
  });

  const filterSchema = z.object({
    homeTeams: z.string({ required_error: 'Filter roles is required' }).optional(),
    awayTeams: z.string({ required_error: 'Filter genders is required' }).optional(),
    dates: z.string({ required_error: 'Filter keywords is required' }).optional(),
  });

  const queryParamsSchema = z.object({
    range: rangeSchema,
    sortBy: sortBySchema.optional(),
    filter: filterSchema.partial().optional(),
  });

  return queryParamsSchema;
};

export const getListMatchesSchema = z.object({
  query: getQueryParamsSchema(),
});
