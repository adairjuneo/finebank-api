import { randomUUID } from 'node:crypto';

import _ from 'lodash';

import { env } from '@/env';

import type {
  CreateTransactionDTO,
  DeleteTransactionType,
  FindByIdTransactionType,
  ITransactionsRepository,
  ListTransactionsDTO,
  ListTransactionsType,
  TransactionDTO,
  UpdateTransactionDTO,
} from '../@interfaces/transactions.interface';

export class InMemoryTransactionsRepository implements ITransactionsRepository {
  public transactions: TransactionDTO[] = [];

  async create({
    data,
    params,
  }: CreateTransactionDTO): Promise<TransactionDTO> {
    const transaction: TransactionDTO = {
      id: randomUUID(),
      userId: params.userId,
      description: data.description,
      shopName: data.shopName,
      amountInCents: data.amountInCents,
      paymentAt: data.paymentAt,
      createdAt: new Date(),
      updatedAt: new Date(),
      transactionType: data.transactionType,
      paymentMethodId: data.paymentMethodId,
    };

    this.transactions.push(transaction);

    return transaction;
  }

  async update({
    data,
    params,
  }: UpdateTransactionDTO): Promise<TransactionDTO> {
    const newTransactions = this.transactions.map((transaction) => {
      if (
        transaction.id === params.id &&
        transaction.userId === params.userId
      ) {
        return { ...transaction, ...data };
      }
      return { ...transaction };
    });

    this.transactions = newTransactions;

    const transactionUpdated = this.transactions.find(
      (transaction) =>
        transaction.id === params.id && transaction.userId === params.userId
    );

    return transactionUpdated!;
  }

  async findById(
    params: FindByIdTransactionType
  ): Promise<TransactionDTO | null> {
    const transaction = this.transactions.find(
      (transaction) =>
        transaction.id === params.transactionId &&
        transaction.userId === params.userId
    );

    return transaction ?? null;
  }

  async delete(params: DeleteTransactionType): Promise<string> {
    const newTransactions = this.transactions.filter(
      (transaction) =>
        transaction.id !== params.transactionId &&
        transaction.userId !== params.userId
    );

    this.transactions = newTransactions;

    return params.transactionId;
  }

  async getListByFilters({
    params,
    filters,
  }: ListTransactionsType): Promise<ListTransactionsDTO> {
    const listOfAllTransactions = _.filter(this.transactions, (item) => {
      const descriptionFilter =
        _.isEmpty(item.description) ||
        _.includes(_.toLower(item.description), _.toLower(filters.description));
      const shopNameFilter =
        _.isEmpty(item.shopName) ||
        _.includes(_.toLower(item.shopName), _.toLower(filters.shopName));
      const paymentMethodsFilter =
        _.isEmpty(filters.paymentMethodsIds) ||
        _.includes(filters.paymentMethodsIds, item.paymentMethodId);
      const transactionTypesFilter =
        _.isEmpty(filters.transactionTypes) ||
        _.includes(filters.transactionTypes, item.transactionType);

      return (
        descriptionFilter &&
        shopNameFilter &&
        paymentMethodsFilter &&
        transactionTypesFilter
      );
    });

    const transactionsPaginated = listOfAllTransactions.slice(
      (params.page - 1) * env.PAGINATION_PAGE_SIZE,
      params.page * env.PAGINATION_PAGE_SIZE
    );
    const totalCount = listOfAllTransactions.length;
    const totalPagesOfTransactions = Math.ceil(
      totalCount / env.PAGINATION_PAGE_SIZE
    );
    const hasNextPageOfTransactions =
      totalPagesOfTransactions > params.page ? true : false;

    return {
      data: transactionsPaginated,
      pagination: {
        pageIndex: params.page,
        totalCount: totalCount,
        totalPages: totalPagesOfTransactions,
        hasNextPage: hasNextPageOfTransactions,
      },
    };
  }
}
