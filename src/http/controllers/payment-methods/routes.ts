import type { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/middlewares/jwt-verify.middleware';

import { createNewPaymentMethod } from './create-payment-method.controller';
import { deletePaymentMethod } from './delete-payment-method.controller';
import { listOfPaymentMethods } from './list-payment-methods.controller';
import { updatePaymentMethod } from './update-payment-method.controller';

export const paymentMethodsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT);

  app.register(listOfPaymentMethods);
  app.register(createNewPaymentMethod);
  app.register(updatePaymentMethod);
  app.register(deletePaymentMethod);
};
