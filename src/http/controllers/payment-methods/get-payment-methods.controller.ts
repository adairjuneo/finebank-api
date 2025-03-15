import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const getPaymentMethods = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/get-payment-methods',
    {
      schema: {
        tags: ['payment-methods'],
        summary: 'Get a list of payment methods',
        querystring: z.object({
          description: z.string().optional(),
          page: z.string().default('1'),
        }),
        response: {
          200: z.object({
            content: z.any(),
            pagination: z.any(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { query } = request;
      const { page } = query;

      const pageNumber = Number.parseInt(page);

      reply.status(200).send({
        content: [],
        pagination: {
          pageIndex: pageNumber,
          totalPages: 0,
          hasNextPage: 0,
        },
      });
    }
  );
};
