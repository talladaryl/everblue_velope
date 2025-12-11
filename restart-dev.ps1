# Script pour nettoyer et redémarrer le serveur de développement
Write-Host "🧹 Nettoyage du cache..." -ForegroundColor Yellow

# Arrêter tous les processus Node.js
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Nettoyer le cache
if (Test-Path "node_modules/.vite") {
    Remove-Item -Recurse -Force "node_modules/.vite"
    Write-Host "✅ Cache Vite supprimé" -ForegroundColor Green
}

if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Dossier dist supprimé" -ForegroundColor Green
}

# Vérifier la syntaxe TypeScript
Write-Host "🔍 Vérification TypeScript..." -ForegroundColor Cyan
npx tsc --noEmit

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Aucune erreur TypeScript détectée" -ForegroundColor Green
    
    # Redémarrer le serveur
    Write-Host "🚀 Redémarrage du serveur de développement..." -ForegroundColor Cyan
    npm run dev
} else {
    Write-Host "❌ Erreurs TypeScript détectées. Veuillez les corriger avant de redémarrer." -ForegroundColor Red
}