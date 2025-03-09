import { env } from '@/env';
import type { ITokensRepository } from '@/repositories/@interfaces/tokens.interface';
import type {
  CreateUserDTO,
  IUsersRepository,
  UserDTO,
} from '@/repositories/@interfaces/users.interface';
import { PrismaTokensRepository } from '@/repositories/prisma/tokens.repository';
import { PrismaUsersRepository } from '@/repositories/prisma/users.repository';

interface RequestRecoveryPasswordServiceResponse {
  user: UserDTO | null;
  urlToRecovery: string | null;
}

export class RequestRecoveryPasswordService {
  constructor(
    private usersRepository: IUsersRepository,
    private tokensRepository: ITokensRepository
  ) {}
  async execute(
    data: Pick<CreateUserDTO, 'email'>
  ): Promise<RequestRecoveryPasswordServiceResponse> {
    const { email } = data;

    const userFind = await this.usersRepository.findByEmail(email);

    if (userFind) {
      const tokenCreated = await this.tokensRepository.create({
        userId: userFind.id,
        type: 'PASSWORD_RECOVER',
      });

      const urlToRecoveryPassword = new URL(
        env.REACT_APP_URL_RECOVERY_PASSWORD
      );

      urlToRecoveryPassword.searchParams.set('code', tokenCreated.id);

      return {
        user: userFind,
        urlToRecovery: urlToRecoveryPassword.toString(),
      };
    }

    return { user: null, urlToRecovery: null };
  }
}

export const makeWithPrismaRequestRecoveryPasswordService = () => {
  const userRepository = new PrismaUsersRepository();
  const tokensRepository = new PrismaTokensRepository();
  const requestRecoveryPasswordService = new RequestRecoveryPasswordService(
    userRepository,
    tokensRepository
  );
  return requestRecoveryPasswordService;
};
