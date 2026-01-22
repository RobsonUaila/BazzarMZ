# 🎓 Exemplos de Uso - Checkout COD

## 1️⃣ Exemplo Básico de Teste

### Preencha o formulário com:

```
Número de Chamadas:  +258 84 1234567
Endereço Completo:   Rua das Flores, Nº 123, Apto 45, Bairro Centro, Maputo, Gaza
Confirmação:         ✅ Marcado
```

### Clique em "Enviar Pedido via WhatsApp"

**Resultado:**
- Abre nova aba com WhatsApp Web
- Mostra mensagem pronta para enviar
- Cliente envia para loja
- Volta à tela com sucesso

---

## 2️⃣ Exemplo com Diferentes Números

### Moçambique
```
+258 84 123 4567
+258 82 123 4567
(258) 84-123-4567
258841234567
```

### Brasil (se testar)
```
+55 21 98765-4321
(21) 98765-4321
5521987654321
```

### Portugal
```
+351 91 234 5678
91 2345678
351912345678
```

---

## 3️⃣ Exemplo de Endereços Completos

### Maputo, Gaza
```
Rua das Flores, Nº 123, Apto 45, Bairro Centro, Maputo, Gaza
```

### Beira, Sofala
```
Avenida Marginal, Nº 456, Loja 12, Bairro Chaimite, Beira, Sofala
```

### Cidade Côntigo
```
Rua da República, Nº 789, Casa de Negócio, Bairro Zona Verde, Cidade de Côntigo
```

---

## 4️⃣ Exemplo Completo de Fluxo

### **Cenário: Cliente quer comprar 2 produtos**

#### 1. Cliente entra no e-commerce
```
URL: http://localhost:5173/
```

#### 2. Cliente busca produtos
```
URL: http://localhost:5173/search
Clica em "Comprar" em um produto
```

#### 3. Redirecionado para checkout
```
URL: http://localhost:5173/checkout
```

#### 4. Vê resumo do pedido no sidebar
```
- Camiseta Premium (Qtd: 1) - R$ 89.90
- Tênis Esportivo (Qtd: 1) - R$ 299.90

Subtotal: R$ 389.80
Frete: Grátis (compra > R$ 100)
Total: R$ 389.80
```

#### 5. Preenche formulário
```
Número de Chamadas: +258 84 123 4567
Endereço: Rua das Flores, Nº 123, Maputo, Gaza
Confirmação: ✅ Marcado
```

#### 6. Clica "Enviar Pedido via WhatsApp"
```
Validação passa ✅
WhatsApp abre com mensagem:

🛍️ NOVO PEDIDO - COD

Número de Chamadas:
+258 84 123 4567

Endereço de Entrega:
Rua das Flores, Nº 123, Maputo, Gaza

Produtos:
- Camiseta Premium (Qtd: 1) - R$ 89.90
- Tênis Esportivo (Qtd: 1) - R$ 299.90

Resumo do Pedido:
Subtotal: R$ 389.80
Frete: Grátis
Total: R$ 389.80

Método de Pagamento: Dinheiro na Entrega (COD)
Status: Aguardando Confirmação
```

#### 7. Cliente envia no WhatsApp
```
Clica em "Enviar" no WhatsApp
Mensagem vai para loja
```

#### 8. Retorna ao site - tela de sucesso
```
✅ Ícone verde
"Suas informações foram enviadas para WhatsApp"
Botão "Continuar Comprando"
```

#### 9. Reset automático
```
Após 3 segundos
Formulário limpa
Pronto para novo pedido
```

---

## 5️⃣ Exemplo de Validação em Ação

### **Cenário: Erros de Validação**

#### Erro 1: Número vazio
```
Preencher:
- Número: [vazio]
- Endereço: Rua das Flores...
- Confirmar: ✅

Clicar: Enviar

Resultado: ❌
"Número de chamadas é obrigatório"
```

#### Erro 2: Número muito curto
```
Preencher:
- Número: 84123 (5 dígitos)
- Endereço: Rua das Flores...
- Confirmar: ✅

Clicar: Enviar

Resultado: ❌
"Número inválido (mínimo 10 dígitos)"
```

#### Erro 3: Endereço vazio
```
Preencher:
- Número: +258 84 123 4567
- Endereço: [vazio]
- Confirmar: ✅

Clicar: Enviar

Resultado: ❌
"Endereço é obrigatório"
```

#### Erro 4: Endereço muito curto
```
Preencher:
- Número: +258 84 123 4567
- Endereço: Rua 123
- Confirmar: ✅

Clicar: Enviar

Resultado: ❌
"Endereço muito curto"
```

#### Erro 5: Confirmação não marcada
```
Preencher:
- Número: +258 84 123 4567
- Endereço: Rua das Flores, Nº 123...
- Confirmar: ❌ NÃO marcado

Clicar: Enviar

Resultado: ❌
"Você deve confirmar que deseja adquirir o produto"
```

### **Correção de Erros**

```
Cliente vê mensagens de erro em vermelho
Começa a digitar no campo
Erro desaparece automaticamente
Pode tentar enviar novamente
```

---

## 6️⃣ Exemplo de Dados Reais

### **Loja: BazzarMZ**

