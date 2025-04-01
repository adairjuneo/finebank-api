import type { Prisma } from '@prisma/client';

import { env } from '@/env';
import { prisma } from '@/lib/prisma';

import type {
  CreateTransactionDTO,
  DeleteTransactionType,
  FindByIdTransactionType,
  ITransactionsRepository,
  ListOfTransactionsDTO,
  ListOfTransactionsType,
  TransactionDTO,
  UpdateTransactionDTO,
} from '../@interfaces/transactions.interface';

export class PrismaTransactionsRepository implements ITransactionsRepository {
  async create({
    data,
    params,
  }: CreateTransactionDTO): Promise<TransactionDTO> {
    const transaction = await prisma.transaction.create({
      data: { ...data, ...params },
    });

    return transaction;
  }

  async update({
    data,
    params,
  }: UpdateTransactionDTO): Promise<TransactionDTO> {
    const transaction = await prisma.transaction.update({
      where: {
        id: params.id,
        userId: params.userId,
      },
      data: {
        description: data.description,
        shopName: data.shopName,
        amountInCents: data.amountInCents,
        paymentAt: data.paymentAt,
        paymentMethodId: data.paymentMethodId,
        transactionType: data.transactionType,
      },
    });

    return transaction;
  }

  async findById(
    params: FindByIdTransactionType
  ): Promise<TransactionDTO | null> {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: params.transactionId,
        userId: params.userId,
      },
    });

    return transaction;
  }

  async delete(params: DeleteTransactionType): Promise<string> {
    const transaction = await prisma.transaction.delete({
      where: {
        id: params.transactionId,
        userId: params.userId,
      },
      select: {
        id: true,
      },
    });

    return transaction.id;
  }

  async getListByFilters({
    params,
    filters,
  }: ListOfTransactionsType): Promise<ListOfTransactionsDTO> {
    const transactionsWhere: Prisma.TransactionWhereInput = {
      userId: params.userId,
      description: {
        contains: filters.description,
        mode: 'insensitive',
      },
      shopName: {
        contains: filters.shopName,
        mode: 'insensitive',
      },
      transactionType: {
        in: filters.transactionType,
      },
      paymentMethodId: {
        in: filters.paymentMethodId,
      },
    };

    const transactions = await prisma.$transaction([
      prisma.transaction.count({
        where: transactionsWhere,
      }),
      prisma.transaction.findMany({
        where: transactionsWhere,
        orderBy: {
          description: 'desc',
          createdAt: 'desc',
          amountInCents: 'desc',
        },
        take: env.PAGINATION_PAGE_SIZE,
        skip: (params.page - 1) * env.PAGINATION_PAGE_SIZE,
      }),
    ]);

    const listOfTransactions = transactions[1];
    const countOfTransactions = transactions[0];

    const totalPagesOfTransactions = Math.round(
      countOfTransactions / env.PAGINATION_PAGE_SIZE
    );

    const hasNextPageOfTransactions =
      totalPagesOfTransactions !== params.page ? false : true;

    return {
      data: listOfTransactions,
      pagination: {
        pageIndex: params.page,
        totalPages: totalPagesOfTransactions,
        totalCount: countOfTransactions,
        hasNextPage: hasNextPageOfTransactions,
      },
    };
  }
}
