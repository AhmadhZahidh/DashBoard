# ============================================================
# PRRX Gaming Reseller — GitHub Push Script
# Run this from the gaming-reseller-platform folder
# ============================================================

Write-Host ""
Write-Host "🚀 PRRX Gaming Reseller — Deploying to GitHub" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "📦 Initializing git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Stage all files
Write-Host "📁 Staging files..." -ForegroundColor Yellow
git add .

# Commit
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "deploy: production update $timestamp"

# Check if remote exists
$remotes = git remote 2>$null
if ($remotes -notcontains "origin") {
    Write-Host ""
    Write-Host "⚠️  No remote 'origin' found." -ForegroundColor Red
    Write-Host "   Create a GitHub repo at: https://github.com/new" -ForegroundColor White
    Write-Host "   Then run:" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/prrx-gaming-backend.git" -ForegroundColor Green
    Write-Host "   git push -u origin main" -ForegroundColor Green
} else {
    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
    git push origin main
    Write-Host ""
    Write-Host "✅ Pushed to GitHub!" -ForegroundColor Green
    Write-Host "   Koyeb/Railway will auto-deploy in ~2 minutes" -ForegroundColor White
}

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Check Koyeb dashboard for deployment status" -ForegroundColor White
Write-Host "   2. Test: https://YOUR_KOYEB_URL.koyeb.app/api/health" -ForegroundColor White
Write-Host "   3. Redeploy Vercel after adding env vars" -ForegroundColor White
Write-Host ""
