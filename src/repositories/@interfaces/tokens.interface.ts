import { z } from 'zod';

const tokenTypeSchema = z.union([
  z.literal('UPLOAD_FILE'),
  z.literal('PASSWORD_RECOVER'),
]);

const tokenSchema = z.object({
  id: z.string(),
  type: tokenTypeSchema,
  createdAt: z.date(),
  userId: z.string(),
});

const createTokenSchema = z.object({
  type: tokenTypeSchema,
  userId: z.string(),
});

type TokenDTO = z.infer<typeof tokenSchema>;
type TokenType = z.infer<typeof tokenTypeSchema>;
type CreateTokenDTO = z.infer<typeof createTokenSchema>;

interface ITokensRepository {
  create(data: CreateTokenDTO): Promise<TokenDTO>;
  findById(id: string): Promise<TokenDTO | null>;
  findByUserId(userId: string): Promise<TokenDTO[]>;
}

export { createTokenSchema, tokenSchema };
export type { CreateTokenDTO, ITokensRepository, TokenDTO, TokenType };
