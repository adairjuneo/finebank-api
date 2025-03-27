import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeWithPrismaDeletePaymentService } from '@/services/payment-methods/delete-payment-method.service';

export const deletePaymentMethod = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/delete-payment-method/:id',
    {
      schema: {
        tags: ['payment-methods'],
        summary: 'Delete payment method',
        params: z.object({
          id: z
            .string({ message: 'Required.' })
            .describe('id of payment method to need delete.'),
        }),
        response: {
          200: z.object({
            content: z.object({
              id: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { user, params } = request;
      const { id } = params;

      const deletePaymentMethod = makeWithPrismaDeletePaymentService();

      const { paymentMethodId } = await deletePaymentMethod.execute({
        userId: user.sub,
        paymentMethodId: id,
      });

      reply.status(200).send({ content: { id: paymentMethodId } });
    }
  );
};
