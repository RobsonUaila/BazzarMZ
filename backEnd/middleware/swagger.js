const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BazzarMZ E-commerce API',
      version: '1.0.0',
      description: 'API para a plataforma de e-commerce BazzarMZ, com gerenciamento de usuários, pedidos e produtos.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor de Desenvolvimento'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Para autenticar, insira o token JWT no formato: Bearer {token}'
        }
      },
      schemas: {
        Pedido: {
          type: 'object',
          properties: {
            idPedidos: { type: 'integer', description: 'O ID do pedido.' },
            idusuarios: { type: 'integer', description: 'O ID do usuário.' },
            status: { type: 'string', enum: ['pendente', 'processando', 'enviado', 'entregue', 'cancelado'] },
            total: { type: 'number', format: 'float' },
            data_pedido: { type: 'string', format: 'date-time' }
          },
          example: {
            idPedidos: 1,
            idusuarios: 1,
            status: 'pendente',
            total: 150.75,
            data_pedido: '2026-01-18T10:00:00.000Z'
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos de rotas
};

const specs = swaggerJsdoc(options);

module.exports = specs;