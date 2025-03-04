export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Unauthorized, token is missing or invalid.');
  }
}
