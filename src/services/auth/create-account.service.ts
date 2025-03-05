import { hashPassword } from '@/lib/password';
import { ZodFieldError } from '@/middlewares/errors/zod-field.error';
import type {
  CreateUserDTO,
  IUsersRepository,
  UserDTO,
} from '@/repositories/@interfaces/users.interface';
import { PrismaUsersRepository } from '@/repositories/prisma/users.repository';

interface CreateAccountUseCaseResponse {
  user: UserDTO;
}

export class CreateAccountService {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(data: CreateUserDTO): Promise<CreateAccountUseCaseResponse> {
    const { name, email, password } = data;

    const passwordHash = await hashPassword(password);

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
  const createUserUseCase = new CreateAccountService(userRepository);
  return createUserUseCase;
};
