import { env } from '@/env';
import { prisma } from '@/lib/prisma';

import type {
  CreatePaymentMethodDTO,
  IPaymentMethodsRepository,
  ListPaymentMethodsDTO,
  PaymentMethodDTO,
} from '../@interfaces/payment-methods.interface';

export class PrismaPaymentMethodsRepository
  implements IPaymentMethodsRepository
{
  async create(data: CreatePaymentMethodDTO): Promise<PaymentMethodDTO> {
    const paymentMethod = await prisma.paymentMethod.create({
      data,
    });

    return paymentMethod;
  }

  async findById(id: string): Promise<PaymentMethodDTO | null> {
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: {
        id,
      },
    });

    return paymentMethod;
  }

  async findByUserId(userId: string): Promise<PaymentMethodDTO[]> {
    const paymentMethod = await prisma.paymentMethod.findMany({
      where: {
        userId,
      },
    });

    return paymentMethod;
  }

  async getListByDescription(params: {
    page: number;
    userId: string;
    description?: string;
  }): Promise<ListPaymentMethodsDTO> {
    const { page, userId, description } = params;

    const prismaReturn = await prisma.$transaction([
      prisma.paymentMethod.count({
        where: {
          userId,
          description: {
            contains: description,
            mode: 'insensitive',
          },
        },
      }),
      prisma.paymentMethod.findMany({
        where: {
          userId,
          description: {
            contains: description,
            mode: 'insensitive',
          },
        },
        orderBy: {
          description: 'desc',
        },
        take: env.PAGINATION_PAGE_SIZE,
        skip: (page - 1) * env.PAGINATION_PAGE_SIZE,
      }),
    ]);

    const totalPagesOfPaymentMethods = Math.round(
      prismaReturn[0] / env.PAGINATION_PAGE_SIZE
    );

    const hasNextPageOfPaymentMethods =
      totalPagesOfPaymentMethods !== page ? false : true;

    return {
      data: prismaReturn[1],
      pagination: {
        pageIndex: page,
        totalPages: totalPagesOfPaymentMethods,
        totalCount: prismaReturn[0],
        hasNextPage: hasNextPageOfPaymentMethods,
      },
    };
  }
}
