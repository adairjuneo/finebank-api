import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';

import { ZodFieldError } from '@/middlewares/errors/zod-field.error';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository';

import { CreateAccountService } from './create-account.service';

let usersRepository: InMemoryUsersRepository;
let createAccountService: CreateAccountService;

describe('Create account service test', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createAccountService = new CreateAccountService(usersRepository);
  });

  it('should be able to create a new user account', async () => {
    const { user } = await createAccountService.execute({
      name: faker.person.fullName(),
      email: faker.internet.email({ provider: 'finebank.dev' }),
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should be able to create a new user and the password must be encrypted', async () => {
    const { user } = await createAccountService.execute({
      name: faker.person.fullName(),
      email: faker.internet.email({ provider: 'finebank.dev' }),
      password: '123456',
    });

    expect(user.passwordHash).not.toEqual('123456');
  });

  it('should not be able to create a new user with same e-mai twice', async () => {
    const { user } = await createAccountService.execute({
      name: faker.person.fullName(),
      email: faker.internet.email({ provider: 'finebank.dev' }),
      password: '123456',
    });

    await expect(
      createAccountService.execute({
        name: faker.person.fullName(),
        email: user.email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(ZodFieldError);
  });
});
