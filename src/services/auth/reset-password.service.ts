import { HashAdapter, type IHashAdapter } from '@/adapters';
import { BadRequestError } from '@/middlewares/errors/bad-request.error';
import type { ITokensRepository } from '@/repositories/@interfaces/tokens.interface';
import type { IUsersRepository } from '@/repositories/@interfaces/users.interface';
import { PrismaTokensRepository } from '@/repositories/prisma/tokens.repository';
import { PrismaUsersRepository } from '@/repositories/prisma/users.repository';

interface ResetPasswordServiceRequest {
  code: string;
  password: string;
}

export class ResetPasswordService {
  constructor(
    private usersRepository: IUsersRepository,
    private tokensRepository: ITokensRepository,
    private hashAdapter: IHashAdapter
  ) {}
  async execute(data: ResetPasswordServiceRequest): Promise<void> {
    const { code, password } = data;

    const tokenFind = await this.tokensRepository.findById(code);

    if (!tokenFind) {
      throw new BadRequestError('Code provided is not valid.');
    }

    const userFind = await this.usersRepository.findById(tokenFind.userId);

    if (!userFind) {
      throw new BadRequestError('User not found.');
    }

    const newPasswordMatchWithCurrent = await this.hashAdapter.compareHash(
      password,
      userFind.passwordHash
    );

    if (newPasswordMatchWithCurrent) {
      throw new BadRequestError(
        'The new password must be different to current.'
      );
    }

    const newPasswordHashed = await this.hashAdapter.createHash(password);

    await this.usersRepository.update(
      {
        name: userFind.name,
        email: userFind.email,
        password: newPasswordHashed,
      },
      userFind.id
    );

    await this.tokensRepository.deleteById(tokenFind.id);
  }
}

export const makeWithPrismaResetPasswordService = () => {
  const userRepository = new PrismaUsersRepository();
  const tokenRepository = new PrismaTokensRepository();
  const hashAdapter = new HashAdapter();
  const resetPasswordService = new ResetPasswordService(
    userRepository,
    tokenRepository,
    hashAdapter
  );
  return resetPasswordService;
};
