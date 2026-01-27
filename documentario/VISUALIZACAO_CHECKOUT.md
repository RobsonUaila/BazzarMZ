# 🎨 Visualização do Checkout COD

## 📐 Layout Desktop

```
┌─────────────────────────────────────────────────────────────────┐
│                        NAVBAR (Sticky)                          │
│  BazzarMZ | Buscar [🔍] | Perfil | Favoritos | 🛒 Carrinho     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Checkout - Pagamento na Entrega                               │
│                                                                  │
│  ┌──────────────────────────────────┐  ┌──────────────────────┐ │
│  │ FORMULÁRIO (2/3 da tela)         │  │ RESUMO (1/3 tela)   │ │
│  │                                  │  │ (Sticky)            │ │
│  │ ┌─ Aviso COD ─────────────────┐ │  │ ┌─ Resumo ────────┐ │ │
│  │ │ ⚠️  Dinheiro na Entrega      │ │  │ │ 📦 Seu Pedido   │ │ │
│  │ │ Você pagará ao receber       │ │  │ │                 │ │ │
│  │ └─────────────────────────────┘ │  │ │ [Imagem] Nome   │ │ │
│  │                                  │  │ │ Qtd: 1 - R$ X   │ │ │
│  │ ┌─ Número de Chamadas ─────────┐ │  │ │                 │ │ │
│  │ │ 📞 Número para Contato       │ │  │ │ [Imagem] Nome   │ │ │
│  │ │ [+258 84 123 4567..........] │ │  │ │ Qtd: 1 - R$ X   │ │ │
│  │ │ Esse número será usado...   │ │  │ │                 │ │ │
│  │ └─────────────────────────────┘ │  │ │ ─────────────── │ │ │
│  │                                  │  │ │ Subtotal: R$ X  │ │ │
│  │ ┌─ Endereço de Entrega ────────┐ │  │ │ Frete: Grátis   │ │ │
│  │ │ 📍 Endereço Completo         │ │  │ │ ─────────────── │ │ │
│  │ │ [Rua das Flores, Nº 123...  │ │  │ │ Total: R$ X.XX  │ │ │
│  │ │  Apto 45, Maputo...........] │ │  │ │ (em verde)      │ │ │
│  │ │ Inclua rua, número...       │ │  │ │                 │ │ │
│  │ └─────────────────────────────┘ │  │ │ ┌─ COD ────────┐ │ │
│  │                                  │  │ │ │ 💰 Pagamento │ │ │
│  │ ┌─ Confirmação ─────────────────┐ │  │ │ │ Dinheiro    │ │ │
│  │ │ [✓] Confirmo que desejo...    │ │  │ │ │ entrega     │ │ │
│  │ │     Autorizo envio de dados...│ │  │ │ └────────────┘ │ │
│  │ │                               │ │  │ │                 │ │
│  │ │ ERRO (se houver):             │ │  │ │ ┌─ Frete ────┐ │ │
│  │ │ ❌ Erro de validação          │ │  │ │ │ 🎉 Grátis! │ │ │
│  │ │                               │ │  │ │ │ Compra >    │ │ │
│  │ └─────────────────────────────┘ │  │ │ │ │ R$ 100     │ │ │
│  │                                  │  │ │ └────────────┘ │ │ │
│  │ [🚚 Enviar Pedido via WhatsApp] │  │ └─────────────────┘ │ │
│  │ [← Continuar Comprando........] │  │                     │ │
│  │                                  │  │                     │ │
│  └──────────────────────────────────┘  └─────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                           FOOTER                                │
│  © 2024 BazzarMZ | Termos | Privacidade | Suporte             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Layout Mobile

```
┌─────────────────────────┐
│  NAVBAR (Sticky)        │
│  BazzarMZ | Menu        │
└─────────────────────────┘

┌─────────────────────────┐
│ Checkout - COD          │
│                         │
│ ┌─ Aviso COD ────────┐  │
│ │ ⚠️ Dinheiro na     │  │
│ │ Entrega            │  │
│ └────────────────────┘  │
│                         │
│ ┌─ Número ──────────┐   │
│ │ 📞 Para Contato    │   │
│ │ [+258 84 123..] │   │
│ │ Erro: ❌         │   │
│ └────────────────────┘  │
│                         │
│ ┌─ Endereço ────────┐   │
│ │ 📍 Completo        │   │
│ │ [Rua das Flores..] │   │
│ │ [Apto 45, Maputo.] │   │
│ │ Erro: ❌           │   │
│ └────────────────────┘  │
│                         │
│ ┌─ Confirmação ─────┐   │
│ │ [✓] Confirmo       │   │
│ │ Autorizo...        │   │
│ │ Erro: ❌           │   │
│ └────────────────────┘  │
│                         │
│ [🚚 Enviar Pedido...]  │
│ [← Continuar...]       │
│                         │
│ ┌─ Resumo ──────────┐   │
│ │ 📦 Seu Pedido      │   │
│ │                    │   │
│ │ [Img] Nome         │   │
│ │ Qtd: 1 - R$ X      │   │
│ │                    │   │
│ │ [Img] Nome         │   │
│ │ Qtd: 1 - R$ X      │   │
│ │                    │   │
│ │ Subtotal: R$ X.XX  │   │
│ │ Frete: Grátis      │   │
│ │                    │   │
│ │ Total: R$ X.XX ✅  │   │
│ │                    │   │
│ │ 💰 Pagamento COD   │   │
│ │                    │   │
│ │ 🎉 Frete Grátis!   │   │
│ └────────────────────┘   │
│                         │
└─────────────────────────┘

