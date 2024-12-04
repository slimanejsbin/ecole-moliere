# Script de déploiement Vercel
$ErrorActionPreference = "Stop"

# Configuration
$REPO_ROOT = Split-Path -Parent $PSScriptRoot
$FRONTEND_DIR = Join-Path $REPO_ROOT "frontend"

# Fonction de logging
function Write-Log {
    param([string]$Message, [string]$Color = "Green")
    Write-Host "[$([datetime]::Now.ToString('yyyy-MM-dd HH:mm:ss'))] $Message" -ForegroundColor $Color
}

# Vérification de Node.js et Vercel CLI
Write-Log "Vérification des prérequis..." "Yellow"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Log "Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org" "Red"
    exit 1
}

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Log "Installation de Vercel CLI..." "Yellow"
    npm install -g vercel
}

# Déploiement sur Vercel
Write-Log "Déploiement sur Vercel..." "Yellow"
Set-Location $FRONTEND_DIR

# Connexion à Vercel (si nécessaire)
Write-Log "Vérification de la connexion Vercel..." "Yellow"
vercel whoami
if ($LASTEXITCODE -ne 0) {
    Write-Log "Connexion à Vercel requise..." "Yellow"
    vercel login
}

# Déploiement
Write-Log "Démarrage du déploiement..." "Yellow"
vercel --prod

Write-Log "`nDéploiement terminé!" "Green"
Write-Log "Votre application est maintenant en ligne." "Green"
Write-Log "Vous pouvez voir tous vos déploiements sur https://vercel.com/dashboard" "Cyan"
