// src/swagger.ts
import { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tradved User Management",
      version: "1.0.0",
      description: "Tradved User Management",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./dist/routes/*.js", "./dist/controllers/*.js", "./dist/dto/*.js"], // Files containing annotations
};

export default options;
