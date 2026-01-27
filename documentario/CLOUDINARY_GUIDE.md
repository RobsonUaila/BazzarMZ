# ☁️ Guia de Integração: Cloudinary

Este guia explica como configurar o Cloudinary no seu projeto para armazenamento de imagens na nuvem.

## 1. Criar Conta (Grátis)

1. Acesse [cloudinary.com](https://cloudinary.com/).
2. Clique em **Sign Up for Free**.
3. Preencha os dados ou entre com Google/GitHub.
4. No "Product Environment", você pode deixar o padrão.

## 2. Obter Credenciais

1. Após logar, você estará no **Dashboard** (Console).
2. Procure pela seção **"Product Environment Credentials"** no topo esquerdo.
3. Você precisará copiar três informações:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 3. Instalar Dependências

No terminal, dentro da pasta `backEnd`, execute:

```bash
cd backEnd
npm install cloudinary multer-storage-cloudinary --legacy-peer-deps
```

## 4. Configurar Variáveis de Ambiente

Abra o arquivo `.env` na pasta `backEnd` e adicione as chaves que você copiou:

```env
# ... outras configurações ...

CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui
CLOUDINARY_API_KEY=sua_api_key_aqui
CLOUDINARY_API_SECRET=sua_api_secret_aqui
```

> ⚠️ **Importante:** Nunca compartilhe seu `API_SECRET` ou suba o arquivo `.env` para repositórios públicos.

## 5. Como Funciona Agora?

1. **Upload:** Quando você envia uma imagem pelo site, o backend a envia diretamente para o Cloudinary.
2. **Banco de Dados:** Em vez de salvar apenas o nome do arquivo (ex: `foto.jpg`), salvamos a URL completa (ex: `https://res.cloudinary.com/.../foto.jpg`).
3. **Frontend:** O site exibe a imagem carregando diretamente dessa URL rápida.

## 6. Solução de Problemas Comuns

**Erro: "Cloudinary config must be supplied"**
- Verifique se você instalou os pacotes.
- Verifique se o arquivo `.env` está salvo e com os nomes corretos das variáveis.
- Reinicie o servidor backend (`npm start` ou `node server.js`).

**Erro: "File too large"**
- O Cloudinary gratuito tem limites generosos, mas configuramos o limite de upload para 10MB no código.

**Imagens Antigas:**
- As imagens que estavam salvas no disco local **não** serão migradas automaticamente.
- Novos produtos usarão o Cloudinary.
- Produtos antigos continuarão funcionando se a pasta `uploads` ainda existir no servidor, mas recomenda-se recadastrá-los se for mudar de servidor.

## 7. Testando a Conexão

Foi criado um script de teste automático. Para executar:

```bash
cd backEnd
node test-cloudinary.js
```