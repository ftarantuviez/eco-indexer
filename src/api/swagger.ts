import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eco Events API",
      version: "1.0.0",
      description: "API for querying blockchain events",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/api/routes/*.ts", "./src/api/controllers/*.ts"], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
