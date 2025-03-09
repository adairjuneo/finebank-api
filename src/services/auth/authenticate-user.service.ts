import { comparePassword } from '@/lib/password';
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
  constructor(private usersRepository: IUsersRepository) {}
  async execute(
    data: Pick<CreateUserDTO, 'email' | 'password'>
  ): Promise<AuthenticateUserServiceResponse> {
    const { email, password } = data;

    const userExists = await this.usersRepository.findByEmail(email);

    if (!userExists) {
      throw new BadRequestError('Invalid credentials provided.');
    }

    const passwordIsValid = await comparePassword(
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
  const createUserService = new AuthenticateUserService(userRepository);
  return createUserService;
};
