
// SERVIDOR EXPRESS - E-COMMERCE API

const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const Sentry = require('@sentry/node');
const swaggerSpecs = require('./config/swagger');
const { loggerMiddleware } = require('./middleware/logger');
const { apiLimiter, authLimiter, uploadLimiter } = require('./middleware/rateLimit');

const app = express();

// Railway & Production Support
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

// Sentry Initialization (Monitoramento)
if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
            // enable Express.js tracing
            new Sentry.Integrations.Express({ app }),
        ],
        tracesSampleRate: 1.0,
    });
    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());
    console.log('✅ Monitoramento Sentry ativado');
}

// MIDDLEWARES DE SEGURANÇA E CONFIGURAÇÃO

// Protege headers HTTP contra vulnerabilidades
app.use(helmet());

// Forçar HTTPS em Produção
if (isProduction) {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https' && !req.headers.host.includes('localhost')) {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    });
}

// Permite acesso de outros domínios (CORS para Frontend)
// Configurado dinamicamente baseado em variáveis de ambiente
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000,https://bazzarmz.shop,https://www.bazzarmz.shop').split(',');

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


// CONFIGURAR ROTAS

// Apply general API rate limiting
app.use(apiLimiter);

// Apply strict rate limiting to authentication routes
app.post('/api/usuarios/login', authLimiter);
app.post('/api/usuarios', authLimiter);

// Apply upload rate limiting
app.use('/api/upload', uploadLimiter);

// Mount routes
app.use('/api/usuarios', usuariosRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/itens-pedidos', itensRouter);
app.use('/api/upload', uploadsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Tratamento de rotas API não encontradas (antes do frontend)
app.use(/^\/api/, (req, res, next) => {
    next(new ErrorResponse('Rota de API não encontrada', 404));
});

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

// Servir Frontend em Produção
if (isProduction) {
    // Serve arquivos estáticos do build do React
    app.use(express.static(path.join(__dirname, '../frontEnd/dist')));

    // Qualquer outra rota retorna o index.html (para o React Router funcionar)
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontEnd/dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API funcionando (Modo Desenvolvimento)');
    });
}


// MIDDLEWARE DE ERRO (SEMPRE POR ÚLTIMO)

if (process.env.SENTRY_DSN) {
    app.use(Sentry.Handlers.errorHandler());
}

app.use(errorHandler);


// INICIALIZAR SERVIDOR

// Verificação de Segurança para Produção
if (isProduction) {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        console.warn('\x1b[31m%s\x1b[0m', '⚠️  PERIGO: JWT_SECRET está ausente ou é muito curto para produção! Use uma chave com pelo menos 32 caracteres.');
    }
}

if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(port, () => {
        console.log(`🚀 Servidor rodando em porta ${port} (${isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'})`);
        if (!isProduction) {
            console.log(`📚 API Docs: http://localhost:${port}/api-docs`);
            console.log(`❤️  Health: http://localhost:${port}/health`);
        }
    });

    // Graceful shutdown (Render/Docker)
    process.on('SIGTERM', () => {
        console.log('⏹️  SIGTERM recebido, encerrando servidor...');
        server.close(() => {
            console.log('✅ Servidor encerrado gracefully');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        console.log('⏹️  SIGINT recebido, encerrando servidor...');
        server.close(() => {
            console.log('✅ Servidor encerrado gracefully');
            process.exit(0);
        });
    });
}

module.exports = app; // Exporta para ser usado nos testes
