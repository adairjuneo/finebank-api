import { beforeEach, describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/middlewares/errors/resource-not-found.error';
import { ZodFieldError } from '@/middlewares/errors/zod-field.error';
import type { PaymentMethodDTO } from '@/repositories/@interfaces/payment-methods.interface';
import type { UserDTO } from '@/repositories/@interfaces/users.interface';
import { InMemoryPaymentMethodsRepository } from '@/repositories/in-memory/payment-methods.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository';

import { CreateAccountService } from '../auth/create-account.service';
import { UpdatePaymentMethodService } from './update-payment-method.service';

let paymentMethodsRepository: InMemoryPaymentMethodsRepository;
let updatePaymentMethodService: UpdatePaymentMethodService;
let createAccountService: CreateAccountService;
let usersRepository: InMemoryUsersRepository;
let userCreated: UserDTO;
let paymentMethodCreated: PaymentMethodDTO;

describe('Update payment method service test', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    paymentMethodsRepository = new InMemoryPaymentMethodsRepository();
    createAccountService = new CreateAccountService(usersRepository);
    updatePaymentMethodService = new UpdatePaymentMethodService(
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

  it('should be able to update a existent payment method', async () => {
    const { paymentMethod } = await updatePaymentMethodService.execute({
      paymentMethodId: paymentMethodCreated.id,
      description: 'Nova Descrição',
      userId: userCreated.id,
    });

    expect(paymentMethod.id).toEqual(paymentMethodCreated.id);
    expect(paymentMethod.description).not.toEqual(
      paymentMethodCreated.description
    );
    expect(paymentMethod.description).toEqual('Nova Descrição');
  });

  it('should be able to not update a payment method with a description was existent', async () => {
    await expect(
      updatePaymentMethodService.execute({
        paymentMethodId: paymentMethodCreated.id,
        description: 'Dev Test Desc',
        userId: userCreated.id,
      })
    ).rejects.toBeInstanceOf(ZodFieldError);
  });

  it('should be able to not update non existent payment method by id', async () => {
    await expect(
      updatePaymentMethodService.execute({
        paymentMethodId: 'id-invalido',
        description: 'Nova Descrição',
        userId: userCreated.id,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
