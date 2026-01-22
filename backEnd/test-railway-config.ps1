# Test Railway Configuration
Write-Host "`n=== RAILWAY DEPLOYMENT CONFIG CHECK ===" -ForegroundColor Cyan

# Check .npmrc
Write-Host "`n✓ Checking .npmrc..." -ForegroundColor Green
if (Test-Path ".npmrc") {
    Write-Host "  .npmrc EXISTS ✓" -ForegroundColor Green
    $npmrc = Get-Content .npmrc
    if ($npmrc -match "production=false") {
        Write-Host "  production=false FOUND ✓" -ForegroundColor Green
    }
    $npmrc | ForEach-Object { Write-Host "    $_" }
} else {
    Write-Host "  .npmrc MISSING ✗" -ForegroundColor Red
}

# Check nixpacks.toml
Write-Host "`n✓ Checking nixpacks.toml..." -ForegroundColor Green
if (Test-Path "nixpacks.toml") {
    Write-Host "  nixpacks.toml EXISTS ✓" -ForegroundColor Green
    $nix = Get-Content nixpacks.toml
    if ($nix -match "production=false") {
        Write-Host "  production=false directive FOUND ✓" -ForegroundColor Green
    }
} else {
    Write-Host "  nixpacks.toml MISSING ✗" -ForegroundColor Red
}

# Check Procfile
Write-Host "`n✓ Checking Procfile..." -ForegroundColor Green
if (Test-Path "Procfile") {
    $proc = Get-Content Procfile
    Write-Host "  Procfile: $proc" -ForegroundColor Green
} else {
    Write-Host "  Procfile MISSING ✗" -ForegroundColor Red
}

# Check railway.json
Write-Host "`n✓ Checking railway.json..." -ForegroundColor Green
if (Test-Path "railway.json") {
    $rail = Get-Content railway.json | ConvertFrom-Json
    Write-Host "  builder: $($rail.builder)" -ForegroundColor Green
    if ($rail.builder -eq "nixpacks") {
        Write-Host "  Using Nixpacks ✓" -ForegroundColor Green
    }
} else {
    Write-Host "  railway.json MISSING ✗" -ForegroundColor Red
}

# Check package.json scripts
Write-Host "`n✓ Checking package.json scripts..." -ForegroundColor Green
$pkg = Get-Content package.json | ConvertFrom-Json
Write-Host "  start: $($pkg.scripts.start)" -ForegroundColor Green
Write-Host "  build: $($pkg.scripts.build)" -ForegroundColor Green

Write-Host "`n=== CONFIG COMPLETE ===" -ForegroundColor Cyan
Write-Host "`nAll Railway deployment files are in place!`n" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Push to GitHub: git push origin main"
Write-Host "2. Railway auto-deploys OR run: railway up`n" -ForegroundColor Yellow
