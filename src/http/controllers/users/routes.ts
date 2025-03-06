import type { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/middlewares/jwt-verify.middleware';

import { getUserProfile } from './get-profile.controller';

export const userRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJWT);

  app.register(getUserProfile);
};
