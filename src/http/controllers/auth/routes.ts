import type { FastifyInstance } from 'fastify';

import { authenticateUser } from './authenticate-user.controller';
import { createAccount } from './create-account.controller';
import { refreshToken } from './refresh-token.controller';
import { requestRecoveryPassword } from './request-recovery-password.controller';
import { resetPassword } from './reset-password.controller';

export const authRoutes = async (app: FastifyInstance) => {
  app.register(createAccount);
  app.register(authenticateUser);
  app.register(requestRecoveryPassword);
  app.register(resetPassword);

  app.register(refreshToken);
};