┌─────────────────────────┐
│      FOOTER             │
│ © BazzarMZ | Termos..   │
└─────────────────────────┘
```

---

## 🎯 Estados da Interface

### **Estado 1: Formulário Vazio (Inicial)**

```
Campos:
  Número de Chamadas: [vazio]
  Endereço Completo: [vazio]
  Confirmação: [ ] Desmarked

Botão: "🚚 Enviar Pedido via WhatsApp"
Estado: Enabled
Cor: Verde (#16A34A)

Resumo: Visível com totais
Frete: Grátis (> R$ 100)
Total: R$ 389.80
```

### **Estado 2: Preenchimento em Andamento**

```
Número de Chamadas: +258 84 123 4567
(Cursor pisca)

Endereço Completo: [vazio]

Confirmação: [ ] Desmarked

Botão: "🚚 Enviar Pedido via WhatsApp"
Estado: Enabled
Cor: Verde

Resumo: Atualiza em tempo real
```

### **Estado 3: Validação com Erro**

```
Número de Chamadas: 84123
❌ Erro: "Número inválido (mínimo 10 dígitos)"
(Campo com borda VERMELHA)

Endereço Completo: [vazio]
❌ Erro: "Endereço é obrigatório"
(Campo com borda VERMELHA)

Confirmação: [ ] Desmarked
❌ Erro: "Você deve confirmar..."
(Checkbox com borda VERMELHA)

Botão: "🚚 Enviar Pedido via WhatsApp"
Estado: Enabled
Cor: Verde (tentando novamente)

Resumo: Continua visível
```

### **Estado 4: Preenchido Corretamente**

```
Número de Chamadas: +258 84 123 4567
(Sem erro)
(Borda CINZA normal)

Endereço Completo: Rua das Flores, Nº 123, Maputo
(Sem erro)
(Borda CINZA normal)

Confirmação: [✓] Marcado
(Sem erro)
(Aceito)

Botão: "🚚 Enviar Pedido via WhatsApp"
Estado: Enabled (pronto para clicar)
Cor: Verde #16A34A
Hover: Verde mais escuro #15803D

Resumo: Tudo visível e pronto
```

### **Estado 5: Enviando (Transição)**

```
Clique: "Enviar Pedido via WhatsApp"
         ↓
Validação: ✅ PASSOU
         ↓
Construindo mensagem...
         ↓
Abrindo WhatsApp...
         ↓
(Nova aba abre)
```

### **Estado 6: Sucesso (Tela de Confirmação)**

```
┌─────────────────────────────────────────┐
│                                         │
│         ✅ ÍCONE VERDE (grande)          │
│                                         │
│         Pedido Enviado!                │
│                                         │
│  Suas informações foram enviadas para   │
│  WhatsApp. Aguarde o retorno da loja.  │
│                                         │
│  [Continuar Comprando]                 │
│                                         │
│  (Após 3 segundos: retorna ao form)     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎨 Componentes Visuais

### **Seção: Aviso COD**

```
┌────────────────────────────────────┐
│ ⚠️  Dinheiro na Entrega (COD)       │
│ Você pagará ao receber o produto   │
└────────────────────────────────────┘

Cor: Fundo laranja claro (#FEF3C7)
Borda: Laranja (#FBBF24)
Ícone: AlertCircle (lucide-react)
Texto: Laranja escuro (#92400E)
```

### **Seção: Campo de Entrada**

```
📞 Número de Chamadas

Rótulo: "Número para Contato"
Input: Text
Placeholder: "Ex: +258 84 123 4567"
Validação visual:
  ✅ Correto: Borda cinza normal
  ❌ Erro: Borda VERMELHA
Erro texto: Vermelho (#EF4444)
Dica: Cinza (#6B7280)
```

### **Seção: Textarea de Endereço**

```
📍 Endereço de Entrega

Rótulo: "Endereço Completo"
Textarea: Multiline (4 linhas)
Placeholder: "Ex: Rua das Flores, Nº 123..."
Validação visual:
  ✅ Correto: Borda cinza normal
  ❌ Erro: Borda VERMELHA
Erro texto: Vermelho
Dica: Cinza
```

### **Seção: Confirmação**

```
┌─────────────────────────────────────┐
│ [✓] Confirmo que desejo adquirir...│
│     Autorizo o envio das minhas     │
│     informações para WhatsApp...    │
└─────────────────────────────────────┘

Checkbox: Azul quando marcado (accent-blue-600)
Hover: Fundo cinza claro
Texto: Preto para título, cinza para descrição
Erro: Borda VERMELHA se não marcado
```

### **Botão Principal**

```
┌───────────────────────────────────────┐
│ 🚚 Enviar Pedido via WhatsApp         │
└───────────────────────────────────────┘

Cor: Verde (#16A34A)
Hover: Verde escuro (#15803D)
Texto: Branco
Ícone: Truck (lucide-react)
Padding: Generoso (py-4)
Largura: 100% (w-full)
Font: Bold
```

### **Link Secundário**

```
← Continuar Comprando

Cor: Cinza (#4B5563)
Hover: Cinza mais escuro (#1F2937)
Fundo hover: Cinza claro (#F3F4F6)
Transição: Suave
```

### **Resumo Sidebar**

```
┌────────────────────────────┐
│ 📦 Resumo do Pedido         │
│ ────────────────────────── │
│                            │
│ [IMG] Camiseta Premium     │
│ Qtd: 1         R$ 89.90    │
│                            │
│ [IMG] Tênis Esportivo      │
│ Qtd: 1        R$ 299.90    │
│                            │
│ ─────────────────────────  │
│ Subtotal:      R$ 389.80   │
│ Frete:         Grátis ✅  │
│ ─────────────────────────  │
│ Total:         R$ 389.80   │
│ (em VERDE #16A34A)         │
│                            │
│ ┌─ COD ─────────────────┐ │
│ │ 💰 Pagamento          │ │
│ │ Dinheiro na entrega   │ │
│ └───────────────────────┘ │
│ Fundo: Laranja claro      │
│                            │
│ ┌─ Frete ───────────────┐ │
│ │ 🎉 Frete Grátis!      │ │
│ │ Sua compra qualifica   │ │
│ │ para frete grátis      │ │
│ └───────────────────────┘ │
│ Fundo: Verde claro        │
│                            │
└────────────────────────────┘

Sticky: Fica fixo ao scroll
Sombra: Suave (shadow-md)
Fundo: Branco (#FFFFFF)
```

---

## 🔄 Transições e Animações

### **Validação em Tempo Real**

```
Usuário digita → Erro limpo
        ↓
Campo com borda normal
Mensagem de erro desaparece
```

### **Erro Visual**

```
Borda vermelha aparece
Texto de erro em vermelho
Foco automático no campo
```

### **Sucesso**

```
Clique enviar
    ↓
Validação ✅
    ↓
Novo estado (submitted = true)
    ↓
Tela de sucesso com ícone verde
    ↓
Transição em 3 segundos
    ↓
Reset do formulário
```

---

## 📐 Responsividade

### **Desktop (>= 1024px)**
```
┌─────────────────────────────┐
│  Formulário (2 col)         │
├─────────────────────────────┤
│  Resumo Sidebar (1 col)     │
│  (Sticky na direita)        │
```

### **Tablet (768px - 1023px)**
```
┌──────────────────┐
│  Formulário      │
├──────────────────┤
│  Resumo          │
│  (Abaixo)        │
```

### **Mobile (< 768px)**
```
┌────────────┐
│ Formulário │
│ (Full)     │
│            │
│ Resumo     │
│ (Full)     │
└────────────┘
```

---

## 🎭 Paleta de Cores

| Elemento | Cor | Código |
|----------|-----|--------|
| Primário (COD Aviso) | Laranja | #FED7AA |
| Primário (Botão) | Verde | #16A34A |
| Primário (Hover) | Verde escuro | #15803D |
| Secundário | Cinza | #6B7280 |
| Erro | Vermelho | #EF4444 |
| Sucesso | Verde | #16A34A |
| Total | Verde | #16A34A |
| Fundo Aviso | Laranja claro | #FEF3C7 |
| Fundo Campo | Branco | #FFFFFF |
| Borda Normal | Cinza | #D1D5DB |
| Borda Erro | Vermelho | #EF4444 |
| Borda Focus | Azul | #3B82F6 |
| Texto Primário | Preto | #111827 |
| Texto Secundário | Cinza | #4B5563 |

---

**Visualização completa do Checkout COD! 🎨**
