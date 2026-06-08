import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { env } from './env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management System API',
      version: '1.0.0',
      description: 'API Documentation for the School Management System',
    },
    servers: [
      {
        url: `http://localhost:${env.server.port}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Look for Swagger annotations in route files and docs files
  apis: [
    './src/routes/*.js',
    './src/routes/**/*.js',
    './src/docs/*.js',
    './src/docs/**/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(
    `Swagger docs available at http://localhost:${env.server.port}/api-docs`
  );
};
