import { OpenAPIV3 } from "openapi-types";

export const swaggerDocument: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Library Management API",
    version: "1.0.0",
    description:
      "REST API for managing users, books and loans in a library system.",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Development server",
    },
  ],
  tags: [
    {
      name: "Auth",
      description: "Authentication endpoints",
    },
    {
      name: "Books",
      description: "Book management endpoints",
    },
    {
      name: "Loans",
      description: "Loan management endpoints",
    },
    {
      name: "Users",
      description: "User management endpoints",
    },
  ],
  paths: {},
};
