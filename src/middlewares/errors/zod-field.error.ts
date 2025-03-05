import { ZodError } from 'zod';

export class ZodFieldError extends ZodError {
  constructor(field: string, message: string) {
    super([{ code: 'custom', path: [field], message }]);
  }
}
