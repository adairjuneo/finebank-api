import type { FastifyReply, FastifyRequest } from 'fastify';

export const refreshTokenVerify = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    await request.jwtVerify({ onlyCookie: true });
  } catch (err) {
    reply.clearCookie('refreshToken', { path: '/' });
    return reply
      .status(404)
      .send({ message: 'Invalid or expired refresh token.', err });
  }
};
