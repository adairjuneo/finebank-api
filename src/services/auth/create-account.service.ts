import { HashAdapter, type IHashAdapter } from '@/adapters';
import { ZodFieldError } from '@/middlewares/errors/zod-field.error';
import type {
  CreateUserDTO,
  IUsersRepository,
  UserDTO,
} from '@/repositories/@interfaces/users.interface';
import { PrismaUsersRepository } from '@/repositories/prisma/users.repository';

interface CreateAccountServiceResponse {
  user: UserDTO;
}

export class CreateAccountService {
  constructor(
    private usersRepository: IUsersRepository,
    private hashAdapter: IHashAdapter
  ) {}

  async execute(data: CreateUserDTO): Promise<CreateAccountServiceResponse> {
    const { name, email, password } = data;

    const passwordHash = await this.hashAdapter.createHash(password);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new ZodFieldError('email', 'Already exist user with this e-mail.');
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
    });

    return { user };
  }
}

export const makeWithPrismaCreateAccountService = () => {
  const userRepository = new PrismaUsersRepository();
  const hashAdapter = new HashAdapter();
  const createUserService = new CreateAccountService(
    userRepository,
    hashAdapter
  );
  return createUserService;
};
