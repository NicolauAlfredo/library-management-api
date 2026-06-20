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

    "/books": {
      get: {
        tags: ["Books"],
        summary: "Get all books",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              example: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              example: 10,
            },
          },
          {
            name: "search",
            in: "query",
            required: false,
            schema: {
              type: "string",
              example: "clean",
            },
          },
          {
            name: "category",
            in: "query",
            required: false,
            schema: {
              type: "string",
              example: "Software Engineering",
            },
          },
          {
            name: "available",
            in: "query",
            required: false,
            schema: {
              type: "boolean",
              example: true,
            },
          },
        ],
        responses: {
          "200": {
            description: "Books fetched successfully",
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },

      post: {
        tags: ["Books"],
        summary: "Create a new book",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "author", "quantity"],
                properties: {
                  title: {
                    type: "string",
                    example: "Clean Code",
                  },
                  author: {
                    type: "string",
                    example: "Robert C. Martin",
                  },
                  category: {
                    type: "string",
                    example: "Software Engineering",
                  },
                  isbn: {
                    type: "string",
                    example: "9780132350884",
                  },
                  quantity: {
                    type: "number",
                    example: 5,
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Book created successfully",
          },
          "400": {
            description: "Invalid book data",
          },
          "401": {
            description: "Unauthorized",
          },
          "403": {
            description: "Admin access required",
          },
        },
      },
    },

    "/books/{id}": {
      get: {
        tags: ["Books"],
        summary: "Get book by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        responses: {
          "200": {
            description: "Book fetched successfully",
          },
          "404": {
            description: "Book not found",
          },
        },
      },

      put: {
        tags: ["Books"],
        summary: "Update book by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    example: "Clean Code - Updated Edition",
                  },
                  author: {
                    type: "string",
                    example: "Robert C. Martin",
                  },
                  category: {
                    type: "string",
                    example: "Software Engineering",
                  },
                  isbn: {
                    type: "string",
                    example: "9780132350884",
                  },
                  quantity: {
                    type: "number",
                    example: 10,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Book updated successfully",
          },
          "400": {
            description: "Invalid book data",
          },
          "403": {
            description: "Admin access required",
          },
          "404": {
            description: "Book not found",
          },
        },
      },

      delete: {
        tags: ["Books"],
        summary: "Delete book by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        responses: {
          "200": {
            description: "Book deleted successfully",
          },
          "403": {
            description: "Admin access required",
          },
          "404": {
            description: "Book not found",
          },
        },
      },
    },

    "/loans": {
      get: {
        tags: ["Loans"],
        summary: "Get all loans",
        description: "Admin-only endpoint to list all loans.",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Loans fetched successfully",
          },
          "401": {
            description: "Unauthorized",
          },
          "403": {
            description: "Admin access required",
          },
        },
      },
    },

    "/loans/my": {
      get: {
        tags: ["Loans"],
        summary: "Get authenticated user's loans",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "User loans fetched successfully",
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },

    "/loans/borrow/{bookId}": {
      post: {
        tags: ["Loans"],
        summary: "Borrow a book",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "bookId",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        responses: {
          "201": {
            description: "Book borrowed successfully",
          },
          "400": {
            description:
              "Book unavailable, duplicate active loan or invalid data",
          },
          "401": {
            description: "Unauthorized",
          },
        },
      },
    },

    "/loans/{id}/return": {
      patch: {
        tags: ["Loans"],
        summary: "Return a borrowed book",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        responses: {
          "200": {
            description: "Book returned successfully",
          },
          "400": {
            description: "Loan already returned or invalid operation",
          },
          "401": {
            description: "Unauthorized",
          },
          "404": {
            description: "Loan not found",
          },
        },
      },
    },

    "/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        description: "Admin-only endpoint to list all registered users.",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Users fetched successfully",
          },
          "401": {
            description: "Unauthorized",
          },
          "403": {
            description: "Admin access required",
          },
        },
      },
    },

    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by id",
        description: "Admin-only endpoint to get a specific user.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              example: 1,
            },
          },
        ],
        responses: {
          "200": {
            description: "User fetched successfully",
          },
          "401": {
            description: "Unauthorized",
          },
          "403": {
            description: "Admin access required",
          },
          "404": {
            description: "User not found",
          },
        },
      },
    },
  },
};
