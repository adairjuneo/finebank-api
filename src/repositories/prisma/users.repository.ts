import { prisma } from '@/lib/prisma';

import type {
  CreateUserDTO,
  IUsersRepository,
  UserDTO,
} from '../@interfaces/users.interface';

export class PrismaUsersRepository implements IUsersRepository {
  async create(data: CreateUserDTO): Promise<UserDTO> {
    const userCreated = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.password,
      },
    });

    return userCreated;
  }
  async findById(id: string): Promise<UserDTO | null> {
    const userFinded = await prisma.user.findUnique({
      where: { id },
    });

    return userFinded;
  }
  async findByEmail(email: string): Promise<UserDTO | null> {
    const userFinded = await prisma.user.findUnique({
      where: { email },
    });

    return userFinded;
  }
}
