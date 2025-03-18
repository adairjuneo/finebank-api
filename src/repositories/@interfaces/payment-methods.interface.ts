import { z } from 'zod';

import { paginationSchema } from './commons.interface';

const paymentMethodSchema = z.object({
  id: z.string(),
  userId: z.string(),
  description: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  transactions: z.array(z.object({})).optional(),
});

const createPaymentMethodSchema = z.object({
  description: z.string(),
  userId: z.string(),
});

const listPaymentMethodsSchema = z.object({
  data: z.array(paymentMethodSchema),
  pagination: paginationSchema,
});

type PaymentMethodDTO = z.infer<typeof paymentMethodSchema>;
type CreatePaymentMethodDTO = z.infer<typeof createPaymentMethodSchema>;
type ListPaymentMethodsDTO = z.infer<typeof listPaymentMethodsSchema>;

interface IPaymentMethodsRepository {
  create(data: CreatePaymentMethodDTO): Promise<PaymentMethodDTO>;
  findById(id: string): Promise<PaymentMethodDTO | null>;
  findByUserId(userId: string): Promise<PaymentMethodDTO[]>;
  getListByDescription(params: {
    userId: string;
    description?: string;
    page: number;
  }): Promise<ListPaymentMethodsDTO>;
}

export {
  createPaymentMethodSchema,
  listPaymentMethodsSchema,
  paymentMethodSchema,
};
export type {
  CreatePaymentMethodDTO,
  IPaymentMethodsRepository,
  ListPaymentMethodsDTO,
  PaymentMethodDTO,
};
