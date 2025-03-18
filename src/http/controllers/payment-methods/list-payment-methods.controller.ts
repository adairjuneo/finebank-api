import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { paginationSchema } from '@/repositories/@interfaces/commons.interface';
import { paymentMethodSchema } from '@/repositories/@interfaces/payment-methods.interface';
import { makeWithPrismaListPaymentMethodsService } from '@/services/payment-methods/list-payment-methods.service';

export const listOfPaymentMethods = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/list-payment-methods',
    {
      schema: {
        tags: ['payment-methods'],
        summary: 'List of payment methods by user',
        querystring: z.object({
          page: z.string().default('1'),
          description: z.string().optional(),
        }),
        response: {
          200: z.object({
            content: z.array(paymentMethodSchema),
            pagination: paginationSchema,
          }),
        },
      },
    },
    async (request, reply) => {
      const { user, query } = request;
      const { page, description } = query;

      const pageNumber = Number.parseInt(page);

      const listPaymentMethods = makeWithPrismaListPaymentMethodsService();

      const { paymentMethods } = await listPaymentMethods.execute({
        page: pageNumber,
        userId: user.sub,
        description: description,
      });

      reply.status(200).send({
        content: paymentMethods.data,
        pagination: paymentMethods.pagination,
      });
    }
  );
};
