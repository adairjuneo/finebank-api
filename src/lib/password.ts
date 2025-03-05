import bcrypt from 'bcryptjs';

import { env } from '@/env';
import { BadRequestError } from '@/middlewares/errors/bad-request.error';

export const hashPassword = async (password: string | null) => {
  if (!password) {
    throw new BadRequestError('Password must be provide to hash.');
  }

  const passwordHash = await bcrypt.hash(password, env.AUTH_SALT_PASSWORD_HASH);

  return passwordHash;
};

export const comparePassword = async (
  password: string | null,
  hashedToCompare: string | null
) => {
  if (!password || !hashedToCompare) {
    throw new BadRequestError('Passwords to compare must be provide.');
  }

  const passwordIsTheSame = await bcrypt.compare(password, hashedToCompare);

  return passwordIsTheSame;
};
