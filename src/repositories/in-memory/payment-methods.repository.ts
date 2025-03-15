import { randomUUID } from 'node:crypto';

import type {
  CreatePaymentMethodDTO,
  IPaymentMethodsRepository,
  PaymentMethodDTO,
} from '../@interfaces/payment-methods.interface';

export class InMemoryPaymentMethodsRepository
  implements IPaymentMethodsRepository
{
  public paymentMethods: PaymentMethodDTO[] = [];

  async create(data: CreatePaymentMethodDTO): Promise<PaymentMethodDTO> {
    const paymentMethod: PaymentMethodDTO = {
      id: randomUUID(),
      description: data.description,
      transactions: [],
      userId: data.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.paymentMethods.push(paymentMethod);

    return paymentMethod;
  }

  async findById(id: string): Promise<PaymentMethodDTO | null> {
    const paymentMethod =
      this.paymentMethods.find((paymentMethod) => paymentMethod.id === id) ??
      null;

    return paymentMethod;
  }

  async findByUserId(userId: string): Promise<PaymentMethodDTO[]> {
    const paymentMethods = this.paymentMethods.filter(
      (paymentMethod) => paymentMethod.userId === userId
    );

    return paymentMethods;
  }
}
