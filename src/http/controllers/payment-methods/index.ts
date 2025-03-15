import type { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/middlewares/jwt-verify.middleware';

import { getPaymentMethods } from './get-payment-methods.controller';

export const paymentMethodsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT);

  app.register(getPaymentMethods);
};
