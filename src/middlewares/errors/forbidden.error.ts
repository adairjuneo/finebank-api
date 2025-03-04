export class ForbiddenError extends Error {
  constructor() {
    super('Forbidden, you do not have permission to access this resource.');
  }
}
