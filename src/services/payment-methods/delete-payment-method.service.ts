import { ResourceNotFoundError } from '@/middlewares/errors/resource-not-found.error';
import type { IPaymentMethodsRepository } from '@/repositories/@interfaces/payment-methods.interface';
import { PrismaPaymentMethodsRepository } from '@/repositories/prisma/payment-methods.repository';

interface DeletePaymentServiceRequest {
  userId: string;
  paymentMethodId: string;
}

interface DeletePaymentServiceResponse {
  paymentMethodId: string;
}

export class DeletePaymentMethodService {
  constructor(private paymentMethodsRepository: IPaymentMethodsRepository) {}

  async execute(
    data: DeletePaymentServiceRequest
  ): Promise<DeletePaymentServiceResponse> {
    const { userId, paymentMethodId } = data;

    const idOfPaymentMethodDeleted = await this.paymentMethodsRepository.delete(
      userId,
      paymentMethodId
    );

    if (!idOfPaymentMethodDeleted) {
      throw new ResourceNotFoundError();
    }

    return { paymentMethodId: idOfPaymentMethodDeleted };
  }
}

export const makeWithPrismaDeletePaymentService = () => {
  const paymentMethodsRepository = new PrismaPaymentMethodsRepository();
  const deletePaymentMethodService = new DeletePaymentMethodService(
    paymentMethodsRepository
  );

  return deletePaymentMethodService;
};
