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
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Books", description: "Book management endpoints" },
    { name: "Loans", description: "Loan management endpoints" },
    { name: "Users", description: "User management endpoints" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Book not found" },
        },
      },
      ValidationErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation error" },
          errors: {
            type: "object",
            example: {
              email: ["Invalid email"],
              password: ["Password must contain at least 6 characters"],
            },
          },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              user: { $ref: "#/components/schemas/User" },
              token: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "João Silva" },
          email: { type: "string", example: "joao.silva@example.com" },
          role: {
            type: "string",
            enum: ["ADMIN", "USER"],
            example: "USER",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Book: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Clean Code" },
          author: { type: "string", example: "Robert C. Martin" },
          category: { type: "string", example: "Software Engineering" },
          isbn: { type: "string", example: "9780132350884" },
          coverUrl: {
            type: "string",
            example:
              "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
          },
          quantity: { type: "integer", example: 5 },
          availableQuantity: { type: "integer", example: 3 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Loan: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          userId: { type: "integer", example: 2 },
          bookId: { type: "integer", example: 1 },
          loanDate: { type: "string", format: "date-time" },
          dueDate: { type: "string", format: "date-time" },
          returnedAt: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
          status: {
            type: "string",
            enum: ["ACTIVE", "RETURNED", "LATE"],
            example: "ACTIVE",
          },
        },
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          total: { type: "integer", example: 50 },
          totalPages: { type: "integer", example: 5 },
        },
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
                  name: { type: "string", example: "João Silva" },
                  email: {
                    type: "string",
                    example: "joao.silva@example.com",
                  },
                  password: { type: "string", example: "Password123!" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
              },
            },
          },
          "409": {
            description: "User already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user or admin",
        description:
          "The same login endpoint is used for both normal users and administrators.",
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
                    example: "admin.example@library.com",
                  },
                  password: { type: "string", example: "Password123!" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
              },
            },
          },
          "401": {
            description: "Invalid email or password",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/auth/profile": {
      get: {
        tags: ["Auth"],
        summary: "Get authenticated user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Authenticated user profile",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/auth/admin": {
      get: {
        tags: ["Auth"],
        summary: "Admin test route",
        description: "Protected route used to verify admin authorization.",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Admin access granted",
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

    "/books": {
      get: {
        tags: ["Books"],
        summary: "Get all books",
        description:
          "Supports pagination, search by title/author/ISBN, category filter and availability filter.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", example: 1 },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", example: 10 },
          },
          {
            name: "search",
            in: "query",
            required: false,
            schema: { type: "string", example: "clean" },
          },
          {
            name: "category",
            in: "query",
            required: false,
            schema: { type: "string", example: "Software Engineering" },
          },
          {
            name: "available",
            in: "query",
            required: false,
            schema: { type: "boolean", example: true },
          },
        ],
        responses: {
          "200": {
            description: "Books fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Book" },
                    },
                    pagination: {
                      $ref: "#/components/schemas/Pagination",
                    },
                  },
                },
              },
            },
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
                  title: { type: "string", example: "Clean Code" },
                  author: { type: "string", example: "Robert C. Martin" },
                  category: {
                    type: "string",
                    example: "Software Engineering",
                  },
                  isbn: { type: "string", example: "9780132350884" },
                  coverUrl: {
                    type: "string",
                    example:
                      "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
                  },
                  quantity: { type: "integer", example: 5 },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Book created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Book" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Validation error",
          },
          "403": {
            description: "Admin access required",
          },
          "409": {
            description: "Book with this ISBN already exists",
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
            schema: { type: "integer", example: 1 },
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
            schema: { type: "integer", example: 1 },
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
                  author: { type: "string", example: "Robert C. Martin" },
                  category: {
                    type: "string",
                    example: "Software Engineering",
                  },
                  isbn: { type: "string", example: "9780132350884" },
                  coverUrl: {
                    type: "string",
                    example:
                      "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
                  },
                  quantity: { type: "integer", example: 10 },
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
            description: "Validation error",
          },
          "403": {
            description: "Admin access required",
          },
          "404": {
            description: "Book not found",
          },
          "409": {
            description: "Book with this ISBN already exists",
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
            schema: { type: "integer", example: 1 },
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
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Loan" },
                    },
                  },
                },
              },
            },
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
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          "201": {
            description: "Book borrowed successfully",
          },
          "404": {
            description: "User or book not found",
          },
          "409": {
            description:
              "Book unavailable or user already has an active loan for this book",
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
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          "200": {
            description: "Book returned successfully",
          },
          "403": {
            description: "Cannot return another user's loan",
          },
          "404": {
            description: "Loan not found",
          },
          "409": {
            description: "Loan already returned",
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
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          "200": {
            description: "User fetched successfully",
          },
          "404": {
            description: "User not found",
          },
        },
      },

      put: {
        tags: ["Users"],
        summary: "Update user by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "João Updated" },
                  email: {
                    type: "string",
                    example: "joao.updated@example.com",
                  },
                  role: {
                    type: "string",
                    enum: ["ADMIN", "USER"],
                    example: "USER",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User updated successfully",
          },
          "400": {
            description: "Validation error",
          },
          "403": {
            description: "Admin access required",
          },
          "404": {
            description: "User not found",
          },
        },
      },

      delete: {
        tags: ["Users"],
        summary: "Delete user by id",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 },
          },
        ],
        responses: {
          "200": {
            description: "User deleted successfully",
          },
          "403": {
            description: "Admin access required or cannot delete own account",
          },
          "404": {
            description: "User not found",
          },
        },
      },
    },
  },
};
