import type {
  ITransactionsRepository,
  ListTransactionsDTO,
  ListTransactionsType,
} from '@/repositories/@interfaces/transactions.interface';
import { PrismaTransactionsRepository } from '@/repositories/prisma/transactions.repository';

interface ListTransactionsResponse {
  transactions: ListTransactionsDTO;
}

export class ListTransactionsService {
  constructor(private transactionsRepository: ITransactionsRepository) {}

  async execute({
    params,
    filters,
  }: ListTransactionsType): Promise<ListTransactionsResponse> {
    const transactions = await this.transactionsRepository.getListByFilters({
      params,
      filters,
    });

    return { transactions };
  }
}

export const makeWithPrismaListTransactionsService = () => {
  const transactionsRepository = new PrismaTransactionsRepository();
  const listTransactionsService = new ListTransactionsService(
    transactionsRepository
  );
  return listTransactionsService;
};
