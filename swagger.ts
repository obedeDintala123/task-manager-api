import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Configurações principais do Swagger
const options = {
  definition: {
    openapi: "3.0.0", // versão do OpenAPI
    info: {
      title: "Tasking API", // nome da sua API
      version: "1.0.0", // versão da API
      description: "Documentação da minha API com Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000", // URL base da API
      },
    ],
  },
  apis: ["./routes/*.ts"], // onde estão suas rotas (ajuste o caminho)
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
