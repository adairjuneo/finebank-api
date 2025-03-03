import { FastifyInstance } from 'fastify';

export const appRoutes = async (app: FastifyInstance) => {
  app.register(() => {}, { prefix: '/auth' });
  // app.register(uploadRoutes, { prefix: '/upload' });
  // app.register(usersRoutes, { prefix: '/users' });
  // app.register(billingRoutes, { prefix: '/billing' });
  // app.register(organizationsRoutes, { prefix: '/organizations' });
  // app.register(projectsRoutes, { prefix: '/projects' });
  // app.register(membersRoutes, { prefix: '/members' });
  // app.register(invitesRoutes, { prefix: '/invites' });
};
