# Configuration
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("staging", "production")]
    [string]$Environment,
    
    [Parameter(Mandatory=$true)]
    [string]$Version
)

$ErrorActionPreference = "Stop"
$CLUSTER = "ecole-moliere-$Environment"
$SERVICES = @("backend", "frontend")
$HEALTH_CHECK_RETRIES = 30
$HEALTH_CHECK_INTERVAL = 10

# Fonction de logging
function Write-Log {
    param(
        [string]$Message,
        [string]$Color = "Green"
    )
    Write-Host "[$([datetime]::Now.ToString('yyyy-MM-dd HH:mm:ss'))] $Message" -ForegroundColor $Color
}

# Fonction de vérification de santé
function Test-ServiceHealth {
    param([string]$Service)
    
    Write-Log "Checking health for service: $Service" "Yellow"
    $healthEndpoint = "https://api.ecole-moliere.com/actuator/health"
    
    for ($i = 1; $i -le $HEALTH_CHECK_RETRIES; $i++) {
        Write-Log "Health check attempt $i for $Service..." "Yellow"
        
        try {
            $response = Invoke-WebRequest -Uri $healthEndpoint -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Log "Service $Service is healthy" "Green"
                return $true
            }
        }
        catch {
            Write-Log "Health check failed, retrying..." "Yellow"
        }
        
        Start-Sleep -Seconds $HEALTH_CHECK_INTERVAL
    }
    
    Write-Log "Service $Service failed health check" "Red"
    return $false
}

# Fonction de rollback
function Invoke-Rollback {
    param(
        [string]$Service,
        [string]$PreviousVersion
    )
    
    Write-Log "Rolling back $Service to version $PreviousVersion..." "Yellow"
    
    try {
        aws ecs update-service `
            --cluster $CLUSTER `
            --service $Service `
            --task-definition ${Service}:${PreviousVersion} `
            --force-new-deployment
            
        Write-Log "Rollback completed for $Service" "Green"
    }
    catch {
        Write-Log "Rollback failed for $Service: $_" "Red"
        exit 1
    }
}

# Fonction de déploiement
function Deploy-Service {
    param([string]$Service)
    
    # Sauvegarde de la version actuelle pour rollback
    $currentVersion = (aws ecs describe-services `
        --cluster $CLUSTER `
        --services $Service `
        --query 'services[0].taskDefinition' `
        --output text).Split(':')[1]
    
    Write-Log "Deploying $Service version $Version..." "Yellow"
    
    try {
        # Mise à jour du service ECS
        aws ecs update-service `
            --cluster $CLUSTER `
            --service $Service `
            --task-definition ${Service}:${Version} `
            --force-new-deployment
    }
    catch {
        Write-Log "Deployment failed for $Service: $_" "Red"
        exit 1
    }
    
    # Vérification de la santé
    if (-not (Test-ServiceHealth $Service)) {
        Write-Log "Health check failed for $Service, initiating rollback..." "Red"
        Invoke-Rollback $Service $currentVersion
        exit 1
    }
    
    Write-Log "Deployment successful for $Service" "Green"
}

# Fonction de mise à jour du cache CloudFront
function Update-CDN {
    Write-Log "Invalidating CloudFront cache..." "Yellow"
    
    try {
        aws cloudfront create-invalidation `
            --distribution-id $env:CLOUDFRONT_DISTRIBUTION_ID `
            --paths "/*"
            
        Write-Log "CloudFront cache invalidated successfully" "Green"
    }
    catch {
        Write-Log "CloudFront invalidation failed: $_" "Red"
        exit 1
    }
}

# Fonction principale
function Start-Deployment {
    Write-Log "Starting deployment to $Environment environment..." "Yellow"
    
    # Vérification des credentials AWS
    try {
        aws sts get-caller-identity | Out-Null
    }
    catch {
        Write-Log "AWS credentials not configured correctly: $_" "Red"
        exit 1
    }
    
    # Déploiement des services
    foreach ($service in $SERVICES) {
        Deploy-Service $service
    }
    
    # Mise à jour du CDN pour le frontend
    if ($Environment -eq "production") {
        Update-CDN
        
        # Notification Slack
        $body = @{
            text = "✅ Deployment v$Version to production successful!"
        } | ConvertTo-Json
        
        try {
            Invoke-RestMethod -Uri $env:SLACK_WEBHOOK_URL -Method Post -Body $body -ContentType 'application/json'
        }
        catch {
            Write-Log "Failed to send Slack notification: $_" "Yellow"
        }
    }
    
    Write-Log "Deployment completed successfully!" "Green"
}

# Exécution du script
Start-Deployment
