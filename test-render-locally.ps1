# Script para testar o deployment localmente como Render faz

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TESTE LOCAL DO RENDER DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Limpar caches antigos
Write-Host "📦 Limpando caches npm..." -ForegroundColor Yellow
npm cache clean --force | Out-Null
Write-Host "✅ Cache limpo`n" -ForegroundColor Green

# 2. Instalar dependências do backend
Write-Host "📥 Instalando dependências do backend..." -ForegroundColor Yellow
Set-Location "d:\New folder (3)\htdocs\Projecto-1\E-commerce\backEnd"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências do backend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend pronto`n" -ForegroundColor Green

# 3. Instalar dependências do frontend
Write-Host "📥 Instalando dependências do frontend..." -ForegroundColor Yellow
Set-Location "d:\New folder (3)\htdocs\Projecto-1\E-commerce\frontEnd"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências do frontend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend pronto`n" -ForegroundColor Green

# 4. Build do frontend (como Render faz)
Write-Host "🔨 Building frontend (como Render faz)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer build do frontend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend build completo`n" -ForegroundColor Green

# 5. Voltar ao backend e testar o servidor
Write-Host "🚀 Iniciando servidor backend..." -ForegroundColor Yellow
Set-Location "d:\New folder (3)\htdocs\Projecto-1\E-commerce\backEnd"

# Tentar iniciar o servidor em background
$serverProcess = Start-Process node -ArgumentList "server.js" -NoNewWindow -PassThru -ErrorAction SilentlyContinue

if ($null -eq $serverProcess) {
    Write-Host "❌ Erro ao iniciar o servidor" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Servidor iniciado (PID: $($serverProcess.Id))`n" -ForegroundColor Green

# 6. Aguardar alguns segundos e testar conectividade
Write-Host "⏳ Aguardando 3 segundos para servidor inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# 7. Testar conexão
Write-Host "🔍 Testando conexão com servidor..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api-docs" -ErrorAction Stop
    Write-Host "✅ Servidor respondendo na porta 3000`n" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Servidor não respondendo em /api-docs" -ForegroundColor Yellow
    Write-Host "   Esto pode ser normal se o banco não está conectado`n" -ForegroundColor Yellow
}

# 8. Mostrar logs do servidor
Write-Host "📋 LOGS DO SERVIDOR (Pressione Ctrl+C para parar):" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Manter o servidor rodando
Wait-Process -Id $serverProcess.Id

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TESTE CONCLUÍDO" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
