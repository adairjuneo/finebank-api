import type {
  CreateTransactionDTO,
  ITransactionsRepository,
  TransactionDTO,
} from '@/repositories/@interfaces/transactions.interface';
import { PrismaTransactionsRepository } from '@/repositories/prisma/transactions.repository';

interface CreateTransactionResponse {
  transaction: TransactionDTO;
}

export class CreateTransactionService {
  constructor(private transactionsRepository: ITransactionsRepository) {}

  async execute({
    data,
    params,
  }: CreateTransactionDTO): Promise<CreateTransactionResponse> {
    const transactionCreated = await this.transactionsRepository.create({
      data,
      params,
    });

    return { transaction: transactionCreated };
  }
}

export const makeWithPrismaCreateTransactionService = () => {
  const transactionsRepository = new PrismaTransactionsRepository();
  const transactionsService = new CreateTransactionService(
    transactionsRepository
  );

  return transactionsService;
};
