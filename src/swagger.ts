import swaggerJsDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsDoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.3", // YOU NEED THIS
    info: {
      title: "REST API for Nitto Ponno", // Title of the documentation
      version: "1.0.0", // Version of the app
      description: "This is the REST API for Nitto Ponno", // short description of the app
    },
    servers: [
      {
        url: "/api/v1",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description:
          "Operations related to user authentication and session management",
      },
      {
        name: "User",
        description: "User management endpoints",
      },
      {
        name: "Roles",
        description: "Role management endpoints",
      },
      {
        name: "Category",
        description: "Category management endpoints",
      },
      {
        name: "Laundry Services",
        description:
          " Manage laundry service types (wash, dry-clean, iron, etc.)",
      },
      {
        name: "Laundry Attributes",
        description:
          "Manage reusable laundry attribute types (e.g., Fabric Care, Fold Style) with selectable options",
      },
      {
        name: "Product",
        description: "Product management endpoints with variations support",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "basic",
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
  apis: ["./docs/*.yaml"],
};

export default swaggerJsDoc(swaggerOptions);
