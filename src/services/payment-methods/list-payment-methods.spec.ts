import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';

import { env } from '@/env';
import type { UserDTO } from '@/repositories/@interfaces/users.interface';
import { InMemoryPaymentMethodsRepository } from '@/repositories/in-memory/payment-methods.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository';

import { CreateAccountService } from '../auth/create-account.service';
import { ListPaymentMethodsService } from './list-payment-methods.service';

let paymentMethodsRepository: InMemoryPaymentMethodsRepository;
let listPaymentMethodsService: ListPaymentMethodsService;
let createAccountService: CreateAccountService;
let usersRepository: InMemoryUsersRepository;
let userCreated: UserDTO;

describe('List payment methods service test', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    paymentMethodsRepository = new InMemoryPaymentMethodsRepository();
    createAccountService = new CreateAccountService(usersRepository);
    listPaymentMethodsService = new ListPaymentMethodsService(
      paymentMethodsRepository
    );

    const { user } = await createAccountService.execute({
      name: 'Dev Test',
      email: 'devtest@finebank.dev',
      password: '123456',
    });

    userCreated = user;

    Array.from({ length: 22 }, async () => {
      await paymentMethodsRepository.create({
        description: faker.word.sample(),
        userId: user.id,
      });
    });

    await paymentMethodsRepository.create({
      description: 'Dev Test Desc',
      userId: user.id,
    });

    await paymentMethodsRepository.create({
      description: 'Dev Test Desc 2',
      userId: user.id,
    });
  });

  it('should be able to list payment methods', async () => {
    const { paymentMethods } = await listPaymentMethodsService.execute({
      page: 1,
      userId: userCreated.id,
    });

    expect(paymentMethods.data.length).toBeTruthy();
  });

  it('should be able to list payment methods with pagination', async () => {
    const { paymentMethods } = await listPaymentMethodsService.execute({
      page: 1,
      userId: userCreated.id,
    });

    expect(paymentMethods.data.length).equal(env.PAGINATION_PAGE_SIZE);
    expect(paymentMethods.pagination).toEqual(
      expect.objectContaining({
        pageIndex: 1,
        totalPages: 2,
        totalCount: 24,
        hasNextPage: true,
      })
    );
  });

  it('should be able to list payment methods with description filter', async () => {
    const { paymentMethods } = await listPaymentMethodsService.execute({
      page: 1,
      userId: userCreated.id,
      description: 'Dev Test',
    });

    expect(paymentMethods.data.length).equal(2);
    expect(paymentMethods.data).toEqual([
      expect.objectContaining({ description: 'Dev Test Desc' }),
      expect.objectContaining({ description: 'Dev Test Desc 2' }),
    ]);
  });
});
