import { FastifyInstance } from 'fastify';

import { authRoutes } from '../controllers/auth/routes';
import { paymentMethodsRoutes } from '../controllers/payment-methods/routes';
import { userRoutes } from '../controllers/users/routes';

export const appRoutes = async (app: FastifyInstance) => {
  app.register(authRoutes, { prefix: '/auth' });
  app.register(userRoutes, { prefix: '/users' });
  app.register(paymentMethodsRoutes, { prefix: '/payment-methods' });
};
