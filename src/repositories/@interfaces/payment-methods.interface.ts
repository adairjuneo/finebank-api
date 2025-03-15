import { z } from 'zod';

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

const listPaymentMethods = z.object({
  data: z.array(paymentMethodSchema),
  pagination: z.object({
    pageIndex: z.number(),
    totalPages: z.number(),
    totalCount: z.number(),
    hasNextPage: z.boolean(),
  }),
});

type PaymentMethodDTO = z.infer<typeof paymentMethodSchema>;
type CreatePaymentMethodDTO = z.infer<typeof createPaymentMethodSchema>;
type ListPaymentMethodsDTO = z.infer<typeof listPaymentMethods>;

interface IPaymentMethodsRepository {
  create(data: CreatePaymentMethodDTO): Promise<PaymentMethodDTO>;
  findById(id: string): Promise<PaymentMethodDTO | null>;
  findByUserId(userId: string): Promise<PaymentMethodDTO[]>;
  getListByDescription(
    userId: string,
    description: string,
    page: number
  ): Promise<ListPaymentMethodsDTO>;
}

export { createPaymentMethodSchema, listPaymentMethods, paymentMethodSchema };
export type {
  CreatePaymentMethodDTO,
  IPaymentMethodsRepository,
  ListPaymentMethodsDTO,
  PaymentMethodDTO,
};
