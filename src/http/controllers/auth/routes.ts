import type { FastifyInstance } from 'fastify';

import { authenticateUser } from './authenticate-user.controller';
import { createAccount } from './create-account.controller';
import { recoveryPassword } from './recovery-password.controller';
import { refreshToken } from './refresh-token.controller';

export const authRoutes = async (app: FastifyInstance) => {
  app.register(createAccount);
  app.register(authenticateUser);
  app.register(recoveryPassword);

  app.register(refreshToken);
};
