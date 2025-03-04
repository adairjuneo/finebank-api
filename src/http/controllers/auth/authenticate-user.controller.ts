import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

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
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      // Connect this with service factorie to authenticate user;

      const tokenJwt = await reply.jwtSign(
        {},
        { sign: { sub: 'user-id-test' } }
      );

      const refreshTokenJwt = await reply.jwtSign(
        {},
        { sign: { sub: 'user-id-test', expiresIn: '3d' } }
      );

      // After authenticate user with successfully, redirect the user to Dashboard page in web app;

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
