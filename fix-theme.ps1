# Script PowerShell pour corriger le thème dans le Builder
# Exécuter depuis la racine du projet : .\fix-theme.ps1

Write-Host "🎨 Correction du thème dans le Builder..." -ForegroundColor Cyan
Write-Host ""

$builderPath = "src/pages/builder"
$files = Get-ChildItem -Path $builderPath -Filter "*.tsx" -Recurse

$replacements = @{
    # Backgrounds
    'bg-secondary(?!\w)' = 'bg-secondary'
    'bg-gray-100(?!\w)' = 'bg-tertiary'
    'bg-white(?!-)' = 'bg-background'
    
    # Textes
    'text-foreground(?!\w)' = 'text-foreground'
    'text-gray-800(?!\w)' = 'text-foreground'
    'text-gray-700(?!\w)' = 'text-foreground'
    'text-gray-600(?!\w)' = 'text-muted-foreground'
    'text-muted-foreground(?!\w)' = 'text-muted-foreground'
    'text-gray-400(?!\w)' = 'text-muted-foreground'
    
    # Bordures
    'border(?!\w)' = 'border'
    'border(?!\w)' = 'border'
    
    # Hover states
    'hover:bg-accent(?!\w)' = 'hover:bg-accent'
    'hover:bg-gray-100(?!\w)' = 'hover:bg-accent'
    'hover:text-foreground(?!\w)' = 'hover:text-foreground'
    'hover:text-gray-700(?!\w)' = 'hover:text-foreground'
    'hover:border-gray-400(?!\w)' = 'hover:border-input'
}

$totalReplacements = 0

foreach ($file in $files) {
    Write-Host "📝 Traitement de $($file.Name)..." -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $fileReplacements = 0
    
    foreach ($pattern in $replacements.Keys) {
        $replacement = $replacements[$pattern]
        $matches = [regex]::Matches($content, $pattern)
        
        if ($matches.Count -gt 0) {
            $content = $content -replace $pattern, $replacement
            $fileReplacements += $matches.Count
            Write-Host "  ✓ $($matches.Count) × '$pattern' → '$replacement'" -ForegroundColor Green
        }
    }
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $totalReplacements += $fileReplacements
        Write-Host "  ✅ $fileReplacements remplacement(s) effectué(s)" -ForegroundColor Green
    } else {
        Write-Host "  ℹ️  Aucun remplacement nécessaire" -ForegroundColor Gray
    }
    
    Write-Host ""
}

Write-Host "🎉 Terminé ! $totalReplacements remplacement(s) au total." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Vérifications recommandées :" -ForegroundColor Yellow
Write-Host "  1. Testez le mode Light et Dark"
Write-Host "  2. Vérifiez tous les steps du Builder"
Write-Host "  3. Testez les interactions (hover, focus)"
Write-Host ""
Write-Host "📚 Consultez CORRECTION_THEME_BUILDER.md pour plus de détails" -ForegroundColor Cyan
