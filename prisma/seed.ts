import chalk from 'chalk';
import { faker } from '@faker-js/faker';
import { addDays, subDays } from 'date-fns';
import { Prisma, PrismaClient, TransactionType } from '@prisma/client';

import { HashAdapter } from '../src/adapters';
const hashPassword = new HashAdapter();

const prisma = new PrismaClient();

const seed = async () => {
  /**
   * Reset DB
   */

  await prisma.token.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.user.deleteMany();

  console.log(chalk.yellow('💾 Database reset with successful!'));

  /**
   * Creating Users
   */

  const passwordHashed = await hashPassword.createHash('123456');

  const [devTest, userOne, userTwo] = await prisma.$transaction([
    prisma.user.create({
      data: {
        name: 'Dev Test',
        email: 'adair_juneo@outlook.com',
        passwordHash: passwordHashed,
      },
    }),
    prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email({ provider: 'finebank.io' }),
        passwordHash: passwordHashed,
      },
    }),
    prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email({ provider: 'finebank.io' }),
        passwordHash: passwordHashed,
      },
    }),
  ]);

  console.log(chalk.green('👥 Users created with successful!'));

  /**
   * Creating Payment Methods
   */

  const paymentMethodsDevTest = await prisma.$transaction([
    prisma.paymentMethod.create({
      data: { description: 'Money', userId: devTest.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'Credit Card', userId: devTest.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'Debit', userId: devTest.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'PIX', userId: devTest.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'PayPal', userId: devTest.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'Other', userId: devTest.id },
    }),
  ]);

  const paymentMethodsUserOne = await prisma.$transaction([
    prisma.paymentMethod.create({
      data: { description: 'Money', userId: userOne.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'Credit Card', userId: userOne.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'Debit', userId: userOne.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'PIX', userId: userOne.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'PayPal', userId: userOne.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'Other', userId: userOne.id },
    }),
  ]);

  const paymentMethodsUserTwo = await prisma.$transaction([
    prisma.paymentMethod.create({
      data: { description: 'Money', userId: userTwo.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'Credit Card', userId: userTwo.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'Debit', userId: userTwo.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'PIX', userId: userTwo.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'PayPal', userId: userTwo.id },
    }),
    prisma.paymentMethod.create({
      data: { description: 'Other', userId: userTwo.id },
    }),
  ]);

  const paymentMethodsIdsDevTest = paymentMethodsDevTest.map(
    (paymentMethod) => paymentMethod.id
  );
  const paymentMethodsIdsUserOne = paymentMethodsUserOne.map(
    (paymentMethod) => paymentMethod.id
  );
  const paymentMethodsIdsUserTwo = paymentMethodsUserTwo.map(
    (paymentMethod) => paymentMethod.id
  );

  console.log(chalk.green('💳 Payment Methods created with successful!'));

  /**
   * Creating Transactions
   */

  const transactionsList: Prisma.TransactionCreateManyInput[] = [];

  for (let index = 0; index < 250; index++) {
    transactionsList.push({
      description: faker.finance.transactionDescription(),
      shopName: faker.company.name(),
      paymentMethodId: faker.helpers.arrayElement(paymentMethodsIdsDevTest),
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
      userId: devTest.id,
    });
  }

  for (let index = 0; index < 250; index++) {
    transactionsList.push({
      description: faker.finance.transactionDescription(),
      shopName: faker.company.name(),
      paymentMethodId: faker.helpers.arrayElement(paymentMethodsIdsUserOne),
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
      userId: userOne.id,
    });
  }

  for (let index = 0; index < 250; index++) {
    transactionsList.push({
      description: faker.finance.transactionDescription(),
      shopName: faker.company.name(),
      paymentMethodId: faker.helpers.arrayElement(paymentMethodsIdsUserTwo),
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
      userId: userTwo.id,
    });
  }

  await prisma.transaction.createMany({ data: transactionsList });

  console.log(chalk.green('📊 Transactions created with successful!'));
};

/**
 * End of Seed
 */
seed()
  .then(() => {
    console.log(chalk.greenBright('💾 Database seeded with successful!'));
  })
  .finally(() => {
    process.exit();
  });
