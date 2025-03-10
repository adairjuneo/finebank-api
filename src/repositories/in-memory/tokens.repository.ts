import { randomUUID } from 'node:crypto';

import type {
  CreateTokenDTO,
  ITokensRepository,
  TokenDTO,
} from '../@interfaces/tokens.interface';

export class InMemoryTokensRepository implements ITokensRepository {
  public tokens: TokenDTO[] = [];

  async create(data: CreateTokenDTO): Promise<TokenDTO> {
    const token: TokenDTO = {
      id: randomUUID(),
      createdAt: new Date(),
      type: data.type,
      userId: data.userId,
    };

    this.tokens.push(token);

    return token;
  }

  async findById(id: string): Promise<TokenDTO | null> {
    const tokenFind = this.tokens.find((token) => token.id === id);

    if (!tokenFind) return null;

    return tokenFind;
  }

  async deleteById(id: string): Promise<void> {
    this.tokens = this.tokens.filter((token) => token.id === id);
  }

  async findByUserId(userId: string): Promise<TokenDTO[]> {
    const tokensFind = this.tokens.filter((token) => token.userId === userId);

    return tokensFind;
  }
}
