import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const refreshToken = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/refresh-token',
    {
      schema: {
        tags: ['auth'],
        summary: 'Refresh token to create a new session for user',
        response: {
          200: z.object({
            content: z.object({
              token: z.string(),
            }),
          }),
        },
      },
    },
    async (__, reply) => {
      const newTokenJwt = await reply.jwtSign(
        {},
        { sign: { sub: 'user-id-test' } }
      );

      const newRefreshTokenJwt = await reply.jwtSign(
        {},
        { sign: { sub: 'user-id-test', expiresIn: '3d' } }
      );

      // After authenticate user with successfully, redirect the user to Dashboard page in web app;

      reply
        .setCookie('refreshToken', newRefreshTokenJwt, {
          path: '/',
          secure: true,
          httpOnly: true,
          sameSite: true,
        })
        .code(200)
        .send({ content: { token: newTokenJwt } });
    }
  );
};
