import { faker } from '@faker-js/faker';
import { TransactionType } from '@prisma/client';
import { addDays, subDays } from 'date-fns';
import { beforeEach, describe, expect, it } from 'vitest';

import { env } from '@/env';
import type { PaymentMethodDTO } from '@/repositories/@interfaces/payment-methods.interface';
import type { UserDTO } from '@/repositories/@interfaces/users.interface';
import { InMemoryPaymentMethodsRepository } from '@/repositories/in-memory/payment-methods.repository';
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/transactions.repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users.repository';

import { CreateAccountService } from '../auth/create-account.service';
import { CreatePaymentMethodService } from '../payment-methods/create-payment-method.service';
import { ListTransactionsService } from './list-transactions.service';

let transactionsRepository: InMemoryTransactionsRepository;
let paymentMethodsRepository: InMemoryPaymentMethodsRepository;
let listTransactionsService: ListTransactionsService;
let createAccountService: CreateAccountService;
let createPaymentMethodService: CreatePaymentMethodService;
let usersRepository: InMemoryUsersRepository;
let userCreated: UserDTO;
let paymentMethodsCreated: PaymentMethodDTO[];
const totalTransactionsToCreate = 100;

describe('List payment methods service test', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    transactionsRepository = new InMemoryTransactionsRepository();
    paymentMethodsRepository = new InMemoryPaymentMethodsRepository();
    createAccountService = new CreateAccountService(usersRepository);
    createPaymentMethodService = new CreatePaymentMethodService(
      paymentMethodsRepository
    );
    listTransactionsService = new ListTransactionsService(
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

    for (let index = 0; index < totalTransactionsToCreate; index++) {
      if (index + 1 === totalTransactionsToCreate) {
        transactionsRepository.create({
          params: {
            userId: user.id,
          },
          data: {
            description: 'Dev Test Description Transaction',
            shopName: 'Dev Test Shop Fake',
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
      } else {
        transactionsRepository.create({
          params: {
            userId: user.id,
          },
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
      }
    }
  });

  it('should be able to list transactions', async () => {
    const { transactions } = await listTransactionsService.execute({
      params: { page: 1, userId: userCreated.id },
      filters: {
        description: '',
        shopName: '',
        paymentMethodsIds: [],
        transactionTypes: [],
      },
    });

    expect(transactions.data.length).equals(env.PAGINATION_PAGE_SIZE);
  });

  it('should be able to list transactions with pagination', async () => {
    const { transactions } = await listTransactionsService.execute({
      params: { page: 1, userId: userCreated.id },
      filters: { description: '', shopName: '' },
    });

    expect(transactions.data.length).equal(env.PAGINATION_PAGE_SIZE);
    expect(transactions.pagination).toEqual(
      expect.objectContaining({
        pageIndex: 1,
        totalPages: Math.ceil(
          totalTransactionsToCreate / env.PAGINATION_PAGE_SIZE
        ),
        totalCount: totalTransactionsToCreate,
        hasNextPage: true,
      })
    );
  });

  it('should be able to list transactions on next page', async () => {
    const { transactions } = await listTransactionsService.execute({
      params: { page: 2, userId: userCreated.id },
      filters: { description: '', shopName: '' },
    });

    expect(transactions.data.length).equal(env.PAGINATION_PAGE_SIZE);
    expect(transactions.pagination).toEqual(
      expect.objectContaining({
        pageIndex: 2,
        totalPages: Math.ceil(
          totalTransactionsToCreate / env.PAGINATION_PAGE_SIZE
        ),
        totalCount: totalTransactionsToCreate,
        hasNextPage: true,
      })
    );
  });

  it('should be able to list transactions with description filter', async () => {
    const { transactions } = await listTransactionsService.execute({
      params: {
        page: 1,
        userId: userCreated.id,
      },
      filters: {
        description: 'Dev Test',
        shopName: '',
      },
    });

    expect(transactions.data.length).equal(1);
    expect(transactions.data).toEqual([
      expect.objectContaining({
        description: 'Dev Test Description Transaction',
      }),
    ]);
  });

  it('should be able to list transactions with shop name filter', async () => {
    const { transactions } = await listTransactionsService.execute({
      params: {
        page: 1,
        userId: userCreated.id,
      },
      filters: {
        description: '',
        shopName: 'Dev Test',
      },
    });

    expect(transactions.data.length).equal(1);
    expect(transactions.data).toEqual([
      expect.objectContaining({
        shopName: 'Dev Test Shop Fake',
      }),
    ]);
  });

  it('should be able to list transactions with payment method filter', async () => {
    const { transactions } = await listTransactionsService.execute({
      params: {
        page: 1,
        userId: userCreated.id,
      },
      filters: {
        description: '',
        shopName: '',
        paymentMethodsIds: [paymentMethodsCreated[0]!.id],
      },
    });

    expect(transactions.data.length).toBeTruthy();
    expect(
      transactions.data.every(
        (transaction) =>
          transaction.paymentMethodId === paymentMethodsCreated[0]!.id
      )
    ).toBe(true);
  });

  it('should be able to list transactions with transaction type filter', async () => {
    const { transactions: expensesTransactions } =
      await listTransactionsService.execute({
        params: {
          page: 1,
          userId: userCreated.id,
        },
        filters: {
          description: '',
          shopName: '',
          transactionTypes: ['EXPENSES'],
        },
      });

    const { transactions: revenueTransactions } =
      await listTransactionsService.execute({
        params: {
          page: 1,
          userId: userCreated.id,
        },
        filters: {
          description: '',
          shopName: '',
          transactionTypes: ['REVENUE'],
        },
      });

    expect(expensesTransactions.data.length).toBeTruthy();
    expect(revenueTransactions.data.length).toBeTruthy();
    expect(
      expensesTransactions.data.every(
        (transaction) => transaction.transactionType === 'EXPENSES'
      )
    ).toBe(true);
    expect(
      revenueTransactions.data.every(
        (transaction) => transaction.transactionType === 'REVENUE'
      )
    ).toBe(true);
  });
});
