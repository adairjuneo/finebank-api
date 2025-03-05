import { z } from 'zod';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  passwordHash: z.string(),
  avatarUrl: z.string().nullish(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type UserDTO = z.infer<typeof userSchema>;
type CreateUserDTO = z.infer<typeof createUserSchema>;

interface IUsersRepository {
  create(data: CreateUserDTO): Promise<UserDTO>;
  findById(id: string): Promise<UserDTO | null>;
  findByEmail(email: string): Promise<UserDTO | null>;
}

export { createUserSchema, userSchema };
export type { CreateUserDTO, IUsersRepository, UserDTO };
