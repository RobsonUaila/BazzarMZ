# 🚀 Backend BazzarMZ - Pronto para Railway

**Status:** ✅ Otimizado para Railway  
**Data:** 22 de Janeiro de 2026  

---

## 📁 Arquivos de Deployment

```
backEnd/
├── Procfile                    ✅ Config do Railway
├── railway.json                ✅ Configurações avançadas
├── .env.railway                ✅ Template de env
├── .railwayignore              ✅ Otimização de build
├── railway-start.sh            ✅ Script de inicialização
├── RAILWAY_DEPLOYMENT.md       ✅ Guia completo
├── prepare-railway.sh          ✅ Script de verificação
└── ...resto dos arquivos
```

---

## ⚡ Quick Start - Railway

### 1️⃣ Login no Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### 2️⃣ Deploy Automático

```bash
cd backEnd
railway init
railway up
```

### 3️⃣ Configurar Variáveis

No dashboard Railway, adicione:
```
NODE_ENV=production
JWT_SECRET=sua-chave-segura-com-32-caracteres-minimo
DB_NAME=ecommerce
ALLOWED_ORIGINS=seu-dominio.com
```

Railway cria automaticamente para MySQL:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_PORT`

### 4️⃣ Migrar Banco de Dados

```bash
railway run node backEnd/create-admin.js
railway run mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < backEnd/migrations/add-reviews-and-wishlist.sql
```

---

## 🔧 Características Implementadas

### ✅ Procfile
Especifica como rodar o app:
```
web: npm start
```

### ✅ railway.json
Configurações avançadas:
- Builder: nixpacks
- Healthchecks automáticos
- Restart policies

### ✅ .env.railway
Template com todas as variáveis necessárias

### ✅ Graceful Shutdown
Server encerra corretamente em `SIGTERM`/`SIGINT` (crucial para Railway)

### ✅ Health Checks
Endpoints `/health` e `/api/health` funcionando para Railway monitorar

### ✅ Port Dinâmica
Usa `process.env.PORT` automaticamente

---

## 🔍 Verificar Deploy

```bash
# Ver logs em tempo real
railway logs

# Testar Health Check
curl https://seu-backend.railway.app/health

# Resposta esperada:
# {
#   "status": "healthy",
#   "timestamp": "2026-01-22T...",
#   "uptime": 123.456
# }
```

---

## 📊 Arquitetura Railway

```
┌─────────────────────────────────────────┐
│      Railway Environment                │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   Node.js Server (Express)       │  │
│  │   PORT=3000 (mapeado do Railway) │  │
│  └──────────────────────────────────┘  │
│           ↓                            │
│  ┌──────────────────────────────────┐  │
│  │   MySQL Database                 │  │
│  │   (Railway MySQL ou externo)     │  │
│  └──────────────────────────────────┘  │
│           ↓                            │
│  ┌──────────────────────────────────┐  │
│  │   Railway Storage (uploads/)      │  │
│  └──────────────────────────────────┘  │
│                                         │
│   Domains: https://seu-app.railway.app │
│   SSL:     Automático via Let's Encrypt│
│   CDN:     Incluído                    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔒 Segurança

- ✅ HTTPS automático
- ✅ CORS configurável por variável de ambiente
- ✅ Rate limiting ativo
- ✅ Helmet headers
- ✅ JWT autenticação
- ✅ Bcrypt para senhas

---

## 📈 Performance

Railway fornece:
- 🚀 Auto-scaling (adiciona containers se necessário)
- 💾 SSD storage rápido
- 🌍 CDN global
- ⚡ Deployment automático no push
- 📊 Monitoramento em tempo real

---

## 💰 Estimativa de Custos

| Serviço | Custo/Mês |
|---------|-----------|
| Node.js (1 instance) | ~$15 |
| MySQL | ~$30 |
| Storage (10GB) | ~$5 |
| **Total** | **~$50** |

Railway oferece $5 de crédito gratuito ao mês!

---

## 🆘 Troubleshooting

### Erro: "Cannot connect to database"
```bash
# Verificar variáveis
railway variables

# Testar conexão
railway run node teste.js
```

### Erro: "Port already in use"
Railway mapeia automaticamente. Não especifique porta manualmente.

### Logs não aparecem
```bash
railway logs -f
```

---

## 📚 Links Úteis

- [Railway CLI Docs](https://docs.railway.app/cli/cli-reference)
- [Railway Environment](https://docs.railway.app/guides/deployment)
- [Procfile Reference](https://devcenter.heroku.com/articles/procfile)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-web-app/)

---

## ✅ Checklist Final

- [ ] JWT_SECRET tem 32+ caracteres
- [ ] .env.railway preenchido
- [ ] Procfile criado
- [ ] railway.json configurado
- [ ] Database migrations prontas
- [ ] create-admin.js testado localmente
- [ ] Server.js tem graceful shutdown
- [ ] Health endpoints funcionando
- [ ] CORS_ORIGINS configurado
- [ ] Código pushado no GitHub

---

**🎉 Backend pronto para produção no Railway!**

Qualquer dúvida, veja `RAILWAY_DEPLOYMENT.md` para instruções detalhadas.
