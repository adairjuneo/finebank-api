import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeWithPrismaResetPasswordService } from '@/services/auth/reset-password.service';

const resetPasswordBodySchema = z.object({
  email: z
    .string({ message: 'Field is required.' })
    .email({ message: 'Must be a valid e-mail.' }),
});

export const resetPassword = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/reset-password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Reset password of user account',
        body: resetPasswordBodySchema,
        response: {
          200: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const resetPassword = makeWithPrismaResetPasswordService();

      const { user } = await resetPassword.execute({ email });

      if (user) {
        // Send the email right were.
      }

      reply.status(200).send();
    }
  );
};
