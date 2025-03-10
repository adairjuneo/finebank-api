import { randomUUID } from 'node:crypto';

import type {
  CreateUserDTO,
  IUsersRepository,
  UpdateUserDTO,
  UserDTO,
} from '../@interfaces/users.interface';

export class InMemoryUsersRepository implements IUsersRepository {
  public users: UserDTO[] = [];

  async create(data: CreateUserDTO): Promise<UserDTO> {
    const user: UserDTO = {
      id: randomUUID(),
      email: data.email,
      name: data.name,
      passwordHash: data.password,
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async update(data: UpdateUserDTO, userId: string): Promise<UserDTO | null> {
    const userToUpdate = this.users.find((user) => user.id === userId);

    if (!userToUpdate) return null;

    const userUpdated: UserDTO = {
      ...userToUpdate,
      email: data.email || userToUpdate.email,
      name: data.name || userToUpdate.name,
      passwordHash: data.password || userToUpdate.passwordHash,
      updatedAt: new Date(),
    };

    this.users = this.users.filter((user) => user.id !== userId);

    this.users.push(userUpdated);

    return userUpdated;
  }

  async findById(id: string): Promise<UserDTO | null> {
    const userFind = this.users.find((user) => user.id === id);

    if (!userFind) return null;

    return userFind;
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    const userFind = this.users.find((user) => user.email === email);

    if (!userFind) return null;

    return userFind;
  }
}
