# setup-dev.ps1
# Windows PowerShell — one-time local development setup

Write-Host "=== Wereda Poverty Support System — Dev Setup ===" -ForegroundColor Cyan

# 1. Copy .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env created from .env.example — update passwords before use" -ForegroundColor Yellow
} else {
    Write-Host "  .env already exists, skipping" -ForegroundColor Gray
}

# 2. Install root dependencies
Write-Host "`nInstalling root dependencies..." -ForegroundColor Cyan
npm install

# 3. Install server dependencies
Write-Host "`nInstalling server dependencies..." -ForegroundColor Cyan
Set-Location server
npm install
Set-Location ..

# 4. Install client dependencies
Write-Host "`nInstalling client dependencies..." -ForegroundColor Cyan
Set-Location client
npm install
Set-Location ..

# 5. Start PostgreSQL via Docker
Write-Host "`nStarting PostgreSQL container..." -ForegroundColor Cyan
docker-compose up -d db

Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# 6. Run migrations
Write-Host "`nRunning database migrations..." -ForegroundColor Cyan
Set-Location server
npm run db:migrate

# 7. Run seeds
Write-Host "`nSeeding database..." -ForegroundColor Cyan
npm run db:seed
Set-Location ..

Write-Host "`n=== Setup complete! ===" -ForegroundColor Green
Write-Host "Start the API:    cd server ; npm run dev" -ForegroundColor White
Write-Host "Start the client: cd client ; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Default login credentials (change immediately):" -ForegroundColor Yellow
Write-Host "  Super Admin:  super_admin  / SuperAdmin@123" -ForegroundColor White
Write-Host "  Kebele Admin: kebele_admin / KebeleAdmin@123" -ForegroundColor White
Write-Host "  Facilitator:  facilitator  / Facilitator@123" -ForegroundColor White
