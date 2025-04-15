import { beforeEach, describe, expect, it } from 'vitest';

import { HashAdapter, type IHashAdapter } from '@/adapters';
import { ResourceNotFoundError } from '@/middlewares/errors/resource-not-found.error';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository';

import { CreateAccountService } from '../auth/create-account.service';
import { GetProfileService } from './get-profile.service';

let hashAdapter: IHashAdapter;
let usersRepository: InMemoryUsersRepository;
let getProfileService: GetProfileService;
let createAccountService: CreateAccountService;

describe('Get user account profile service test', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    hashAdapter = new HashAdapter();
    getProfileService = new GetProfileService(usersRepository);
    createAccountService = new CreateAccountService(
      usersRepository,
      hashAdapter
    );

    await createAccountService.execute({
      name: 'Dev Test',
      email: 'devtest@finebank.dev',
      password: '123456',
    });
  });

  it('should be able to get user profile', async () => {
    const { userProfile } = await getProfileService.execute({
      userId: usersRepository.users[0]!.id,
    });

    expect(userProfile.id).toEqual(expect.any(String));
  });

  it('should not be able to get user profile by invalid id', async () => {
    await expect(
      getProfileService.execute({
        userId: 'wrong-id-test',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
