import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeWithPrismaGetProfileService } from '@/services/users/get-profile.service';

export const getUserProfile = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/get-user-profile',
    {
      schema: {
        tags: ['user'],
        summary: 'Get a user account profile',
        response: {
          200: z.object({
            content: z.object({
              id: z.string(),
              name: z.string(),
              avatarUrl: z.string().nullish(),
              email: z.string().email(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { user } = request;

      const getProfile = makeWithPrismaGetProfileService();

      const { userProfile } = await getProfile.execute({ userId: user.sub });

      reply.status(201).send({
        content: {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          avatarUrl: userProfile.avatarUrl,
          createdAt: userProfile.createdAt,
          updatedAt: userProfile.updatedAt,
        },
      });
    }
  );
};
