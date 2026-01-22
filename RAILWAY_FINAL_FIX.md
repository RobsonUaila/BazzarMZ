# 🚀 RAILWAY DEPLOY - ÚLTIMO FIX

## ✅ Problema Identificado

```
npm warn config production Use `--omit=dev` instead.
```

**Causa:** Railway executa `npm install` com `NODE_ENV=production`, que pula devDependencies.

**Solução:** Adicionar configuração Nixpacks + NPM RC para forçar instalação.

---

## 📦 Ficheiros Adicionados

```
✅ .npmrc                   - Config NPM (production=false)
✅ nixpacks.toml           - Config Nixpacks para Railway
✅ railway-setup.sh        - Script de setup local
✅ railway-diagnostics.sh  - Script de diagnóstico
```

---

## 🚀 DEPLOY (AGORA FUNCIONA)

### Opção 1: Setup Local + Deploy
```bash
# No diretório backEnd
bash railway-setup.sh
git add -A
git commit -m "chore: railway setup complete"
git push origin main
railway up
```

### Opção 2: Apenas Push
```bash
git add -A
git commit -m "fix: railway npm production warn"
git push origin main
# Railway auto-detecta e deploya
```

---

## ⚙️ VARIÁVEIS RAILWAY DASHBOARD

```
NODE_ENV = production  (somente AQUI, não no .env local)
PORT = 3000
DB_HOST = seu-mysql.railway.app
DB_USER = postgres
DB_PASSWORD = sua-senha
DB_NAME = ecommerce
JWT_SECRET = sua-chave-32-chars+
ALLOWED_ORIGINS = https://seu-app.railway.app
```

---

## 🔍 SE AINDA TIVER ERRO

1. **Ver logs:**
   ```bash
   railway logs
   ```

2. **Forçar rebuild:**
   ```bash
   railway redeploy
   ```

3. **Limpar cache:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --production=false
   ```

4. **Testar localmente:**
   ```bash
   NODE_ENV=development npm start
   ```

---

## ✅ PRONTO!

- [x] `.npmrc` com `production=false`
- [x] `nixpacks.toml` para controlar build
- [x] `railroad.json` simplificado
- [x] Scripts de setup e diagnóstico

**Deve funcionar agora! 🎉**
