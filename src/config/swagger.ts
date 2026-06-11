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
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: {
                    type: "string",
                    example: "João Silva",
                  },
                  email: {
                    type: "string",
                    example: "joao.silva@example.com",
                  },
                  password: {
                    type: "string",
                    example: "Password123!",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully",
          },
          "400": {
            description: "Invalid data or user already exists",
          },
        },
      },
    },

    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    example: "joao.silva@example.com",
                  },
                  password: {
                    type: "string",
                    example: "Password123!",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
          },
          "401": {
            description: "Invalid email or password",
          },
        },
      },
    },

    "/auth/profile": {
      get: {
        tags: ["Auth"],
        summary: "Get authenticated user profile",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "Authenticated user profile",
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },
  },
};
