# build.ps1 - Build and run the Travel Accommodation Search app

Write-Host "=== Travel Accommodation Search - Build Script ===" -ForegroundColor Cyan

# Install backend dependencies
Write-Host "`n[1/2] Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

Write-Host "`n[2/2] Build complete." -ForegroundColor Green
Write-Host "`nTo start the app, run:" -ForegroundColor Cyan
Write-Host "  cd backend && node src/server.js" -ForegroundColor White
Write-Host "`nThen open: http://localhost:3001" -ForegroundColor Cyan
