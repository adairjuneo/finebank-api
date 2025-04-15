import { beforeEach, describe, expect, it } from 'vitest';

import { HashAdapter, type IHashAdapter } from '@/adapters';
import { ResourceNotFoundError } from '@/middlewares/errors/resource-not-found.error';
import type { PaymentMethodDTO } from '@/repositories/@interfaces/payment-methods.interface';
import type { UserDTO } from '@/repositories/@interfaces/users.interface';
import { InMemoryPaymentMethodsRepository } from '@/repositories/in-memory/payment-methods.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository';

import { CreateAccountService } from '../auth/create-account.service';
import { DeletePaymentMethodService } from './delete-payment-method.service';

let hashAdapter: IHashAdapter;
let paymentMethodsRepository: InMemoryPaymentMethodsRepository;
let deletePaymentMethodService: DeletePaymentMethodService;
let createAccountService: CreateAccountService;
let usersRepository: InMemoryUsersRepository;
let userCreated: UserDTO;
let paymentMethodCreated: PaymentMethodDTO;

describe('Create payment method service test', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    paymentMethodsRepository = new InMemoryPaymentMethodsRepository();
    hashAdapter = new HashAdapter();
    createAccountService = new CreateAccountService(
      usersRepository,
      hashAdapter
    );
    deletePaymentMethodService = new DeletePaymentMethodService(
      paymentMethodsRepository
    );

    const { user } = await createAccountService.execute({
      name: 'Dev Test',
      email: 'devtest@finebank.dev',
      password: '123456',
    });

    userCreated = user;

    const paymentMethod = await paymentMethodsRepository.create({
      description: 'Dev Test Desc',
      userId: user.id,
    });

    paymentMethodCreated = paymentMethod;
  });

  it('should be able to delete payment method by id', async () => {
    const { paymentMethodId } = await deletePaymentMethodService.execute({
      userId: userCreated.id,
      paymentMethodId: paymentMethodCreated.id,
    });

    expect(paymentMethodId).toEqual(expect.any(String));
  });

  it('should be able to not delete payment method if does not exists by id', async () => {
    await expect(
      deletePaymentMethodService.execute({
        userId: userCreated.id,
        paymentMethodId: 'invalid-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
