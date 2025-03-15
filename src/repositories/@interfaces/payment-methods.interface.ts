import { z } from 'zod';

const paymentMethodSchema = z.object({
  id: z.string(),
  userId: z.string(),
  description: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  transactions: z.array(z.object({})),
});

const createPaymentMethodSchema = z.object({
  description: z.string(),
  userId: z.string(),
});

type PaymentMethodDTO = z.infer<typeof paymentMethodSchema>;
type CreatePaymentMethodDTO = z.infer<typeof createPaymentMethodSchema>;

interface IPaymentMethodsRepository {
  create(data: CreatePaymentMethodDTO): Promise<PaymentMethodDTO>;
  findById(id: string): Promise<PaymentMethodDTO | null>;
  findByUserId(userId: string): Promise<PaymentMethodDTO[]>;
}

export { createPaymentMethodSchema, paymentMethodSchema };
export type {
  CreatePaymentMethodDTO,
  IPaymentMethodsRepository,
  PaymentMethodDTO,
};
