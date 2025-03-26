import { beforeEach, describe, expect, it } from 'vitest';

import { ZodFieldError } from '@/middlewares/errors/zod-field.error';
import type { UserDTO } from '@/repositories/@interfaces/users.interface';
import { InMemoryPaymentMethodsRepository } from '@/repositories/in-memory/payment-methods.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository';

import { CreateAccountService } from '../auth/create-account.service';
import { CreatePaymentMethodService } from './create-payment-method.service';

let paymentMethodsRepository: InMemoryPaymentMethodsRepository;
let createPaymentMethodService: CreatePaymentMethodService;
let createAccountService: CreateAccountService;
let usersRepository: InMemoryUsersRepository;
let userCreated: UserDTO;

describe('Create payment method service test', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    paymentMethodsRepository = new InMemoryPaymentMethodsRepository();
    createAccountService = new CreateAccountService(usersRepository);
    createPaymentMethodService = new CreatePaymentMethodService(
      paymentMethodsRepository
    );

    const { user } = await createAccountService.execute({
      name: 'Dev Test',
      email: 'devtest@finebank.dev',
      password: '123456',
    });

    userCreated = user;
  });

  it('should be able to create a new payment method', async () => {
    const { paymentMethod } = await createPaymentMethodService.execute({
      description: 'Dev Test Desc',
      userId: userCreated.id,
    });

    expect(paymentMethod.id).toEqual(expect.any(String));
    expect(paymentMethod.description).toEqual(paymentMethod.description);
  });

  it('should be able to create twice payment method with different descriptions', async () => {
    await createPaymentMethodService.execute({
      description: 'Dev Test Desc',
      userId: userCreated.id,
    });

    await expect(
      createPaymentMethodService.execute({
        description: 'Dev Test Desc 2',
        userId: userCreated.id,
      })
    ).resolves.not.toBeInstanceOf(ZodFieldError);
  });

  it('should be able to not create twice payment method with same description', async () => {
    await createPaymentMethodService.execute({
      description: 'Dev Test Desc',
      userId: userCreated.id,
    });

    await expect(
      createPaymentMethodService.execute({
        description: 'Dev Test Desc',
        userId: userCreated.id,
      })
    ).rejects.toBeInstanceOf(ZodFieldError);
  });
});
