# 🚀 GUIA DE DEPLOYMENT - RAILWAY

## Pré-requisitos

1. Conta no Railway (https://railway.app)
2. Git configurado
3. Backend pronto

---

## 📋 PASSO-A-PASSO

### 1️⃣ **Preparar o Repositório**

```bash
cd backEnd
git add -A
git commit -m "chore: prepare backend for railway deployment"
git push origin main
```

### 2️⃣ **Conectar ao Railway**

#### Opção A: Via CLI (Recomendado)
```bash
# Instalar CLI do Railway
npm install -g @railway/cli

# Login
railway login

# Inicializar projeto
railway init

# Selecione:
# - Nome do projeto: BazzarMZ
# - Região: Africa (mais próximo)

# Deploy
railway up
```

#### Opção B: Via Dashboard (Web)
1. Acesse https://railway.app
2. Clique "New Project"
3. Selecione "Deploy from GitHub"
4. Conecte seu repositório GitHub
5. Selecione a branch `main`
6. Railway detecta automaticamente `Procfile`

---

### 3️⃣ **Configurar Variáveis de Ambiente**

No Railway Dashboard → Variables:

```
NODE_ENV              = production
PORT                  = 3000
DB_HOST               = seu-db-railway.railway.app
DB_USER               = postgres (ou seu usuário)
DB_PASSWORD           = (gerada automaticamente)
DB_NAME               = ecommerce
DB_PORT               = 5432
JWT_SECRET            = sua-chave-super-secreta-min-32-chars
ALLOWED_ORIGINS       = https://bazzarmz.shop,https://www.bazzarmz.shop
LOG_LEVEL             = info
BCRYPT_SALT_ROUNDS    = 10
```

---

### 4️⃣ **Conectar Banco de Dados**

#### Opção A: Railway MySQL
1. No dashboard, clique "+ Create"
2. Selecione "MySQL"
3. Railway cria automaticamente as variáveis:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_PORT`

#### Opção B: Banco Externo
```
DB_HOST     = seu.servidor.com
DB_USER     = usuario
DB_PASSWORD = senha
DB_NAME     = ecommerce
DB_PORT     = 3306
```

---

### 5️⃣ **Executar Migrações**

Após a primeira deploy:

```bash
# No Railway Dashboard → App → Terminal
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < migrations/add-reviews-and-wishlist.sql

# Ou rodar localmente e conectar ao DB do Railway
mysql -h seu-db-railway.railway.app -u postgres -p < backEnd/migrations/add-reviews-and-wishlist.sql
```

---

### 6️⃣ **Criar Admin User**

```bash
# No Railway ou localmente conectado ao DB Railway
node backEnd/create-admin.js
```

---

### 7️⃣ **Verificar Deploy**

```bash
# Ver logs
railway logs

# Testar endpoint
curl https://seu-backend.railway.app/health

# Resposta esperada:
# {"status":"healthy","timestamp":"2026-01-22T...","uptime":123.456}
```

---

## 🔗 CONECTAR FRONTEND

Após ter o backend em Railway, atualize o frontend:

```bash
# frontEnd/.env
VITE_API_URL=https://seu-backend.railway.app
VITE_ENV=production
VITE_APP_NAME=BazzarMZ
```

Deploy frontend no Railway também:
1. Crie novo projeto
2. Conecte repositório
3. Build command: `npm run build`
4. Start command: `npm run preview`

---

## 📊 MONITORAMENTO

Railway oferece:
- 📈 Métricas de CPU/Memória
- 📝 Logs em tempo real
- 🔄 Auto-redeploy on push
- 🛡️ SSL/TLS automático
- 🌍 CDN global

---

## 🐛 TROUBLESHOOTING

### ❌ Erro: "Cannot find module"
```bash
# Limpar e rebuildar
railway build
```

### ❌ Database Connection Timeout
```bash
# Verificar variáveis
railway variables

# Testar conexão
railway run node teste.js
```

### ❌ Port já em uso
Railway automaticamente mapeia portas. Não especifique manualmente.

### ❌ CORS Error
Atualize `ALLOWED_ORIGINS` no Railway Dashboard:
```
https://seu-frontend.railway.app,https://seu-dominio.com
```

---

## 💰 PREÇOS (Railway)

- **Gratuito:** $5/mês de crédito
- **Starter:** $7/mês
- **Pro:** $20/mês+

Cada servidor custa:
- Node.js: ~$0.50/dia
- MySQL: ~$1/dia

---

## ✅ CHECKLIST PRÉ-DEPLOY

- [ ] `package.json` tem `"start": "npm start"`
- [ ] `.env.railway` está preenchido
- [ ] `Procfile` existe com `web: npm start`
- [ ] `railway.json` está configurado
- [ ] Código está no GitHub
- [ ] Sem arquivos sensíveis no git (.env, keys, etc)
- [ ] Migrations SQL estão prontas
- [ ] JWT_SECRET tem 32+ caracteres
- [ ] Database preparado (MySQL 8.0+)

---

## 🎯 RESULTADO FINAL

Após deploy bem-sucedido:

- Backend: `https://seu-app.railway.app` ✅
- API Docs: `https://seu-app.railway.app/api-docs` ✅
- Health: `https://seu-app.railway.app/health` ✅
- Frontend: `https://seu-app.railway.app` (se deployado também) ✅

---

**🚀 Pronto para ir para produção!**
