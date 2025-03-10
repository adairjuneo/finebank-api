import { prisma } from '@/lib/prisma';

import type {
  CreateUserDTO,
  IUsersRepository,
  UpdateUserDTO,
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

  async update(data: UpdateUserDTO, userId: string): Promise<UserDTO | null> {
    const userUpdated = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.password,
      },
    });

    return userUpdated;
  }

  async findById(id: string): Promise<UserDTO | null> {
    const userFinde = await prisma.user.findUnique({
      where: { id },
    });

    return userFinde;
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    const userFinde = await prisma.user.findUnique({
      where: { email },
    });

    return userFinde;
  }
}
