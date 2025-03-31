import { TransactionType } from '@prisma/client';
import { z } from 'zod';

import { paginationSchema } from './commons.interface';

const transactionTypeSchema = z.union([
  z.literal(TransactionType.EXPENSES),
  z.literal(TransactionType.REVENUE),
]);

const transactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  shopName: z.string(),
  amountInCents: z.number(),
  paymentAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  transactionType: transactionTypeSchema,
  userId: z.string(),
  paymentMethodId: z.string(),
});

const createTransactionSchema = z.object({
  description: z.string(),
  shopName: z.string(),
  amountInCents: z.number(),
  paymentAt: z.date(),
  transactionType: transactionTypeSchema,
  userId: z.string(),
  paymentMethodId: z.string(),
});

const listOfTransactions = z.object({
  data: z.array(transactionSchema),
  pagination: paginationSchema,
});

const getListParams = z.object({
  userId: z.string(),
  paymentMethodId: z.string(),
  description: z.string(),
  shopName: z.string(),
  transactionType: transactionTypeSchema,
  page: z.number(),
});

const findByIdParams = z.object({
  userId: z.string(),
  transactionId: z.string(),
});

const deleteParams = z.object({
  userId: z.string(),
  transactionId: z.string(),
});

type TransactionDTO = z.infer<typeof transactionSchema>;
type CreateTransactionDTO = z.infer<typeof transactionSchema>;
type ListOfTransactionsDTO = z.infer<typeof listOfTransactions>;

type ListOfTransactionsType = z.infer<typeof getListParams>;
type FindByIdTransactionType = z.infer<typeof findByIdParams>;
type DeleteTransactionType = z.infer<typeof deleteParams>;

interface ITransactionsRepository {
  create(data: CreateTransactionDTO): Promise<TransactionDTO>;
  update(data: CreateTransactionDTO): Promise<TransactionDTO>;
  findById(params: FindByIdTransactionType): Promise<TransactionDTO | null>;
  delete(params: DeleteTransactionType): Promise<string | null>;
  getListByFilters(
    params: ListOfTransactionsType
  ): Promise<ListOfTransactionsDTO>;
}

export {
  createTransactionSchema,
  deleteParams,
  findByIdParams,
  getListParams,
  listOfTransactions,
  transactionSchema,
  transactionTypeSchema,
};

export type {
  CreateTransactionDTO,
  DeleteTransactionType,
  FindByIdTransactionType,
  ITransactionsRepository,
  ListOfTransactionsDTO,
  ListOfTransactionsType,
  TransactionDTO,
};
