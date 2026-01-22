# BazzarMZ - Frontend

Aplicação de e-commerce moderna desenvolvida com React, Vite e Tailwind CSS.

## 📋 Requisitos

- Node.js 16+ 
- npm ou yarn

## 📦 Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Se react-router-dom não estiver instalado
npm install react-router-dom
```

## 🚀 Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🔨 Build para Produção

```bash
npm run build
```

## 📁 Estrutura de Páginas

### `/` - Página Inicial
- Banner Hero com categorias
- Grid de produtos em destaque
- Carrinho flutuante

### `/login` - Login
- Formulário de autenticação
- Link para criar conta
- Recuperação de senha

### `/register` - Registro
- Formulário de criação de conta
- Validação de dados
- Link para fazer login

### `/search` - Busca de Produtos
- Busca por nome
- Filtros por:
  - Categoria
  - Faixa de preço
  - Classificação
  - Disponibilidade
- Resultados dinâmicos

### `/favorites` - Produtos Favoritos
- Visualizar produtos favoritados
- Remover de favoritos
- Adicionar ao carrinho em lote
- Data de adição

### `/profile` - Perfil do Usuário
- Visualizar dados pessoais
- Editar informações
- Gerenciar endereços
- Alterar senha

### `/checkout` - Finalizar Compra
- Dados pessoais
- Endereço de entrega
- Método de pagamento
- Resumo do pedido
- Cupom de desconto
- Cálculo de frete

### `/orders` - Meus Pedidos
- Listar pedidos do usuário
- Detalhes de cada pedido
- Status de rastreamento
- Download da nota fiscal
- Comprar novamente

## 🛠️ Tecnologias

- **React 18+** - Framework JavaScript
- **Vite** - Build tool
- **React Router** - Roteamento
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones

## 📝 Variáveis de Ambiente

Criar arquivo `.env.local` na raiz do projeto:

```
VITE_API_URL=http://localhost:3000/api
```

## 🔗 Integração com Backend

As páginas estão prontas para serem integradas com a API. Para ativar, descomentar as chamadas `fetch()` nos respectivos componentes:

- **Login** - `Login.jsx` (linha 18)
- **Register** - `Register.jsx` (linha 36)
- **Profile** - `Profile.jsx` (linha 47)

## 🎨 Customização

### Cores
Alterar em `tailwind.config.js`:
```js
colors: {
  primary: '#3b82f6',
  secondary: '#ef4444',
  // ...
}
```

### Fontes
Alterar em `tailwind.config.js`:
```js
fontFamily: {
  sans: ['Inter', 'system-ui', ...],
}
```

## 📱 Responsividade

Todas as páginas são responsivas:
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)

## 🐛 Troubleshooting

### Erro: "Cannot find module 'react-router-dom'"
```bash
npm install react-router-dom
```

### Porta 5173 já em uso
```bash
npm run dev -- --port 3001
```

### Erro de CORS
Configurar backend para aceitar requisições do frontend

## 📚 Documentação Adicional

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)

---

**Desenvolvido com ❤️ para BazzarMZ**
