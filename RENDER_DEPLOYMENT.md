# ☁️ GUIA DE DEPLOYMENT - RENDER

Este guia explica como colocar o **BazzarMZ** no ar usando a plataforma Render.

---

## 🚀 Opção 1: Deploy Automático (Blueprint)

A maneira mais fácil, pois usa o arquivo `render.yaml` já configurado.

1. Crie uma conta em render.com.
2. No Dashboard, clique em **New +** e selecione **Blueprint**.
3. Conecte seu repositório GitHub (`BazzarMZ`).
4. Dê um nome para o serviço (ex: `bazzarmz-ecommerce`).
5. O Render detectará o `render.yaml` e pedirá as variáveis de ambiente do banco de dados:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
6. Clique em **Apply**.

---

## 🛠️ Opção 2: Configuração Manual

Se preferir configurar manualmente:

1. Crie um **New Web Service**.
2. Conecte o repositório GitHub.
3. Configurações:
   - **Runtime:** Docker
   - **Region:** Escolha a mais próxima (ex: Frankfurt ou Ohio)
   - **Branch:** main
4. **Environment Variables:**
   - `NODE_ENV`: production
   - `DB_HOST`: (seu host mysql)
   - `DB_USER`: (seu usuario)
   - `DB_PASSWORD`: (sua senha)
   - `DB_NAME`: ecommerce
   - `JWT_SECRET`: (gere uma chave segura)
   - `ALLOWED_ORIGINS`: https://seu-app.onrender.com

---

## 🗄️ Banco de Dados (MySQL)

O Render oferece PostgreSQL nativo, mas para MySQL você tem duas opções:

1. **Banco Externo (Recomendado para Free Tier):**
   - Use serviços como **TiDB Cloud**, **PlanetScale** (se compatível) ou **Aiven** que oferecem MySQL gratuito.
   - Pegue as credenciais e coloque nas variáveis do Render.

2. **Docker no Render (Avançado):**
   - Você pode criar um "Private Service" no Render rodando uma imagem MySQL, mas precisará de um "Disk" (pago) para persistir os dados.

---

## 🔍 Verificando o Deploy

1. Acesse a URL gerada (ex: `https://bazzarmz.onrender.com`).
2. Teste a API: `https://bazzarmz.onrender.com/health`.
3. Verifique os logs no painel do Render para garantir que o servidor iniciou na porta correta (geralmente 10000).

---

## 🌐 Configurar Domínio Personalizado (bazzarmz.shop)

Para que seu site abra em `bazzarmz.shop` em vez de `onrender.com`:

1. No Dashboard do Render, selecione seu serviço.
2. Vá em **Settings** > **Custom Domains**.
3. Clique em **Add Custom Domain** e digite `bazzarmz.shop`.
4. O Render mostrará os registros DNS necessários. Vá ao painel do seu registrador (ex: GoDaddy) e adicione:
   - **Tipo:** `A` | **Nome:** `@` | **Valor:** `216.24.57.1` (IP do Render)
   - **Tipo:** `CNAME` | **Nome:** `www` | **Valor:** `seu-app.onrender.com`
5. Aguarde a propagação (pode levar de minutos a horas). O SSL (HTTPS) será gerado automaticamente.

---

## ⚠️ Notas Importantes

- O plano gratuito do Render entra em "sleep" após 15 minutos de inatividade. O primeiro acesso pode demorar até 50 segundos.
- Certifique-se de que seu banco de dados aceita conexões externas.