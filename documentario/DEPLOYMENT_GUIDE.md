# 🚀 GUIA COMPLETO DE DEPLOYMENT - E-COMMERCE

**Data:** 21 de Janeiro de 2026  
**Status:** 80% Pronto (3 issues críticos foram corrigidos)

---

## 📋 RESUMO DAS CORREÇÕES REALIZADAS

### ✅ Problemas Corrigidos

1. **URL API Hardcoded** ✓
   - Alterado de: `baseURL: "http://localhost:3000/api"`
   - Para: `baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api"`
   - Arquivo: `frontEnd/src/services/api.js`

2. **Arquivo toast,.js com nome inválido** ✓
   - Criado novo: `frontEnd/src/utils/toast.js`
   - Corrigidos imports em: `Login.jsx` e `ProductRegistration.jsx`
   - Função: `toastSucess` → `toastSuccess`

3. **Falta de configuração para variáveis de ambiente (Frontend)** ✓
   - Criado: `frontEnd/.env.example`
   - Instruções para criar `.env.local`

---

## 🛠️ PASSO A PASSO - LOCAL (Desenvolvimento)

### 1️⃣ Instalar Dependências

```bash
# Backend
cd backEnd
npm install

# Frontend (em outro terminal)
cd frontEnd
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente

**Backend** - Já está pronto (verifique `backEnd/.env`):
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bazarmz
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRE=30d
BCRYPT_SALT_ROUNDS=10
```

**Frontend** - Crie `frontEnd/.env.local`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
```

### 3️⃣ Executar Testes

```bash
# Windows (PowerShell)
.\test-deployment.ps1

# Linux/Mac
bash test-deployment.sh
```

### 4️⃣ Iniciar Servidores

**Terminal 1 - Backend:**
```bash
cd backEnd
npm start
# Acesso: http://localhost:3000
# Documentação API: http://localhost:3000/api-docs
```

**Terminal 2 - Frontend:**
```bash
cd frontEnd
npm run dev
# Acesso: http://localhost:5173 (ou a porta que Vite indicar)
```

---

## 🌐 PASSO A PASSO - PRODUÇÃO

### 1️⃣ Preparar Servidor

Requisitos:
- Node.js v18+ ou v20+
- MySQL 5.7+
- 512MB RAM mínimo
- 2GB espaço em disco

### 2️⃣ Deploy do Backend

```bash
# Clonar projeto
git clone <seu-repositorio> e-commerce
cd e-commerce/backEnd

# Instalar dependências
npm install

# Criar arquivo .env para produção
cat > .env << EOF
NODE_ENV=production
PORT=3000
DB_HOST=seu-servidor-mysql.com
DB_USER=usuario_producao
DB_PASSWORD=senha_segura_longa
DB_NAME=bazarmz_prod
JWT_SECRET=gere_uma_chave_super_segura_e_longa_aleatoria_aqui_min_32_caracteres
JWT_EXPIRE=30d
BCRYPT_SALT_ROUNDS=10
API_RATE_LIMIT=100
EOF

# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicação
pm2 start server.js --name "ecommerce-api" --env production

# Salvar configuração PM2
pm2 save
pm2 startup
```

### 3️⃣ Deploy do Frontend

```bash
cd ../frontEnd

# Instalar dependências
npm install

# Criar arquivo .env para produção
cat > .env.local << EOF
VITE_API_URL=https://seu-dominio.com/api
VITE_ENV=production
EOF

# Gerar build de produção
npm run build

# Resultado em: dist/
```

### 4️⃣ Servir Frontend em Produção

**Opção A: Com Nginx**

```nginx
# /etc/nginx/sites-available/ecommerce
server {
    listen 80;
    server_name seu-dominio.com;
    
    # Redirecionar para HTTPS (recomendado)
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com;
    
    # SSL (obtém certificado via Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    
    root /var/www/ecommerce/frontEnd/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Opção B: Com Node.js (Serve)**

```bash
# Instalar servidor estático
npm install -g serve

# Servir build
serve -s dist -l 8080

# E redirecionar com Nginx ou Apache para porta 80/443
```

### 5️⃣ Configurar CORS para Produção

No `backEnd/server.js`, atualize CORS:

```javascript
// Antes
app.use(cors());

// Depois
const corsOptions = {
  origin: ['https://seu-dominio.com', 'https://www.seu-dominio.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
```

---

## 🔐 CHECKLIST DE SEGURANÇA

Antes de ir para produção, verifique:

- [ ] JWT_SECRET é uma string longa e aleatória (mínimo 32 caracteres)
- [ ] Banco de dados tem senha forte
- [ ] HTTPS/SSL está ativado
- [ ] CORS está configurado apenas para seu domínio
- [ ] Rate limiting está ativado
- [ ] Headers de segurança (Helmet) estão configurados
- [ ] Variáveis sensíveis NÃO estão em `.env` dentro do repositório
- [ ] `.env` está no `.gitignore`
- [ ] Backups automáticos do BD estão configurados
- [ ] Logs estão sendo armazenados de forma segura

---

## 📊 MONITORAMENTO PÓS-DEPLOYMENT

### Verificar Status

```bash
# API está respondendo?
curl https://seu-dominio.com/api

# Frontend carrega?
curl https://seu-dominio.com

# Logs do servidor
pm2 logs ecommerce-api

# Monitorar recursos
pm2 monit
```

### Integração de Monitoramento (Opcional)

```bash
# Instalar Sentry para rastreamento de erros
npm install @sentry/node @sentry/integrations

# Instalar New Relic para APM
npm install newrelic
```

---

## 🐛 TROUBLESHOOTING

### Frontend não conecta à API
1. Verifique `.env.local` com a URL correta
2. Verifique se backend está online
3. Verifique CORS no backend
4. Limpe cache do navegador: Ctrl+Shift+Delete

### Banco de dados não conecta
```bash
# Testar conexão MySQL
mysql -h seu-host -u seu-usuario -p seu-banco

# Ver logs do backend
pm2 logs ecommerce-api
```

### Arquivo grande não faz upload
1. Aumentar limite no Nginx: `client_max_body_size 50M;`
2. Aumentar limite no Express: verificar `multer` config

---

## 📞 SUPORTE

Em caso de problemas, verifique:
1. `DEPLOYMENT_CHECKLIST.md` - Lista completa de verificações
2. `backEnd/REVISAO_BACKEND.md` - Documentação backend
3. Logs da aplicação com `pm2 logs`
4. Console do navegador (F12) para erros frontend

---

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

1. Implementar CI/CD (GitHub Actions)
2. Adicionar testes automatizados
3. Configurar monitoring e alertas
4. Implementar cache (Redis)
5. Documentação de API com Swagger

---

**Status Final: 80% pronto para produção** ✅

Todos os 3 issues críticos foram resolvidos. Sistema está em condições de fazer um deploy controlado em staging antes de ir para produção.
