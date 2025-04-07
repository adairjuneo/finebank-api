import { faker } from '@faker-js/faker';
import { TransactionType } from '@prisma/client';
import { addDays, subDays } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';

import { PaymentMethodDTO } from '@/repositories/@interfaces/payment-methods.interface';
import type { UserDTO } from '@/repositories/@interfaces/users.interface';
import { InMemoryPaymentMethodsRepository } from '@/repositories/in-memory/payment-methods.repository';
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/transactions.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository';

import { CreateAccountService } from '../auth/create-account.service';
import { CreatePaymentMethodService } from '../payment-methods/create-payment-method.service';
import { CreateTransactionService } from './create-transaction.service';

let transactionsRepository: InMemoryTransactionsRepository;
let paymentMethodsRepository: InMemoryPaymentMethodsRepository;
let createPaymentMethodService: CreatePaymentMethodService;
let createTransactionsService: CreateTransactionService;
let createAccountService: CreateAccountService;
let usersRepository: InMemoryUsersRepository;
let userCreated: UserDTO;
let paymentMethodsCreated: PaymentMethodDTO[];

describe('Create transactions service test', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    transactionsRepository = new InMemoryTransactionsRepository();
    paymentMethodsRepository = new InMemoryPaymentMethodsRepository();
    createAccountService = new CreateAccountService(usersRepository);
    createPaymentMethodService = new CreatePaymentMethodService(
      paymentMethodsRepository
    );
    createTransactionsService = new CreateTransactionService(
      transactionsRepository
    );

    const { user } = await createAccountService.execute({
      name: 'Dev Test',
      email: 'devtest@finebank.dev',
      password: '123456',
    });

    userCreated = user;

    const createNewPaymentMethods = async () => {
      const paymentMethodOne = await createPaymentMethodService.execute({
        description: 'Money',
        userId: user.id,
      });
      const paymentMethodTwo = await createPaymentMethodService.execute({
        description: 'PIX',
        userId: user.id,
      });

      return [paymentMethodOne.paymentMethod, paymentMethodTwo.paymentMethod];
    };

    paymentMethodsCreated = await createNewPaymentMethods();
  });

  it('should be able to create a new transaction', async () => {
    const { transaction } = await createTransactionsService.execute({
      params: { userId: userCreated.id },
      data: {
        description: faker.finance.transactionDescription(),
        shopName: faker.company.name(),
        paymentMethodId: faker.helpers.arrayElement(
          paymentMethodsCreated.map((paymentMethod) => paymentMethod.id)
        ),
        transactionType: faker.helpers.arrayElement([
          TransactionType.EXPENSES,
          TransactionType.REVENUE,
        ]),
        paymentAt: faker.date.between({
          to: addDays(new Date(), 60),
          from: subDays(new Date(), 365),
        }),
        amountInCents: Number(
          faker.commerce.price({ min: 100, max: 100000, dec: 0 })
        ),
      },
    });

    expect(transaction.id).toEqual(expect.any(String));
    expect(transaction.userId).toEqual(userCreated.id);
  });
});
