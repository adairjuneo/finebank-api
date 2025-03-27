import { ResourceNotFoundError } from '@/middlewares/errors/resource-not-found.error';
import { ZodFieldError } from '@/middlewares/errors/zod-field.error';
import type {
  IPaymentMethodsRepository,
  PaymentMethodDTO,
} from '@/repositories/@interfaces/payment-methods.interface';
import { PrismaPaymentMethodsRepository } from '@/repositories/prisma/payment-methods.repository';

interface UpdatePaymentMethodServiceRequest {
  userId: string;
  description: string;
  paymentMethodId: string;
}

interface UpdatePaymentMethodServiceResponse {
  paymentMethod: PaymentMethodDTO;
}

export class UpdatePaymentMethodService {
  constructor(private paymentMethodsRepository: IPaymentMethodsRepository) {}

  async execute(
    data: UpdatePaymentMethodServiceRequest
  ): Promise<UpdatePaymentMethodServiceResponse> {
    const { userId, description, paymentMethodId } = data;

    const existThisPaymentMethodById =
      await this.paymentMethodsRepository.findById(paymentMethodId);

    if (!existThisPaymentMethodById) {
      throw new ResourceNotFoundError();
    }

    const existAnotherWithSameDescription =
      await this.paymentMethodsRepository.findByDescription(
        userId,
        description
      );

    if (existAnotherWithSameDescription) {
      throw new ZodFieldError(
        'description',
        'Already exist another payment method with this description.'
      );
    }

    const paymentMethod = await this.paymentMethodsRepository.update(
      paymentMethodId,
      { userId, description }
    );

    return { paymentMethod };
  }
}

export const makeWithPrismaUpdatePaymentMethodService = () => {
  const paymentMethodsRepository = new PrismaPaymentMethodsRepository();
  const updatePaymentMethodService = new UpdatePaymentMethodService(
    paymentMethodsRepository
  );

  return updatePaymentMethodService;
};
