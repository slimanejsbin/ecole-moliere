# Configuration
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("staging", "production")]
    [string]$Environment
)

$ErrorActionPreference = "Stop"
$CLUSTER = "ecole-moliere-$Environment"
$ALERT_THRESHOLD = 80
$CHECK_INTERVAL = 300  # 5 minutes

# Fonction de logging
function Write-Log {
    param(
        [string]$Message,
        [string]$Color = "Green"
    )
    Write-Host "[$([datetime]::Now.ToString('yyyy-MM-dd HH:mm:ss'))] $Message" -ForegroundColor $Color
}

# Fonction de vérification des métriques ECS
function Test-ECSMetrics {
    param([string]$Service)
    
    # CPU Utilization
    $cpuUtilization = aws cloudwatch get-metric-statistics `
        --namespace AWS/ECS `
        --metric-name CPUUtilization `
        --dimensions Name=ClusterName,Value=$CLUSTER Name=ServiceName,Value=$Service `
        --start-time (Get-Date).AddMinutes(-5).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:00') `
        --end-time (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:00') `
        --period 300 `
        --statistics Average `
        --query 'Datapoints[0].Average' `
        --output text
    
    # Memory Utilization
    $memoryUtilization = aws cloudwatch get-metric-statistics `
        --namespace AWS/ECS `
        --metric-name MemoryUtilization `
        --dimensions Name=ClusterName,Value=$CLUSTER Name=ServiceName,Value=$Service `
        --start-time (Get-Date).AddMinutes(-5).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:00') `
        --end-time (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:00') `
        --period 300 `
        --statistics Average `
        --query 'Datapoints[0].Average' `
        --output text
    
    # Alerte si dépassement du seuil
    if ([double]$cpuUtilization -gt $ALERT_THRESHOLD) {
        Send-Alert "High CPU Usage" "Service $Service CPU at ${cpuUtilization}%"
    }
    
    if ([double]$memoryUtilization -gt $ALERT_THRESHOLD) {
        Send-Alert "High Memory Usage" "Service $Service Memory at ${memoryUtilization}%"
    }
    
    Write-Log "Service $Service - CPU: ${cpuUtilization}%, Memory: ${memoryUtilization}%"
}

# Fonction de vérification RDS
function Test-RDSMetrics {
    $instanceId = "ecole-moliere-$Environment"
    
    # CPU Utilization
    $cpuUtilization = aws cloudwatch get-metric-statistics `
        --namespace AWS/RDS `
        --metric-name CPUUtilization `
        --dimensions Name=DBInstanceIdentifier,Value=$instanceId `
        --start-time (Get-Date).AddMinutes(-5).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:00') `
        --end-time (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:00') `
        --period 300 `
        --statistics Average `
        --query 'Datapoints[0].Average' `
        --output text
    
    # Free Storage Space
    $freeStorage = aws cloudwatch get-metric-statistics `
        --namespace AWS/RDS `
        --metric-name FreeStorageSpace `
        --dimensions Name=DBInstanceIdentifier,Value=$instanceId `
        --start-time (Get-Date).AddMinutes(-5).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:00') `
        --end-time (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:00') `
        --period 300 `
        --statistics Average `
        --query 'Datapoints[0].Average' `
        --output text
    
    # Conversion en GB
    $freeStorageGB = [math]::Round([double]$freeStorage/1024/1024/1024, 2)
    
    if ([double]$cpuUtilization -gt $ALERT_THRESHOLD) {
        Send-Alert "High RDS CPU Usage" "Database CPU at ${cpuUtilization}%"
    }
    
    if ($freeStorageGB -lt 10) {
        Send-Alert "Low RDS Storage" "Database has only ${freeStorageGB}GB free"
    }
    
    Write-Log "RDS - CPU: ${cpuUtilization}%, Free Storage: ${freeStorageGB}GB"
}

# Fonction de vérification ElastiCache
function Test-ElastiCacheMetrics {
    $clusterId = "ecole-moliere-$Environment"
    
    # CPU Utilization
    $cpuUtilization = aws cloudwatch get-metric-statistics `
        --namespace AWS/ElastiCache `
        --metric-name CPUUtilization `
        --dimensions Name=CacheClusterId,Value=$clusterId `
        --start-time (Get-Date).AddMinutes(-5).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:00') `
        --end-time (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:00') `
        --period 300 `
        --statistics Average `
        --query 'Datapoints[0].Average' `
        --output text
    
    # Memory Usage
    $memoryUsage = aws cloudwatch get-metric-statistics `
        --namespace AWS/ElastiCache `
        --metric-name DatabaseMemoryUsagePercentage `
        --dimensions Name=CacheClusterId,Value=$clusterId `
        --start-time (Get-Date).AddMinutes(-5).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:00') `
        --end-time (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:00') `
        --period 300 `
        --statistics Average `
        --query 'Datapoints[0].Average' `
        --output text
    
    if ([double]$memoryUsage -gt $ALERT_THRESHOLD) {
        Send-Alert "High Redis Memory Usage" "Redis memory at ${memoryUsage}%"
    }
    
    Write-Log "Redis - CPU: ${cpuUtilization}%, Memory: ${memoryUsage}%"
}

# Fonction d'envoi d'alertes
function Send-Alert {
    param(
        [string]$Title,
        [string]$Message
    )
    
    # Slack
    $body = @{
        text = "🚨 *${Title}*`n${Message}"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri $env:SLACK_WEBHOOK_URL -Method Post -Body $body -ContentType 'application/json'
    }
    catch {
        Write-Log "Failed to send Slack alert: $_" "Yellow"
    }
    
    # Email (si configuré)
    if ($env:ALERT_EMAIL) {
        try {
            aws ses send-email `
                --from "alerts@ecole-moliere.com" `
                --to $env:ALERT_EMAIL `
                --subject "Alert: ${Title}" `
                --text "${Message}"
        }
        catch {
            Write-Log "Failed to send email alert: $_" "Yellow"
        }
    }
    
    Write-Log "Alert sent: ${Title} - ${Message}" "Red"
}

# Boucle principale de monitoring
try {
    while ($true) {
        Write-Log "Starting monitoring check for $Environment environment..." "Yellow"
        
        # Vérification des services ECS
        @("backend", "frontend") | ForEach-Object {
            Test-ECSMetrics $_
        }
        
        # Vérification RDS
        Test-RDSMetrics
        
        # Vérification ElastiCache
        Test-ElastiCacheMetrics
        
        # Attente avant la prochaine vérification
        Start-Sleep -Seconds $CHECK_INTERVAL
    }
}
catch {
    Write-Log "Monitoring script error: $_" "Red"
    exit 1
}
