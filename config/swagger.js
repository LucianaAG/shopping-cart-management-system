// ./config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0", // <- obligatorio, aquí defines la versión
    info: {
      title: "Shopping Cart Management System API",
      version: "1.0.0",
      description: "Documentación de la API del sistema de carrito de compras",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"], // aquí se leen los comentarios @swagger en tus rutas
};

const specs = swaggerJsdoc(options);

module.exports = specs;