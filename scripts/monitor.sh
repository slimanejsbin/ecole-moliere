#!/bin/bash

# Configuration
ENV=$1
CLUSTER="ecole-moliere-${ENV}"
ALERT_THRESHOLD=80
CHECK_INTERVAL=300  # 5 minutes

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Fonction de logging
log() {
    echo -e "${2:-$GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Vérification de l'argument
if [ -z "$ENV" ]; then
    log "Usage: ./monitor.sh <env>" $RED
    exit 1
fi

# Fonction de vérification des métriques ECS
check_ecs_metrics() {
    local service=$1
    
    # CPU Utilization
    local cpu_utilization=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/ECS \
        --metric-name CPUUtilization \
        --dimensions Name=ClusterName,Value=$CLUSTER Name=ServiceName,Value=$service \
        --start-time $(date -u -v-5M '+%Y-%m-%dT%H:%M:00') \
        --end-time $(date -u '+%Y-%m-%dT%H:%M:00') \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[0].Average' \
        --output text)
    
    # Memory Utilization
    local memory_utilization=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/ECS \
        --metric-name MemoryUtilization \
        --dimensions Name=ClusterName,Value=$CLUSTER Name=ServiceName,Value=$service \
        --start-time $(date -u -v-5M '+%Y-%m-%dT%H:%M:00') \
        --end-time $(date -u '+%Y-%m-%dT%H:%M:00') \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[0].Average' \
        --output text)
    
    # Alerte si dépassement du seuil
    if (( $(echo "$cpu_utilization > $ALERT_THRESHOLD" | bc -l) )); then
        send_alert "High CPU Usage" "Service $service CPU at ${cpu_utilization}%"
    fi
    
    if (( $(echo "$memory_utilization > $ALERT_THRESHOLD" | bc -l) )); then
        send_alert "High Memory Usage" "Service $service Memory at ${memory_utilization}%"
    }
    
    log "Service $service - CPU: ${cpu_utilization}%, Memory: ${memory_utilization}%"
}

# Fonction de vérification RDS
check_rds_metrics() {
    local instance_id="ecole-moliere-${ENV}"
    
    # CPU Utilization
    local cpu_utilization=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/RDS \
        --metric-name CPUUtilization \
        --dimensions Name=DBInstanceIdentifier,Value=$instance_id \
        --start-time $(date -u -v-5M '+%Y-%m-%dT%H:%M:00') \
        --end-time $(date -u '+%Y-%m-%dT%H:%M:00') \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[0].Average' \
        --output text)
    
    # Free Storage Space
    local free_storage=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/RDS \
        --metric-name FreeStorageSpace \
        --dimensions Name=DBInstanceIdentifier,Value=$instance_id \
        --start-time $(date -u -v-5M '+%Y-%m-%dT%H:%M:00') \
        --end-time $(date -u '+%Y-%m-%dT%H:%M:00') \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[0].Average' \
        --output text)
    
    # Conversion en GB
    local free_storage_gb=$(echo "scale=2; $free_storage/1024/1024/1024" | bc)
    
    if (( $(echo "$cpu_utilization > $ALERT_THRESHOLD" | bc -l) )); then
        send_alert "High RDS CPU Usage" "Database CPU at ${cpu_utilization}%"
    fi
    
    if (( $(echo "$free_storage_gb < 10" | bc -l) )); then
        send_alert "Low RDS Storage" "Database has only ${free_storage_gb}GB free"
    fi
    
    log "RDS - CPU: ${cpu_utilization}%, Free Storage: ${free_storage_gb}GB"
}

# Fonction de vérification ElastiCache
check_elasticache_metrics() {
    local cluster_id="ecole-moliere-${ENV}"
    
    # CPU Utilization
    local cpu_utilization=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/ElastiCache \
        --metric-name CPUUtilization \
        --dimensions Name=CacheClusterId,Value=$cluster_id \
        --start-time $(date -u -v-5M '+%Y-%m-%dT%H:%M:00') \
        --end-time $(date -u '+%Y-%m-%dT%H:%M:00') \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[0].Average' \
        --output text)
    
    # Memory Usage
    local memory_usage=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/ElastiCache \
        --metric-name DatabaseMemoryUsagePercentage \
        --dimensions Name=CacheClusterId,Value=$cluster_id \
        --start-time $(date -u -v-5M '+%Y-%m-%dT%H:%M:00') \
        --end-time $(date -u '+%Y-%m-%dT%H:%M:00') \
        --period 300 \
        --statistics Average \
        --query 'Datapoints[0].Average' \
        --output text)
    
    if (( $(echo "$memory_usage > $ALERT_THRESHOLD" | bc -l) )); then
        send_alert "High Redis Memory Usage" "Redis memory at ${memory_usage}%"
    fi
    
    log "Redis - CPU: ${cpu_utilization}%, Memory: ${memory_usage}%"
}

# Fonction d'envoi d'alertes
send_alert() {
    local title=$1
    local message=$2
    
    # Slack
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚨 *${title}*\n${message}\"}" \
        $SLACK_WEBHOOK_URL
    
    # Email (si configuré)
    if [ ! -z "$ALERT_EMAIL" ]; then
        aws ses send-email \
            --from "alerts@ecole-moliere.com" \
            --to $ALERT_EMAIL \
            --subject "Alert: ${title}" \
            --text "${message}"
    fi
    
    log "Alert sent: ${title} - ${message}" $RED
}

# Boucle principale de monitoring
while true; do
    log "Starting monitoring check for $ENV environment..." $YELLOW
    
    # Vérification des services ECS
    for service in "backend" "frontend"; do
        check_ecs_metrics $service
    done
    
    # Vérification RDS
    check_rds_metrics
    
    # Vérification ElastiCache
    check_elasticache_metrics
    
    # Attente avant la prochaine vérification
    sleep $CHECK_INTERVAL
done
