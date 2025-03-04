import { FastifyInstance } from 'fastify';

import { authRoutes } from '../controllers/auth/routes';
import { userRoutes } from '../controllers/users/routes';

export const appRoutes = async (app: FastifyInstance) => {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(userRoutes, { prefix: '/users' });
};
