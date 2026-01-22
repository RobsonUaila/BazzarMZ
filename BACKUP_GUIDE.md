# 📦 GUIA DE BACKUP - MySQL no Windows

## Problema Resolvido

✅ Agora usa o banco de dados correto: **`bazarmz`** (do seu `.env`)  
❌ Não usa mais `ac_eletricidade`

## 2 Soluções para o mysqldump no Windows

### Solução 1: Adicionar ao PATH (Recomendado)

1. **Localize o mysqldump:**
   - Geralmente em: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe`
   - Ou: `C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\`

2. **Adicione ao .env:**
   ```env
   MYSQLDUMP_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe
   ```

3. **Execute o backup:**
   ```bash
   node middleware/backup.js
   ```

### Solução 2: Usar mysqldump do PATH global

1. **Abra PowerShell como Administrador**

2. **Execute:**
   ```powershell
   setx PATH "%PATH%;C:\Program Files\MySQL\MySQL Server 8.0\bin"
   ```
   
   *(Substitua o caminho conforme sua instalação)*

3. **Reinicie o terminal e execute:**
   ```bash
   node middleware/backup.js
   ```

### Solução 3: Se MySQL não estiver instalado

1. **Instale MySQL Server novamente**
   - Download: https://dev.mysql.com/downloads/mysql/
   - Na instalação, marque: ✅ MySQL Command Line Client

2. **Após instalar, use Solução 1 ou 2**

---

## Como Encontrar o Caminho Correto

**Windows 10/11:**

1. Abra o Explorador de Arquivos
2. Vá para: `C:\Program Files\MySQL\`
3. Procure pastas como `MySQL Server 8.0`, `MySQL Server 5.7`, etc.
4. Abra a pasta e vá em `bin\`
5. Procure por: `mysqldump.exe`
6. Copie o caminho completo

**Exemplo:**
```
C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe
```

---

## Testar o Backup

Depois de configurar:

```bash
cd backEnd
node middleware/backup.js
```

**Saída esperada:**
```
📦 Iniciando backup de bazarmz...
🔍 Diagnóstico de Configuração:
   - Banco de dados: bazarmz
   - Host: 127.0.0.1
   - Usuário: root
   - Executável Mysqldump: C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe
   - Arquivo de Destino: ...backups\bazarmz_backup_...sql

🚀 Executando comando...

✅ Backup concluído com sucesso!
   Arquivo salvo em: ...
   Tamanho: XXXXX bytes
```

---

## Automático (Opcional)

Para fazer backup automaticamente todos os dias:

1. **Windows Task Scheduler:**
   - Abra: `Iniciar > Agendador de Tarefas`
   - Crie tarefa que execute: `node middleware/backup.js`
   - Defina frequência: Diária às 2:00 AM

2. **Ou use npm script:**
   ```bash
   npm run backup
   ```
   
   *(Adicione em package.json se desejar)*

---

## Verificar Backups

Os backups são salvos em:
```
E-commerce/backups/
```

Nome do arquivo:
```
bazarmz_backup_2026-01-22T10-30-45-123Z.sql
```

---

**Precisa de ajuda?** Verifique os erros no console! 🚀
