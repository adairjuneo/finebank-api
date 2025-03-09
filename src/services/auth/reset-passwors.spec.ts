import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository';

import { CreateAccountService } from './create-account.service';
import { ResetPasswordService } from './reset-password.service';

let usersRepository: InMemoryUsersRepository;
let createAccountService: CreateAccountService;
let resetPasswordService: ResetPasswordService;

describe('Reset password service test', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createAccountService = new CreateAccountService(usersRepository);
    resetPasswordService = new ResetPasswordService(usersRepository);

    await createAccountService.execute({
      name: 'Dev Test',
      email: 'devtest@finebank.dev',
      password: '123456',
    });
  });

  it('should be able to get a user if the e-mail provided is valid', async () => {
    const { user } = await resetPasswordService.execute({
      email: usersRepository.users[0]!.email,
    });

    expect(user!.id).toEqual(expect.any(String));
  });

  it('should not be able to get a user if the e-mail provided is invalid', async () => {
    const { user } = await resetPasswordService.execute({
      email: 'failed.email@finebank.dev',
    });

    expect(user).toEqual(null);
  });
});
