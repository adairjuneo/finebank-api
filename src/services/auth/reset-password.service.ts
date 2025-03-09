import type {
  CreateUserDTO,
  IUsersRepository,
  UserDTO,
} from '@/repositories/@interfaces/users.interface';
import { PrismaUsersRepository } from '@/repositories/prisma/users.repository';

interface ResetPasswordServiceResponse {
  user: UserDTO | null;
  urlToReset: string | null;
}

export class ResetPasswordService {
  constructor(private usersRepository: IUsersRepository) {}
  async execute(
    data: Pick<CreateUserDTO, 'email'>
  ): Promise<ResetPasswordServiceResponse> {
    const { email } = data;

    const userFind = await this.usersRepository.findByEmail(email);

    if (userFind) {
      // Generate the token with the URL
    }

    return { user: userFind, urlToReset: 'null' };
  }
}

export const makeWithPrismaResetPasswordService = () => {
  const userRepository = new PrismaUsersRepository();
  const resetPasswordService = new ResetPasswordService(userRepository);
  return resetPasswordService;
};
