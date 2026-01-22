# 🚀 Próximas Etapas - BazzarMZ

## Pré-requisito: Instalar React Router

```bash
cd frontEnd
npm install react-router-dom
```

---

## ✅ Fase 1: Testar Frontend (Hoje)

### 1.1 Executar aplicação
```bash
npm run dev
```

Visitar as páginas:
- http://localhost:5173/ → Página inicial
- http://localhost:5173/login → Login
- http://localhost:5173/register → Registro
- http://localhost:5173/search → Busca
- http://localhost:5173/favorites → Favoritos
- http://localhost:5173/profile → Perfil
- http://localhost:5173/checkout → Checkout
- http://localhost:5173/orders → Pedidos

### 1.2 Verificar funcionalidades
- [ ] Clique em links de navegação
- [ ] Preencha formulários
- [ ] Teste filtros de busca
- [ ] Verifique responsividade (F12 → Toggle device toolbar)

---

## ✅ Fase 2: Preparar Backend

### 2.1 Instalar dependências do backend
```bash
cd backEnd
npm install
```

### 2.2 Criar banco de dados
Executar as queries SQL do schema em [README.md](README.md#banco-de-dados)

### 2.3 Configurar variáveis de ambiente
Criar arquivo `backEnd/.env`:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha
DB_NAME=bazarmz
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

---

## ✅ Fase 3: Implementar Backend

### 3.1 Rotas de Autenticação
**Arquivo:** `backEnd/routes/usuarios.js`

```javascript
// POST /api/usuarios/register
// POST /api/usuarios/login
// GET /api/usuarios/profile (protegido)
// PUT /api/usuarios/profile (protegido)
```

### 3.2 Rotas de Produtos
**Arquivo:** `backEnd/routes/produtos.js` (criar novo)

```javascript
// GET /api/produtos
// GET /api/produtos/:id
// GET /api/produtos/search?q=termo
// POST /api/produtos (admin)
// PUT /api/produtos/:id (admin)
// DELETE /api/produtos/:id (admin)
```

### 3.3 Rotas de Pedidos
**Arquivo:** `backEnd/routes/pedidos.js`

```javascript
// GET /api/pedidos (protegido - meus pedidos)
// GET /api/pedidos/:id (protegido)
// POST /api/pedidos (protegido - criar)
// PUT /api/pedidos/:id (admin - atualizar status)
```

### 3.4 Rotas de Favoritos
**Arquivo:** `backEnd/routes/favoritos.js` (criar novo)

```javascript
// GET /api/favoritos (protegido)
// POST /api/favoritos (protegido)
// DELETE /api/favoritos/:id (protegido)
```

---

## ✅ Fase 4: Conectar Frontend com Backend

### 4.1 Login
**Arquivo:** `frontEnd/src/pages/Login.jsx`

Descomentar linha 18:
```javascript
const response = await fetch('http://localhost:3000/api/usuarios/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
if (data.token) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  window.location.href = '/';
}
```

### 4.2 Register
**Arquivo:** `frontEnd/src/pages/Register.jsx`

Descomentar linha 36:
```javascript
const response = await fetch('http://localhost:3000/api/usuarios/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: formData.nome,
    email: formData.email,
    telefone: formData.telefone,
    senha: formData.senha
  })
});
```

### 4.3 Profile
**Arquivo:** `frontEnd/src/pages/Profile.jsx`

Descomentar linha 47:
```javascript
const response = await fetch('http://localhost:3000/api/usuarios/profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(editData)
});
```

### 4.4 SearchPage
**Arquivo:** `frontEnd/src/pages/SearchPage.jsx`

Adicionar fetch para produtos:
```javascript
useEffect(() => {
  fetch('http://localhost:3000/api/produtos')
    .then(r => r.json())
    .then(data => setProducts(data));
}, []);
```

### 4.5 Orders
**Arquivo:** `frontEnd/src/pages/Orders.jsx`

Adicionar fetch para pedidos:
```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  fetch('http://localhost:3000/api/pedidos', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(data => setOrders(data));
}, []);
```

### 4.6 Carrinho Global
Criar context para gerenciar carrinho:

**Arquivo:** `frontEnd/src/context/CartContext.jsx`
```javascript
import { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    localStorage.setItem('cart', JSON.stringify([...cart, product]));
  };

  const removeFromCart = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
```

---

## ✅ Fase 5: Melhorias e Polimento

### 5.1 Notificações
Instalar toast library:
```bash
npm install react-hot-toast
```

Usar em todas as ações:
```javascript
import toast from 'react-hot-toast';

toast.success('Produto adicionado ao carrinho!');
toast.error('Erro ao fazer login');
```

### 5.2 Loading States
Adicionar spinners em requisições:
```javascript
const [loading, setLoading] = useState(false);

setLoading(true);
// fetch
setLoading(false);
```

### 5.3 Proteção de Rotas
Criar componente PrivateRoute:
```javascript
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}
```

Usar em rotas:
```javascript
<Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
```

### 5.4 Validações Frontend
Instalar library:
```bash
npm install zod
```

Validar formulários antes de enviar

---

## ✅ Fase 6: Testes

### 6.1 Testes Unitários
```bash
npm install -D vitest @testing-library/react
```

Testar componentes individualmente

### 6.2 Testes E2E
```bash
npm install -D cypress
```

Testar fluxos completos do usuário

---

## 📋 Checklist de Conclusão

### Frontend
- [ ] React Router instalado
- [ ] Todas as rotas funcionando
- [ ] Responsividade testada
- [ ] API conectada
- [ ] Token JWT guardado
- [ ] Proteção de rotas
- [ ] Notificações implementadas
- [ ] Testes passando

### Backend
- [ ] Banco de dados criado
- [ ] Autenticação funcionando
- [ ] Rotas CRUD completas
- [ ] Validações implementadas
- [ ] Tratamento de erros
- [ ] CORS configurado
- [ ] Testes unitários
- [ ] Documentação da API

### DevOps
- [ ] Variáveis de ambiente
- [ ] Build otimizado
- [ ] Produção testada
- [ ] Deploy planejado

---

## 🎯 Timeline Sugerida

| Fase | Duração | Tarefas |
|------|---------|---------|
| 1 | 1 dia | Testar frontend |
| 2 | 1 dia | Preparar backend |
| 3 | 3 dias | Implementar rotas |
| 4 | 2 dias | Conectar front/back |
| 5 | 2 dias | Melhorias |
| 6 | 2 dias | Testes |
| **Total** | **~2 semanas** | Deploy em produção |

---

## 📞 Suporte

Em caso de dúvidas:
1. Verificar console do navegador (F12)
2. Verificar logs do servidor
3. Consultar documentação oficial
4. Revisar código de exemplo

---

**Desenvolvido com ❤️ para BazzarMZ**

Última atualização: 16 de Janeiro de 2026
