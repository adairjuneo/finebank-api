import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { makeWithPrismaResetPasswordService } from '@/services/auth/reset-password.service';

const resetPasswordBodySchema = z
  .object({
    code: z.string({ message: 'Field is required.' }),
    password: z.string({ message: 'Field is required.' }),
    passwordConfirmation: z.string({ message: 'Field is required.' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords must be equal.',
    path: ['password_confirmation'],
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
      const { code, password } = request.body;

      const resetPassword = makeWithPrismaResetPasswordService();

      await resetPassword.execute({ code, password });

      reply.status(204).send();
    }
  );
};
