import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { paginationSchema } from '@/repositories/@interfaces/commons.interface';

export const listOfTransactions = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/list-transactions',
    {
      schema: {
        tags: ['transactions'],
        summary: 'List of transactions by user',
        querystring: z.object({
          page: z.string().default('1').transform(Number),
          description: z.string().optional(),
        }),
        response: {
          200: z.object({
            content: z.any(),
            pagination: paginationSchema,
          }),
        },
      },
    },
    async () => {
      // const { user, query } = request;
      // const { page, description } = query;
      // reply.status(200).send({
      // content: [],
      // pagination: {},
      // });
    }
  );
};
