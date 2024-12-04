# Script de déploiement GitHub Pages
$ErrorActionPreference = "Stop"

# Configuration
$REPO_ROOT = Split-Path -Parent $PSScriptRoot
$FRONTEND_DIR = Join-Path $REPO_ROOT "frontend"
$DIST_DIR = Join-Path $FRONTEND_DIR "dist"
$DEPLOY_BRANCH = "gh-pages"

# Fonction de logging
function Write-Log {
    param([string]$Message, [string]$Color = "Green")
    Write-Host "[$([datetime]::Now.ToString('yyyy-MM-dd HH:mm:ss'))] $Message" -ForegroundColor $Color
}

# Vérification de Node.js
Write-Log "Vérification de Node.js..." "Yellow"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Log "Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org" "Red"
    exit 1
}

# Installation des dépendances
Write-Log "Installation des dépendances..." "Yellow"
Set-Location $FRONTEND_DIR
npm install

# Build du projet
Write-Log "Build du projet..." "Yellow"
npm run build

# Vérification du build
if (-not (Test-Path $DIST_DIR)) {
    Write-Log "Le build a échoué. Vérifiez les erreurs ci-dessus." "Red"
    exit 1
}

# Préparation du dossier gh-pages
Write-Log "Préparation du déploiement..." "Yellow"
$TEMP_DIR = Join-Path $env:TEMP "gh-pages-deploy"
if (Test-Path $TEMP_DIR) { Remove-Item -Recurse -Force $TEMP_DIR }
New-Item -ItemType Directory -Path $TEMP_DIR | Out-Null

# Copie des fichiers
Copy-Item -Path "$DIST_DIR\*" -Destination $TEMP_DIR -Recurse

# Initialisation Git pour gh-pages
Set-Location $TEMP_DIR
git init
git checkout -b $DEPLOY_BRANCH
git add .
git config --local user.email "deploy@ecole-moliere.com"
git config --local user.name "Deploy Script"
git commit -m "Deploy to GitHub Pages"

# Push vers GitHub
Write-Log "Déploiement vers GitHub Pages..." "Yellow"
git remote add origin https://github.com/[VOTRE-USERNAME]/mobile.git
git push -f origin $DEPLOY_BRANCH

# Nettoyage
Set-Location $REPO_ROOT
Remove-Item -Recurse -Force $TEMP_DIR

Write-Log "Déploiement terminé!" "Green"
Write-Log "Votre site sera accessible dans quelques minutes à:" "Green"
Write-Log "https://[VOTRE-USERNAME].github.io/mobile/" "Cyan"

# Instructions pour la configuration GitHub Pages
Write-Log "`nPour activer GitHub Pages:" "Yellow"
Write-Log "1. Allez sur https://github.com/[VOTRE-USERNAME]/mobile/settings/pages" "White"
Write-Log "2. Dans 'Source', sélectionnez la branche 'gh-pages'" "White"
Write-Log "3. Cliquez sur 'Save'" "White"
