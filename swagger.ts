import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Tasking API",
      version: "1.0.0",
      description: "API documentation for Tasking application",
    },

    servers: [
      {
        url: "http://localhost:5106/api/v1",
      },
    ],

    tags: [
      {
        name: "Users",
        description: "User related endpoints",
      },
      {
        name: "Auth",
        description: "Authentication related endpoints",
      },
      {
        name: "Tasks",
        description: "Task related endpoints",
      },

      {
        name: "Teams",
        description: "Team related endpoints",
      },
    ],

    paths: {
      "/me": {
        get: {
          tags: ["Users"],
          summary: "Get authenticated user",
          description:
            "Returns the currently authenticated user with team and tasks information.",
          security: [
            {
              cookieAuth: [],
            },
          ],
          responses: {
            200: {
              description: "User retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
            401: {
              description: "Unauthorized",
            },
            404: {
              description: "User not found",
            },
            500: {
              description: "Internal server error",
            },
          },
        },
      },

      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "User login",
          description: "Authenticates a user with email and password.",
          security: [
            {
              cookieAuth: [],
            },
          ],
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
                    },
                    password: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },

      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "User register",
          description: "Registers a new user.",
          security: [
            {
              cookieAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "firstName",
                    "lastName",
                    "email",
                    "password",
                    "phone",
                    "teamId",
                  ],
                  properties: {
                    firstName: {
                      type: "string",
                    },
                    lastName: {
                      type: "string",
                    },
                    email: {
                      type: "string",
                    },
                    password: {
                      type: "string",
                    },
                    phone: {
                      type: "string",
                    },
                    teamId: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },

      "/task": {
        get: {
          tags: ["Tasks"],
          summary: "Get tasks",
          description:
            "Return all tasks or filter by status using query parameter.",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "status",
              in: "query",
              description: "Filter tasks by status (TO_DO, IN_PROGRESS, DONE)",
              required: false,
              schema: {
                type: "string",
                enum: ["TO_DO", "IN_PROGRESS", "DONE"],
              },
            },
          ],
          responses: {
            200: {
              description: "Tasks retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Task" },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            404: { description: "Tasks not found" },
            500: { description: "Internal server error" },
          },
        },
        post: {
          tags: ["Tasks"],
          summary: "Create a new task",
          description: "Create a new task.",
          security: [
            {
              cookieAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "title",
                    "description",
                    "status",
                    "priority",
                    "startDate",
                    "endDate",
                    "startHour",
                    "endHour",
                    "userId",
                  ],

                  properties: {
                    title: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                    status: {
                      type: "string",
                      enum: ["TODO", "IN_PROGRESS", "DONE"],
                    },
                    priority: {
                      type: "string",
                      enum: ["LOW", "MEDIUM", "HIGH"],
                    },
                    startDate: {
                      type: "string",
                      format: "date-time",
                    },
                    endDate: {
                      type: "string",
                      format: "date-time",
                    },
                    startHour: {
                      type: "string",
                    },
                    endHour: {
                      type: "string",
                    },
                    userId: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },

          responses: {
            201: {
              description: "Task created",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Task",
                  },
                },
              },

              400: {
                description: "Bad request",
              },
              401: {
                description: "Unauthorized",
              },
              500: {
                description: "Internal server error",
              },
            },
          },
        },
      },

      "/task/{id}": {
        get: {
          tags: ["Tasks"],
          summary: "Get task by ID",
          description: "Return task by ID.",
          security: [
            {
              cookieAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              description: "Task ID",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            200: {
              description: "Task found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Task",
                  },
                },
              },
            },

            401: {
              description: "Unauthorized",
            },
            404: {
              description: "Task not found",
            },
            500: {
              description: "Internal server error",
            },
          },
        },

        patch: {
          tags: ["Tasks"],
          summary: "Update task by ID",
          description: "Updates task data by its ID.",
          security: [
            {
              cookieAuth: [],
            },
          ],

          parameters: [
            {
              name: "id",
              in: "path",
              description: "Task ID",
              required: true,
              schema: {
                type: "string",
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
                    title: { type: "string" },
                    description: { type: "string" },
                    status: {
                      type: "string",
                      enum: ["TODO", "IN_PROGRESS", "DONE"],
                    },
                    priority: {
                      type: "string",
                      enum: ["LOW", "MEDIUM", "HIGH"],
                    },
                    startDate: { type: "string", format: "date-time" },
                    endDate: { type: "string", format: "date-time" },
                    startHour: { type: "string" },
                    endHour: { type: "string" },
                  },
                },
              },
            },
          },

          responses: {
            200: {
              description: "Task updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Task",
                  },
                },
              },
            },
            400: {
              description: "Invalid input",
            },
            401: {
              description: "Unauthorized",
            },
            404: {
              description: "Task not found",
            },
            500: {
              description: "Internal server error",
            },
          },
        },

        delete: {
          tags: ["Tasks"],
          summary: "Delete task by ID",
          description: "Deletes a task by its ID.",
          security: [
            {
              cookieAuth: [],
            },
          ],

          parameters: [
            {
              name: "id",
              in: "path",
              description: "Task ID",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Task deleted successfully",
            },
            401: {
              description: "Unauthorized",
            },
            404: {
              description: "Task not found",
            },
            500: {
              description: "Internal server error",
            },
          },
        },
      },

      "/task/{id}/status": {
        patch: {
          tags: ["Tasks"],
          summary: "Update task status",
          description: "Update task status.",
          security: [
            {
              cookieAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              description: "Task ID",
              required: true,
            },
            {
              name: "status",
              in: "body",
              description: "New task status",
              required: true,
            },
          ],

          responses: {
            200: {
              description: "Task status updated",
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      status: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },

            404: {
              description: "Task not found",
            },
            500: {
              description: "Internal server error",
            },
          },
        },
      },

      "/team": {
        get: {
          tags: ["Teams"],
          summary: "Get team of authenticated user",
          description:
            "Returns the team of the currently authenticated user, including members.",
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: "Team retrieved successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Team" },
                },
              },
            },
            401: { description: "Unauthorized" },
            404: { description: "Team not found" },
            500: { description: "Internal server error" },
          },
        },

        post: {
          tags: ["Teams"],
          summary: "Create a new team",
          description: "Creates a new team.",
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Team created successfully" },
            400: { description: "Invalid input" },
            401: { description: "Unauthorized" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/teams/{id}": {
        get: {
          tags: ["Teams"],
          summary: "Get all teams by ID",
          description: "Returns a team and its members by team ID.",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              description: "Team ID",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Team retrieved successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Team" },
                },
              },
            },
            401: { description: "Unauthorized" },
            404: { description: "Team not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/team/{id}": {
        patch: {
          tags: ["Teams"],
          summary: "Update team by ID",
          description: "Update team information by ID.",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Team ID",
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Team updated successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Team" },
                },
              },
            },
            400: { description: "Invalid input" },
            401: { description: "Unauthorized" },
            404: { description: "Team not found" },
            500: { description: "Internal server error" },
          },
        },
      },

      "/team/{id}/member": {
        patch: {
          tags: ["Teams"],
          summary: "Add member to team",
          description: "Add a new member to the specified team.",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Team ID",
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["firstName", "lastName", "email"],
                  properties: {
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    email: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Member added successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/UserSimple" },
                },
              },
            },
            400: { description: "Invalid input" },
            401: { description: "Unauthorized" },
            404: { description: "Team not found" },
            500: { description: "Internal server error" },
          },
        },
      },
    },

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            phone: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            team: { $ref: "#/components/schemas/Team" },
            tasks: {
              type: "array",
              items: { $ref: "#/components/schemas/Task" },
            },
          },
        },

        UserSimple: {
          type: "object",
          properties: {
            id: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string" },
          },
        },

        Team: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            users: {
              type: "array",
              items: { $ref: "#/components/schemas/UserSimple" },
            },
          },
        },

        Task: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            status: {
              type: "string",
              enum: ["TODO", "IN_PROGRESS", "DONE"],
            },
            priority: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH"],
            },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            startHour: { type: "string" },
            endHour: { type: "string" },
            userId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },

  apis: [],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
