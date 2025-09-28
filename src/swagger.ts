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
      //   {
      //     name: "Category",
      //     description: "Category management endpoints",
      //   },
      //   {
      //     name: "Blog",
      //     description: "Blog category management endpoints",
      //   },
      //   {
      //     name: "Reviews",
      //     description: "Operations related to course reviews",
      //   },
      //   {
      //     name: "Users",
      //     description: "Operations related to user management",
      //   },
      //   {
      //     name: "Admin Courses",
      //     description:
      //       "Operations related to course management for administrators",
      //   },
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
    //host: 'localhost:5003', // the host or url of the app
    // basePath: '/api',
  },
  //apis: ['src/docs/**/*.yaml']
  apis: [],
};

export default swaggerJsDoc(swaggerOptions);
