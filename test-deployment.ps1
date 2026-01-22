# SCRIPT DE TESTE PRÉ-DEPLOYMENT
# E-commerce - 21 de Janeiro de 2026
# Para Windows PowerShell

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   INICIANDO TESTES PRÉ-DEPLOYMENT" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$PASS_COUNT = 0
$FAIL_COUNT = 0

function Print-Test {
    param(
        [int]$result,
        [string]$message
    )
    
    if ($result -eq 0) {
        Write-Host "✓ PASSOU: $message" -ForegroundColor Green
        $script:PASS_COUNT++
    } else {
        Write-Host "✗ FALHOU: $message" -ForegroundColor Red
        $script:FAIL_COUNT++
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host " 1️⃣  TESTES DO BACKEND" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Push-Location backEnd

# Teste 1: node_modules existe
$test1 = Test-Path "node_modules"
Print-Test ([int]!$test1) "Dependências do backend instaladas (node_modules)"

# Teste 2: .env existe
$test2 = Test-Path ".env"
Print-Test ([int]!$test2) "Arquivo .env configurado"

# Teste 3: Jest está no package.json
$packageContent = Get-Content "package.json" -Raw
$test3 = $packageContent.Contains('"jest"')
Print-Test ([int]!$test3) "Jest configurado para testes"

# Teste 4: db.js existe
$test4 = Test-Path "db.js"
Print-Test ([int]!$test4) "Arquivo de conexão do banco (db.js) existe"

# Teste 5: server.js existe
$test5 = Test-Path "server.js"
Print-Test ([int]!$test5) "Arquivo servidor (server.js) existe"

# Teste 6: Rotas configuradas
$test6 = (Test-Path "routes") -and (Test-Path "routes/usuarios.js") -and (Test-Path "routes/pedidos.js")
Print-Test ([int]!$test6) "Rotas API configuradas"

# Teste 7: Controllers existem
$test7 = (Test-Path "controllers") -and (Test-Path "controllers/usuariosController.js")
Print-Test ([int]!$test7) "Controllers implementados"

# Teste 8: Middlewares existem
$test8 = (Test-Path "middleware") -and (Test-Path "middleware/error.js") -and (Test-Path "middleware/auth.js")
Print-Test ([int]!$test8) "Middlewares de segurança configurados"

# Teste 9: Validators existem
$test9 = (Test-Path "validators") -and (Test-Path "validators/usuarioValidator.js")
Print-Test ([int]!$test9) "Validadores Joi implementados"

Write-Host ""

Pop-Location

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host " 2️⃣  TESTES DO FRONTEND" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Push-Location frontEnd

# Teste 10: node_modules existe
$test10 = Test-Path "node_modules"
Print-Test ([int]!$test10) "Dependências do frontend instaladas"

# Teste 11: .env.example foi criado
$test11 = Test-Path ".env.example"
Print-Test ([int]!$test11) "Arquivo .env.example para configuração criado"

# Teste 12: vite.config.js existe
$test12 = Test-Path "vite.config.js"
Print-Test ([int]!$test12) "Vite configurado para build"

# Teste 13: React está no package.json
$packageContent = Get-Content "package.json" -Raw
$test13 = $packageContent.Contains('"react"')
Print-Test ([int]!$test13) "React instalado"

# Teste 14: Tailwind está no package.json
$test14 = $packageContent.Contains('"tailwindcss"')
Print-Test ([int]!$test14) "Tailwind CSS configurado"

# Teste 15: ESLint está no package.json
$test15 = $packageContent.Contains('"eslint"')
Print-Test ([int]!$test15) "ESLint configurado para linting"

# Teste 16: App.jsx existe
$test16 = Test-Path "src/App.jsx"
Print-Test ([int]!$test16) "Arquivo App.jsx existe"

# Teste 17: Páginas React existem
$test17 = (Test-Path "src/pages") -and (Test-Path "src/pages/Login.jsx") -and (Test-Path "src/pages/Checkout.jsx")
Print-Test ([int]!$test17) "Páginas React implementadas"

# Teste 18: URL API usando variável de ambiente
$apiContent = Get-Content "src/services/api.js" -Raw
$test18 = $apiContent.Contains("VITE_API_URL")
Print-Test ([int]!$test18) "URL da API usando variável de ambiente (ISSUE CORRIGIDO)"

# Teste 19: toast.js existe
$test19 = Test-Path "src/utils/toast.js"
Print-Test ([int]!$test19) "Arquivo toast.js renomeado corretamente (ISSUE CORRIGIDO)"

# Teste 20: toast,.js foi removido
$test20 = -not (Test-Path "src/utils/toast,.js")
Print-Test ([int]!$test20) "Arquivo inválido toast,.js removido (ISSUE CORRIGIDO)"

Write-Host ""

Pop-Location

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host " 📊 RESULTADOS FINAIS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Testes passados: $PASS_COUNT" -ForegroundColor Green
Write-Host "✗ Testes falhados: $FAIL_COUNT" -ForegroundColor Red
Write-Host ""

$TOTAL = $PASS_COUNT + $FAIL_COUNT
if ($TOTAL -gt 0) {
    $PERCENTAGE = [math]::Round(($PASS_COUNT * 100 / $TOTAL), 0)
} else {
    $PERCENTAGE = 0
}

Write-Host "Percentual de sucesso: ${PERCENTAGE}%" -ForegroundColor Yellow
Write-Host ""

if ($FAIL_COUNT -eq 0) {
    Write-Host "════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  ✓ TODOS OS TESTES PASSARAM!" -ForegroundColor Green
    Write-Host "════════════════════════════════════════" -ForegroundColor Green
    exit 0
} else {
    Write-Host "════════════════════════════════════════" -ForegroundColor Red
    Write-Host "  ✗ ALGUNS TESTES FALHARAM" -ForegroundColor Red
    Write-Host "════════════════════════════════════════" -ForegroundColor Red
    exit 1
}
