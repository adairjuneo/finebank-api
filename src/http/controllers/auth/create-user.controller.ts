import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { createUserSchema } from '@/repositories/@interfaces/users.interface';
import { makeWithPrismaCreateUserService } from '@/services/auth/create-user.service';

export const createUser = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/create-user',
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
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      // Connect this with service factorie to crete user in Database;

      const createUser = makeWithPrismaCreateUserService();

      const { user } = await createUser.execute({ name, email, password });

      // After create user successfully, redirect the user to login page in web app;

      reply.status(201).send({ content: { id: user.id } });
    }
  );
};
