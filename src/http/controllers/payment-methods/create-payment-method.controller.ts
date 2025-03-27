import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { paymentMethodSchema } from '@/repositories/@interfaces/payment-methods.interface';
import { makeWithPrismaCreatePaymentMethodService } from '@/services/payment-methods/create-payment-method.service';

export const createNewPaymentMethod = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/create-payment-method',
    {
      schema: {
        tags: ['payment-methods'],
        summary: 'Create new payment method',
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
      const { user, body } = request;
      const { description } = body;

      const createPaymentMethod = makeWithPrismaCreatePaymentMethodService();

      const { paymentMethod } = await createPaymentMethod.execute({
        userId: user.sub,
        description,
      });

      reply.status(200).send({ content: paymentMethod });
    }
  );
};
