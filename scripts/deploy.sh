#!/bin/bash

# Configuration
ENV=$1
VERSION=$2
CLUSTER="ecole-moliere-${ENV}"
SERVICES=("backend" "frontend")
HEALTH_CHECK_RETRIES=30
HEALTH_CHECK_INTERVAL=10

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Fonction de logging
log() {
    echo -e "${2:-$GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Vérification des arguments
if [ -z "$ENV" ] || [ -z "$VERSION" ]; then
    log "Usage: ./deploy.sh <env> <version>" $RED
    exit 1
fi

# Validation de l'environnement
if [ "$ENV" != "staging" ] && [ "$ENV" != "production" ]; then
    log "Environment must be 'staging' or 'production'" $RED
    exit 1
fi

# Fonction de vérification de santé
check_health() {
    local service=$1
    local health_endpoint="https://api.ecole-moliere.com/actuator/health"
    
    for i in $(seq 1 $HEALTH_CHECK_RETRIES); do
        log "Health check attempt $i for $service..." $YELLOW
        
        if curl -s -f $health_endpoint > /dev/null; then
            log "Service $service is healthy" $GREEN
            return 0
        fi
        
        sleep $HEALTH_CHECK_INTERVAL
    done
    
    log "Service $service failed health check" $RED
    return 1
}

# Fonction de rollback
rollback() {
    local service=$1
    local previous_version=$2
    
    log "Rolling back $service to version $previous_version..." $YELLOW
    
    aws ecs update-service \
        --cluster $CLUSTER \
        --service $service \
        --task-definition ${service}:${previous_version} \
        --force-new-deployment
        
    if [ $? -ne 0 ]; then
        log "Rollback failed for $service" $RED
        exit 1
    fi
    
    log "Rollback completed for $service" $GREEN
}

# Fonction de déploiement
deploy_service() {
    local service=$1
    
    # Sauvegarde de la version actuelle pour rollback
    local current_version=$(aws ecs describe-services \
        --cluster $CLUSTER \
        --services $service \
        --query 'services[0].taskDefinition' \
        --output text | cut -d':' -f2)
    
    log "Deploying $service version $VERSION..." $YELLOW
    
    # Mise à jour du service ECS
    aws ecs update-service \
        --cluster $CLUSTER \
        --service $service \
        --task-definition ${service}:${VERSION} \
        --force-new-deployment
        
    if [ $? -ne 0 ]; then
        log "Deployment failed for $service" $RED
        exit 1
    fi
    
    # Vérification de la santé
    if ! check_health $service; then
        log "Health check failed for $service, initiating rollback..." $RED
        rollback $service $current_version
        exit 1
    fi
    
    log "Deployment successful for $service" $GREEN
}

# Fonction de mise à jour du cache CloudFront
update_cdn() {
    log "Invalidating CloudFront cache..." $YELLOW
    
    aws cloudfront create-invalidation \
        --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
        --paths "/*"
        
    if [ $? -ne 0 ]; then
        log "CloudFront invalidation failed" $RED
        exit 1
    fi
    
    log "CloudFront cache invalidated successfully" $GREEN
}

# Déploiement principal
main() {
    log "Starting deployment to $ENV environment..." $YELLOW
    
    # Vérification des credentials AWS
    aws sts get-caller-identity > /dev/null
    if [ $? -ne 0 ]; then
        log "AWS credentials not configured correctly" $RED
        exit 1
    }
    
    # Déploiement des services
    for service in "${SERVICES[@]}"; do
        deploy_service $service
    done
    
    # Mise à jour du CDN pour le frontend
    if [ "$ENV" = "production" ]; then
        update_cdn
    fi
    
    # Notification de succès
    if [ "$ENV" = "production" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"✅ Deployment v${VERSION} to production successful!\"}" \
            $SLACK_WEBHOOK_URL
    fi
    
    log "Deployment completed successfully!" $GREEN
}

# Exécution du script
main
