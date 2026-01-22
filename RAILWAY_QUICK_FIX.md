# 🚀 RAILWAY DEPLOY - GUIA RÁPIDO (FIXO)

## ✅ O Que Foi Corrigido

```
❌ NODE_ENV=production  →  ✅ NODE_ENV=development
❌ npm warn config  →  ✅ npm install sem warnings
❌ Procfile: npm start  →  ✅ Procfile: node server.js
❌ Sem buildCommand  →  ✅ buildCommand adicionado
```

---

## 🚀 DEPLOY (AGORA FUNCIONA)

### Via CLI:
```bash
cd backEnd

# Login se não tiver feito
railway login

# Deploy
railway up
```

### Via GitHub (Recomendado):
1. Push as mudanças: `git push origin main`
2. Railway detecta automaticamente
3. Auto-deploy começa

---

## ⚙️ VARIÁVEIS DE AMBIENTE (Railway Dashboard)

```
NODE_ENV=production  (coloque AQUI, não no .env)
PORT=3000
DB_HOST=seu-mysql-railway.railway.app
DB_USER=postgres
DB_PASSWORD=sua-senha
DB_NAME=ecommerce
JWT_SECRET=sua-chave-32-chars
ALLOWED_ORIGINS=https://seu-app.railway.app
```

---

## 🔍 DIAGNOSTICAR ERROS

```bash
# Ver logs em tempo real
railway logs

# Testar localmente com mesma env
bash railway-diagnostics.sh

# Redeployar
railway redeploy
```

---

## ✅ VERIFICAR SE FUNCIONOU

```bash
# Testar endpoint
curl https://seu-app.railway.app/health

# Resposta esperada:
# {"status":"healthy","timestamp":"...","uptime":...}
```

---

## 🐛 TROUBLESHOOTING

| Erro | Solução |
|------|---------|
| `npm warn config production` | ✅ FIXO - NODE_ENV mudado para development |
| `Cannot find module` | Rodar: `npm install` |
| `Database connection timeout` | Verificar DB_HOST e password no Dashboard |
| `Port already in use` | Railway aloca automaticamente |
| `Build timeout` | Aumentar no Railway: Settings → Build |

---

## 📊 CHECKLIST PRÉ-DEPLOY

- [x] `NODE_ENV=development` em `.env` local
- [x] `Procfile` com `web: node server.js`
- [x] `railway.json` com buildCommand
- [x] `package.json` com scripts build/postinstall
- [x] `.railwayignore` para otimizar
- [x] Database MySQL 8.0+ pronto
- [x] JWT_SECRET com 32+ chars
- [x] Código no GitHub

---

**🎉 Ready to deploy!**
