import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { createUserSchema } from '@/repositories/@interfaces/users.interface';
import { makeWithPrismaCreateAccountService } from '@/services/auth/create-account.service';

export const createAccount = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/create-account',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new account',
        body: createUserSchema,
        response: {
          200: z.object({
            content: z.object({
              id: z.string(),
            }),
          }),
          400: z.object({
            message: z.string(),
            errors: z.record(z.string(), z.array(z.string())).nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const createUser = makeWithPrismaCreateAccountService();

      const { user } = await createUser.execute({ name, email, password });

      reply.status(201).send({ content: { id: user.id } });
    }
  );
};
