
// SERVIDOR EXPRESS - E-COMMERCE API


const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const { loggerMiddleware } = require('./middleware/logger');
const { apiLimiter, authLimiter, uploadLimiter } = require('./middleware/rateLimit');

const app = express();


// MIDDLEWARES DE SEGURANÇA E CONFIGURAÇÃO

// Protege headers HTTP contra vulnerabilidades
app.use(helmet());

// Permite acesso de outros domínios (CORS para Frontend)
// Configurado dinamicamente baseado em variáveis de ambiente
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests without origin (like mobile apps or Postman)
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Middleware de log de requisições
app.use(loggerMiddleware);

// Interpreta requisições com JSON no body
app.use(express.json());

// Serve arquivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));


// IMPORTAR ROTAS


const usuariosRouter = require('./routes/usuarios');
const pedidosRouter = require('./routes/pedidos');
const itensRouter = require('./routes/itensPedidos');
const uploadsRouter = require('./routes/uploads');
const ErrorResponse = require('./utils/ErrorResponse');
const errorHandler = require('./middleware/error');


// ROTA DE TESTE


app.get('/', (req, res) => {
    res.send('API funcionando');
});


// CONFIGURAR ROTAS

// Apply general API rate limiting
app.use(apiLimiter);

// Apply strict rate limiting to authentication routes
app.post('/usuarios/login', authLimiter);
app.post('/usuarios', authLimiter);

// Apply upload rate limiting
app.use('/upload', uploadLimiter);

// Mount routes
app.use('/usuarios', usuariosRouter);
app.use('/pedidos', pedidosRouter);
app.use('/itens-pedidos', itensRouter);
app.use('/upload', uploadsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health check endpoint (not rate limited)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});


// TRATAMENTO DE ROTAS NÃO ENCONTRADAS (404)


app.use((req, res, next) => {
    next(new ErrorResponse('Rota não encontrada', 404));
});


// MIDDLEWARE DE ERRO (SEMPRE POR ÚLTIMO)


app.use(errorHandler);


// INICIALIZAR SERVIDOR


const PORT = process.env.PORT || 3000;

// Verificação de Segurança para Produção
if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        console.warn('\x1b[31m%s\x1b[0m', '⚠️  PERIGO: JWT_SECRET está ausente ou é muito curto para produção! Use uma chave com pelo menos 32 caracteres.');
    }
}

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

module.exports = app; // Exporta para ser usado nos testes
