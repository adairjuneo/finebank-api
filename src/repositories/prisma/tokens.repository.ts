import { prisma } from '@/lib/prisma';

import type {
  CreateTokenDTO,
  ITokensRepository,
  TokenDTO,
} from '../@interfaces/tokens.interface';

export class PrismaTokensRepository implements ITokensRepository {
  async create(data: CreateTokenDTO): Promise<TokenDTO> {
    const token = await prisma.token.create({
      data: {
        type: data.type,
        userId: data.userId,
      },
    });

    return token;
  }
  async findById(id: string): Promise<TokenDTO | null> {
    const tokenFind = await prisma.token.findUnique({
      where: {
        id,
      },
    });

    return tokenFind;
  }

  async findByUserId(userId: string): Promise<TokenDTO[]> {
    const tokensFind = await prisma.token.findMany({
      where: {
        userId,
      },
    });

    return tokensFind;
  }
}
