import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';

import { HashAdapter, type IHashAdapter } from '@/adapters';
import { BadRequestError } from '@/middlewares/errors/bad-request.error';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository';

import { AuthenticateUserService } from './authenticate-user.service';
import { CreateAccountService } from './create-account.service';

let hashAdapter: IHashAdapter;
let usersRepository: InMemoryUsersRepository;
let createAccountService: CreateAccountService;
let authenticateUserService: AuthenticateUserService;

describe('Authenticate user service test', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    hashAdapter = new HashAdapter();
    createAccountService = new CreateAccountService(
      usersRepository,
      hashAdapter
    );
    authenticateUserService = new AuthenticateUserService(
      usersRepository,
      hashAdapter
    );

    await createAccountService.execute({
      name: 'Dev Test',
      email: 'devtest@finebank.dev',
      password: '123456',
    });
  });

  it('should be able to authenticate a existent user', async () => {
    const { user } = await authenticateUserService.execute({
      email: usersRepository.users[0]!.email,
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate a user with wrong email', async () => {
    await expect(
      authenticateUserService.execute({
        email: faker.internet.email({ provider: 'finebank.dev' }),
        password: '123456',
      })
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not be able to authenticate a user with wrong password', async () => {
    await expect(
      authenticateUserService.execute({
        email: usersRepository.users[0]!.email,
        password: 'wrong-password',
      })
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
