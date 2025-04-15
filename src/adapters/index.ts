import { HashAdapter } from './bcrypt';

interface IHashAdapter {
  createHash(value: string): Promise<string>;
  compareHash(value: string, toCompare: string): Promise<boolean>;
}

export type { IHashAdapter };
export { HashAdapter };
