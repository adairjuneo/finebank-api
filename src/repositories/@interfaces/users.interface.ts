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
  name: z.string({ message: 'Field required' }),
  email: z.string().email({ message: 'Field required' }),
  password: z.string({ message: 'Field required' }),
});

const updateUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type UserDTO = z.infer<typeof userSchema>;
type CreateUserDTO = z.infer<typeof createUserSchema>;
type UpdateUserDTO = z.infer<typeof updateUserSchema>;

interface IUsersRepository {
  create(data: CreateUserDTO): Promise<UserDTO>;
  update(data: UpdateUserDTO, userId: string): Promise<UserDTO | null>;
  findById(id: string): Promise<UserDTO | null>;
  findByEmail(email: string): Promise<UserDTO | null>;
}

export { createUserSchema, updateUserSchema, userSchema };
export type { CreateUserDTO, IUsersRepository, UpdateUserDTO, UserDTO };
