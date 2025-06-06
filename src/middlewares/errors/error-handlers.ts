import chalk from 'chalk';
import type { FastifyInstance } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  type ZodFastifySchemaValidationError,
} from 'fastify-type-provider-zod';
import { ZodError } from 'zod';

import { BadRequestError } from './bad-request.error';
import { InvalidCredentialsError } from './invalid-credentials.error';
import { ResourceNotFoundError } from './resource-not-found.error';
import { UnauthorizedError } from './unauthorized.error';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

const formatSchemaErrors = (errors?: ZodFastifySchemaValidationError[]) => {
  if (!errors) return {};
  let errorsFormatted: { [key: string]: string[] } = {};
  errors.forEach((error) => {
    const keyError = String(error?.params?.issue?.path?.[0]);
    const valueError = String(error?.message);

    errorsFormatted = {
      ...errorsFormatted,
      [keyError]: [valueError],
    };
  });

  return errorsFormatted;
};

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      errors: error.flatten().fieldErrors,
    });
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error.',
      errors: formatSchemaErrors(error.validation),
    });
  }

  if (isResponseSerializationError(error)) {
    return reply.status(500).send({
      message: 'Serialization error.',
      errors: error.cause.issues,
    });
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    });
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({
      message: error.message,
    });
  }

  if (error instanceof InvalidCredentialsError) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  if (error.code === 'P2025') {
    return reply.status(404).send({
      message: 'Resource Not Found.',
    });
  }

  console.error(chalk.redBright(error));

  return reply.status(500).send({
    message: error.message,
  });
};
