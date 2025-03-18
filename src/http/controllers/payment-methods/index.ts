import type { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/middlewares/jwt-verify.middleware';

import { listOfPaymentMethods } from './list-payment-methods.controller';

export const paymentMethodsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT);

  app.register(listOfPaymentMethods);
};
