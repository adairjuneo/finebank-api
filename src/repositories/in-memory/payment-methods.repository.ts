import { randomUUID } from 'node:crypto';

import { env } from '@/env';

import type {
  CreatePaymentMethodDTO,
  IPaymentMethodsRepository,
  ListPaymentMethodsDTO,
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

  async getListByDescription(
    userId: string,
    description: string,
    page: number
  ): Promise<ListPaymentMethodsDTO> {
    const totalListPaymentMethods = this.paymentMethods.filter(
      (item) => item.userId === userId && item.description.includes(description)
    );

    const listPaymentMethodsPaginated = totalListPaymentMethods.slice(
      (page - 1) * env.PAGINATION_PAGE_SIZE,
      page * env.PAGINATION_PAGE_SIZE
    );

    const totalPagesOfPaymentMethods = Math.round(
      listPaymentMethodsPaginated.length / env.PAGINATION_PAGE_SIZE
    );

    const hasNextPageOfPaymentMethods =
      totalPagesOfPaymentMethods === page ? false : true;

    return {
      data: listPaymentMethodsPaginated,
      pagination: {
        pageIndex: page,
        totalPages: totalPagesOfPaymentMethods,
        totalCount: totalListPaymentMethods.length,
        hasNextPage: hasNextPageOfPaymentMethods,
      },
    };
  }
}
