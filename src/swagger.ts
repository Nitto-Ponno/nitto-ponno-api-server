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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./docs/auth.yaml"],
};

export default swaggerJsDoc(swaggerOptions);
