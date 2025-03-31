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
          page: z.string().default('1').transform(Number),
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

      const listPaymentMethods = makeWithPrismaListPaymentMethodsService();

      const { paymentMethods } = await listPaymentMethods.execute({
        userId: user.sub,
        page,
        description,
      });

      reply.status(200).send({
        content: paymentMethods.data,
        pagination: paymentMethods.pagination,
      });
    }
  );
};
