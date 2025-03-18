import { z } from 'zod';

const paginationSchema = z.object({
  pageIndex: z.number(),
  totalPages: z.number(),
  totalCount: z.number(),
  hasNextPage: z.boolean(),
});

type PaginationDTO = z.infer<typeof paginationSchema>;

export { paginationSchema };
export type { PaginationDTO };
