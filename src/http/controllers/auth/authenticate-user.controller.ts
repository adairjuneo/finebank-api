import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeWithPrismaAuthenticateUserService } from '@/services/auth/authenticate-user.service';

const authBodySchema = z.object({
  email: z
    .string({ message: 'Field is required.' })
    .email({ message: 'Must be a valid e-mail.' }),
  password: z.string({ message: 'Field is required.' }),
});

export const authenticateUser = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/authenticate-user',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a session for user',
        body: authBodySchema,
        response: {
          200: z.object({
            content: z.object({
              token: z.string(),
            }),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const authenticateUser = makeWithPrismaAuthenticateUserService();

      const { user } = await authenticateUser.execute({ email, password });

      const tokenJwt = await reply.jwtSign({}, { sign: { sub: user.id } });

      const refreshTokenJwt = await reply.jwtSign(
        {},
        { sign: { sub: user.id, expiresIn: '3d' } }
      );

      reply
        .setCookie('refreshToken', refreshTokenJwt, {
          path: '/',
          secure: true,
          httpOnly: true,
          sameSite: true,
        })
        .code(200)
        .send({ content: { token: tokenJwt } });
    }
  );
};
