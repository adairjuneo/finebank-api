import { randomUUID } from 'node:crypto';

import type {
  CreateUserDTO,
  IUsersRepository,
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
  async findById(id: string): Promise<UserDTO | null> {
    const userFinded = this.users.find((user) => user.id === id);

    if (!userFinded) return null;

    return userFinded;
  }
  async findByEmail(email: string): Promise<UserDTO | null> {
    const userFinded = this.users.find((user) => user.email === email);

    if (!userFinded) return null;

    return userFinded;
  }
}
