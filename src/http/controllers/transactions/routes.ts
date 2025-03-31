import type { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/middlewares/jwt-verify.middleware';

import { listOfTransactions } from './list-transactions.controller';

export const transactionsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT);

  //
  app.register(listOfTransactions);
};
