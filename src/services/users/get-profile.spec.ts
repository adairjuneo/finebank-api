import { beforeEach, describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/middlewares/errors/resource-not-found.error';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository';

import { CreateAccountService } from '../auth/create-account.service';
import { GetProfileService } from './get-profile.service';

let usersRepository: InMemoryUsersRepository;
let getProfileService: GetProfileService;
let createAccountService: CreateAccountService;

describe('Get user account profile service test', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    getProfileService = new GetProfileService(usersRepository);
    createAccountService = new CreateAccountService(usersRepository);

    await createAccountService.execute({
      name: 'Dev Test',
      email: 'devtest@finebank.dev',
      password: '123456',
    });
  });

  it('should be able to get user profile', async () => {
    const { user } = await getProfileService.execute({
      userId: usersRepository.users[0]!.id,
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to get user profile by invalid id', async () => {
    await expect(
      getProfileService.execute({
        userId: 'wrong-id-test',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