```
Número WhatsApp: 258841234567
(Configurado no código)

Quando cliente envia, vai para este número
```

### **Caso Real 1: Cliente João**
```
Número: +258 84 987 6543
Endereço: Avenida Samora Machel, Nº 500, Apto 201, Maputo
Produtos: Camiseta + Tênis
Total: R$ 389.80
```

### **Caso Real 2: Cliente Maria**
```
Número: +258 82 555 4321
Endereço: Rua Moçambique, Nº 456, Loja A, Bairro Alto, Maputo
Produtos: Camiseta x2 + Tênis
Total: R$ 479.70
```

---

## 7️⃣ Exemplo de Personalização

### **Se quiser adicionar mais campos:**

```jsx
// Adicione ao estado:
const [formData, setFormData] = useState({
  numero_chamadas: '',
  endereco_completo: '',
  confirmacao: false,
  nome: '',           // NOVO
  email: '',          // NOVO
  observacoes: '',    // NOVO
});

// Adicione ao formulário:
<input
  type="text"
  name="nome"
  placeholder="Nome completo"
  value={formData.nome}
  onChange={handleInputChange}
/>

// Adicione à mensagem WhatsApp:
const mensagem = `
...
Número de Chamadas:
${formData.numero_chamadas}

Nome:
${formData.nome}

Email:
${formData.email}
...
`;
```

---

## 8️⃣ Exemplo de Múltiplos Produtos

### **Cenário: Cliente compra 5 produtos**

```
Produtos no carrinho:
- Camiseta Premium (Qtd: 2) - R$ 179.80
- Tênis Esportivo (Qtd: 1) - R$ 299.90
- Calça Jeans (Qtd: 1) - R$ 129.90
- Meia 3 Pares (Qtd: 2) - R$ 49.80
- Boné Premium (Qtd: 1) - R$ 49.90

Subtotal: R$ 709.30
Frete: Grátis (> R$ 100)
Total: R$ 709.30
```

**Mensagem WhatsApp gerada:**
```
🛍️ NOVO PEDIDO - COD

Número de Chamadas:
+258 84 123 4567

Endereço de Entrega:
Rua das Flores, Nº 123, Maputo

Produtos:
- Camiseta Premium (Qtd: 2) - R$ 179.80
- Tênis Esportivo (Qtd: 1) - R$ 299.90
- Calça Jeans (Qtd: 1) - R$ 129.90
- Meia 3 Pares (Qtd: 2) - R$ 49.80
- Boné Premium (Qtd: 1) - R$ 49.90

Resumo do Pedido:
Subtotal: R$ 709.30
Frete: Grátis
Total: R$ 709.30

Método de Pagamento: Dinheiro na Entrega (COD)
Status: Aguardando Confirmação
```

---

## 9️⃣ Exemplo de Formatos de Número Aceitos

```javascript
// Todos estes são VÁLIDOS:
"+258 84 123 4567"      // Com espaços
"+258841234567"         // Sem espaços
"258 84 123 4567"       // Sem +
"(258) 84-123-4567"     // Com parênteses e hífen
"84-123-4567"           // Sem código país (se >= 10 dígitos)

// Estes são INVÁLIDOS:
"84123"                 // Muito curto (< 10 dígitos)
"abc123"                // Com letras
"+258 84 123"           // Muito curto
""                      // Vazio
```

---

## 🔟 Exemplo de Recuperação de Erro

### **Cenário: Cliente cometeu erro**

```
1. Preencheu com endereço errado
2. Validação passou
3. Clicou "Enviar"
4. WhatsApp abriu
5. Viu a mensagem errada
6. Fechou a aba sem enviar
7. Voltou ao site (mensagem descrita)
8. Clicou "Continuar Comprando"
9. Formulário foi resetado
10. Pode preencher novamente com dados corretos
```

**Resultado:** Sem prejuízo, sem dados perdidos, novo envio é fácil.

---

## 📚 Casos de Uso Práticos

### **Caso 1: E-commerce de Roupas**
```
Produto: Camiseta Premium
Cliente preenche dados
Clica comprar
Loja recebe no WhatsApp
Confirma estoque
Envia endereço de entrega
Cliente recebe em 2-3 dias
```

### **Caso 2: Loja de Eletrônicos**
```
Produtos: Fones + Caso
Total alto (> R$100) = Frete grátis
Cliente aprecia a economia
Envia dados via WhatsApp
Loja confirma entrega rápida
Cliente fica satisfeito
```

### **Caso 3: Pequeno Negócio**
```
Loja não tem site próprio
Usa este e-commerce
Recebe pedidos no seu WhatsApp pessoal
Gerencia tudo manualmente
Sem custos de API
Sem intermediários
```

---

## ✅ Checklist de Exemplo

- ✅ Exemplo básico de teste
- ✅ Exemplos com diferentes números
- ✅ Exemplos de endereços
- ✅ Fluxo completo de cliente
- ✅ Exemplos de validação
- ✅ Dados reais de loja
- ✅ Exemplo de personalização
- ✅ Exemplo com múltiplos produtos
- ✅ Formatos de número aceitos
- ✅ Recuperação de erro
- ✅ Casos de uso práticos

---

**Agora você tem exemplos práticos de como usar o checkout! 🚀**
