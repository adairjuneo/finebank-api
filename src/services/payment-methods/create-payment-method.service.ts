import { ZodFieldError } from '@/middlewares/errors/zod-field.error';
import type {
  IPaymentMethodsRepository,
  PaymentMethodDTO,
} from '@/repositories/@interfaces/payment-methods.interface';

interface CreatePaymentMethodServiceRequest {
  userId: string;
  description: string;
}

interface CreatePaymentMethodServiceResponse {
  paymentMethod: PaymentMethodDTO;
}

export class CreatePaymentMethodService {
  constructor(private paymentMethodsRepository: IPaymentMethodsRepository) {}

  async execute(
    data: CreatePaymentMethodServiceRequest
  ): Promise<CreatePaymentMethodServiceResponse> {
    const { userId, description } = data;

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

    const paymentMethod = await this.paymentMethodsRepository.create({
      userId,
      description,
    });

    return { paymentMethod };
  }
}
