import type {
  IPaymentMethodsRepository,
  ListPaymentMethodsDTO,
} from '@/repositories/@interfaces/payment-methods.interface';
import { PrismaPaymentMethodsRepository } from '@/repositories/prisma/payment-methods.repository';

interface ListPaymentMethodsRequest {
  userId: string;
  page: number;
  description?: string;
}

interface ListPaymentMethodsResponse {
  paymentMethods: ListPaymentMethodsDTO;
}

export class ListPaymentMethodsService {
  constructor(private paymentMethodsRepository: IPaymentMethodsRepository) {}

  async execute(
    data: ListPaymentMethodsRequest
  ): Promise<ListPaymentMethodsResponse> {
    const { userId, page, description } = data;

    const paymentMethods =
      await this.paymentMethodsRepository.getListByDescription({
        page,
        userId,
        description,
      });

    return { paymentMethods };
  }
}

export const makeWithPrismaListPaymentMethodsService = () => {
  const paymentMethodsRepository = new PrismaPaymentMethodsRepository();
  const listPaymentMethodsService = new ListPaymentMethodsService(
    paymentMethodsRepository
  );
  return listPaymentMethodsService;
};
