import { beforeEach, describe, expect, it } from 'vitest';

import { HashAdapter, type IHashAdapter } from '@/adapters';
import { BadRequestError } from '@/middlewares/errors/bad-request.error';
import { InMemoryTokensRepository } from '@/repositories/in-memory/tokens.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository';

import { CreateAccountService } from './create-account.service';
import { RequestRecoveryPasswordService } from './request-recovery-password.service';
import { ResetPasswordService } from './reset-password.service';

let hashAdapter: IHashAdapter;
let usersRepository: InMemoryUsersRepository;
let tokenRepository: InMemoryTokensRepository;
let createAccountService: CreateAccountService;
let resetPasswordService: ResetPasswordService;
let requestRecoveryPasswordService: RequestRecoveryPasswordService;

describe('Reset password service test', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    tokenRepository = new InMemoryTokensRepository();
    hashAdapter = new HashAdapter();
    createAccountService = new CreateAccountService(
      usersRepository,
      hashAdapter
    );
    resetPasswordService = new ResetPasswordService(
      usersRepository,
      tokenRepository,
      hashAdapter
    );
    requestRecoveryPasswordService = new RequestRecoveryPasswordService(
      usersRepository,
      tokenRepository
    );

    await createAccountService.execute({
      name: 'Dev Test',
      email: 'devtest@finebank.dev',
      password: '123456',
    });

    await requestRecoveryPasswordService.execute({
      email: 'devtest@finebank.dev',
    });
  });

  it('should be able to reset password if a valid code and password provided', async () => {
    await expect(
      resetPasswordService.execute({
        code: tokenRepository.tokens[0]!.id,
        password: '987654',
      })
    ).resolves.not.toBeInstanceOf(BadRequestError);
  });

  it('should not be able to reset password if a invalid code as provide', async () => {
    await expect(
      resetPasswordService.execute({
        code: 'invalid-code',
        password: '987654',
      })
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not be able to reset password if password provide is the same of current', async () => {
    await expect(
      resetPasswordService.execute({
        code: tokenRepository.tokens[0]!.id,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
