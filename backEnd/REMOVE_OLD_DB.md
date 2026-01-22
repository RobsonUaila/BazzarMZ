# 🗑️ REMOVER BASE DE DADOS ANTIGA - ac_eletricidade

## O que foi feito

✅ O `.env` foi corrigido para usar `DB_NAME=ecommerce`  
✅ Criado script para remover a base de dados antiga  

---

## Como Remover `ac_eletricidade`

### Opção 1: Script Automático (Recomendado)

```bash
cd backEnd
node remove-old-db.js
```

**O que acontece:**
1. Verifica se `ac_eletricidade` é diferente da base atual
2. Pede confirmação (segurança)
3. Remove a base de dados
4. Mostra mensagem de sucesso

---

### Opção 2: Via MySQL Command Line (Manual)

1. **Abra PowerShell ou CMD**

2. **Conecte ao MySQL:**
   ```bash
   mysql -u root -p
   ```
   *(Digite a senha quando pedido)*

3. **Remova a base de dados:**
   ```sql
   DROP DATABASE ac_eletricidade;
   ```

4. **Confirme a remoção:**
   ```sql
   SHOW DATABASES;
   ```
   *(Verifique se `ac_eletricidade` não aparece mais)*

5. **Saia:**
   ```sql
   EXIT;
   ```

---

### Opção 3: Via MySQL Workbench (GUI)

Se preferir uma interface gráfica:

1. Abra **MySQL Workbench**
2. Conecte ao servidor MySQL
3. Na seção **Schemas**, procure por `ac_eletricidade`
4. Clique com botão direito > **Drop Schema**
5. Confirme

---

## Verificar Status Atual

Após remover, execute para confirmar:

```bash
cd backEnd
node check-config.js
```

**Saída esperada:**
```
🎯 Banco de dados que será usado: "ecommerce"
   ✅ Vindo de .env
```

---

## Próximos Passos

1. ✅ Remover `ac_eletricidade`
2. ✅ Usar apenas `ecommerce` (do seu .env)
3. ✅ Fazer backups de `ecommerce`:
   ```bash
   node middleware/backup.js
   ```

---

## Dúvidas?

- **O que acontece com os dados em `ecommerce`?** 
  Nada, eles continuam intactos. Você só está removendo a base antiga `ac_eletricidade`.

- **Posso recuperar `ac_eletricidade` depois?**
  Não, será deletada permanentemente. Tenha certeza de que não precisa dos dados dela.

- **Qual comando é mais seguro?**
  O script `remove-old-db.js` é mais seguro porque pede confirmação antes de executar.

---

**Execute agora:**
```bash
node remove-old-db.js
```
