import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import chalk from 'chalk';
import { fastify } from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { env } from './env';
import { appRoutes } from './http/routes';
import { errorHandler } from './middlewares/errors/error-handlers';

const app = fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler(errorHandler);

// Swagger Config
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Finebank.io API',
      description: 'API service for a Financial Management Dashboard.',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/',
  theme: {
    title: 'Finebank.io API',
  },
});

// JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '8h',
  },
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
});

// Multipart to upload files
// app.register(fastifyMultipart, {
//   limits: {
//     fileSize: 1 * 1024 * 1024 * 1024, // 1 Gb Max File Size
//   },
// });

// Cookies Handler
app.register(fastifyCookie);

// CORS Config and prefix routes
app.register(fastifyCors);

// Register all routes app
app.register(appRoutes);

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.info(
      String(chalk.greenBright('🔥 HTTP Server Running on ')).concat(
        chalk.yellowBright(`http://localhost:${env.PORT}`)
      )
    );
  });
