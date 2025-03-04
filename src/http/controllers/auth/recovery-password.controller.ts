import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const recoveryPasswordBodySchema = z.object({
  email: z
    .string({ message: 'Field is required.' })
    .email({ message: 'Must be a valid e-mail.' }),
});

export const recoveryPassword = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/recovery-password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Recovery password of user account',
        body: recoveryPasswordBodySchema,
        response: {
          200: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      // Connect this with service factorie to recovery the password of user account;

      // After validate successfully the resquest, send a e-mail to user for recovery the password with token;

      reply.status(200).send();
    }
  );
};
