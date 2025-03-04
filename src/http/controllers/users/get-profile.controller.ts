import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

// import { userSchema } from '@/repositories/@interfaces/users.interface';

export const getUserProfile = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/get-user-profile',
    {
      schema: {
        tags: ['user'],
        summary: 'Get a user account profile',
        response: {
          200: z.object({
            content: z.object({}),
            // content: userSchema,
          }),
        },
      },
    },
    async (request, reply) => {
      // const { name, email, password } = request.body;

      // Connect this with service factorie to get user account profile in Database;

      // After get this data successfully, send to user the information;

      reply.status(201).send({ content: {} });
    }
  );
};
