import bcrypt from 'bcryptjs';

import { env } from '@/env';

import type { IHashAdapter } from '.';

export class HashAdapter implements IHashAdapter {
  async createHash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, env.AUTH_SALT_PASSWORD_HASH);

    return hash;
  }

  async compareHash(value: string, toCompare: string): Promise<boolean> {
    const hashIsTheSame = await bcrypt.compare(value, toCompare);

    return hashIsTheSame;
  }
}
