import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { paymentMethodSchema } from '@/repositories/@interfaces/payment-methods.interface';
import { makeWithPrismaUpdatePaymentMethodService } from '@/services/payment-methods/update-payment-method.service';

export const updatePaymentMethod = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/update-payment-method/:id',
    {
      schema: {
        tags: ['payment-methods'],
        summary: 'Update a existent payment method by id',
        params: z.object({
          id: z
            .string({ message: 'Required.' })
            .describe('id of payment method to be updated.'),
        }),
        body: z.object({
          description: z
            .string({ message: 'Required' })
            .min(6, { message: 'Min 6 characters' }),
        }),
        response: {
          200: z.object({
            content: paymentMethodSchema,
          }),
        },
      },
    },
    async (request, reply) => {
      const { user, body, params } = request;
      const { id } = params;
      const { description } = body;

      const updatePaymentMethod = makeWithPrismaUpdatePaymentMethodService();

      const { paymentMethod } = await updatePaymentMethod.execute({
        description,
        userId: user.sub,
        paymentMethodId: id,
      });

      reply.status(200).send({ content: paymentMethod });
    }
  );
};
