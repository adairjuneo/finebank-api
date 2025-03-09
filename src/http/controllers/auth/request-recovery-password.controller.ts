import chalk from 'chalk';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { env } from '@/env';
import { sendMail } from '@/lib/email';
import { makeWithPrismaRequestRecoveryPasswordService } from '@/services/auth/request-recovery-password.service';

import { HtmlRecoveryPasswordEmail } from '../../../../emails/recovery-password';

const requestRecoveryPasswordBodySchema = z.object({
  email: z
    .string({ message: 'Field is required.' })
    .email({ message: 'Must be a valid e-mail.' }),
});

export const requestRecoveryPassword = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/request-recovery-password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Request recovery password of user account',
        body: requestRecoveryPasswordBodySchema,
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const requestResetPassword =
        makeWithPrismaRequestRecoveryPasswordService();

      const { user, urlToRecovery } = await requestResetPassword.execute({
        email,
      });

      if (user && urlToRecovery) {
        const htmlEmail = await HtmlRecoveryPasswordEmail({
          userFirstLastName: user.name,
          resetPasswordLink: urlToRecovery,
          finebankProductionLink: env.REACT_APP_URL,
        });

        const { error } = await sendMail.emails.send({
          from: 'Finebank.io <noreply@mail.dev-juneo.com>',
          to: [user.email, 'adair_juneo@outlook.com'],
          subject: 'Password Recovery Request - Finebank.io',
          html: htmlEmail,
          // html: String('<h3>Code for reset password</h3><br/><p>Code: <strong>')
          //   .concat(urlToRecovery)
          //   .concat('</strong></p>'),
        });

        if (error) {
          console.error(chalk.redBright(error.name));
          console.error(chalk.redBright(error.message));
        }
      }

      reply.status(204).send();
    }
  );
};
