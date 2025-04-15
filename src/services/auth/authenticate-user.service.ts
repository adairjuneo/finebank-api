import { HashAdapter, type IHashAdapter } from '@/adapters';
import { BadRequestError } from '@/middlewares/errors/bad-request.error';
import type {
  CreateUserDTO,
  IUsersRepository,
  UserDTO,
} from '@/repositories/@interfaces/users.interface';
import { PrismaUsersRepository } from '@/repositories/prisma/users.repository';

interface AuthenticateUserServiceResponse {
  user: UserDTO;
}

export class AuthenticateUserService {
  constructor(
    private usersRepository: IUsersRepository,
    private hashAdapter: IHashAdapter
  ) {}
  async execute(
    data: Pick<CreateUserDTO, 'email' | 'password'>
  ): Promise<AuthenticateUserServiceResponse> {
    const { email, password } = data;

    const userExists = await this.usersRepository.findByEmail(email);

    if (!userExists) {
      throw new BadRequestError('Invalid credentials provided.');
    }

    const passwordIsValid = await this.hashAdapter.compareHash(
      password,
      userExists.passwordHash
    );

    if (!passwordIsValid) {
      throw new BadRequestError('Invalid credentials provided.');
    }

    return { user: userExists };
  }
}

export const makeWithPrismaAuthenticateUserService = () => {
  const userRepository = new PrismaUsersRepository();
  const hashAdapter = new HashAdapter();
  const createUserService = new AuthenticateUserService(
    userRepository,
    hashAdapter
  );
  return createUserService;
};
