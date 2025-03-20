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

  async getListByDescription(params: {
    page: number;
    userId: string;
    description?: string;
  }): Promise<ListPaymentMethodsDTO> {
    const { page, userId, description } = params;

    const totalListPaymentMethods = this.paymentMethods.filter(
      (item) =>
        item.userId === userId &&
        item.description
          .toLowerCase()
          .includes(description?.toLowerCase() ?? '')
    );

    const listPaymentMethodsPaginated = totalListPaymentMethods.slice(
      (page - 1) * env.PAGINATION_PAGE_SIZE,
      page * env.PAGINATION_PAGE_SIZE
    );

    const totalPagesOfPaymentMethods = Math.ceil(
      totalListPaymentMethods.length / env.PAGINATION_PAGE_SIZE
    );

    const hasNextPageOfPaymentMethods =
      totalPagesOfPaymentMethods > page ? true : false;

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
