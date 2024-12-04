# Guide de Déploiement - École Molière School Management System

## 🚀 Prérequis

### Infrastructure
- AWS Account avec les services suivants :
  - ECS (Elastic Container Service)
  - RDS (MySQL)
  - S3 (Stockage)
  - CloudFront (CDN)
  - Route53 (DNS)
  - ACM (Certificats SSL)

### Outils de Développement
- Node.js v16+
- Java 11
- Docker
- AWS CLI v2
- GitHub CLI

## 📦 Configuration des Environnements

### Variables d'Environnement
```bash
# Production
cp .env.example .env.production
# Staging
cp .env.example .env.staging
```

Configurer les variables suivantes :
- `VITE_API_BASE_URL`
- `VITE_SENTRY_DSN`
- `VITE_APP_ENV`

### Base de Données
1. Créer une instance RDS MySQL
2. Configurer les groupes de sécurité
3. Exécuter les migrations :
```bash
cd backend
./mvnw flyway:migrate -Dflyway.configFiles=flyway-production.conf
```

## 🛠 Build et Tests

### Frontend
```bash
cd frontend
# Installation des dépendances
npm install

# Tests
npm run test

# Build de production
npm run build

# Analyse de bundle
npm run analyze
```

### Backend
```bash
cd backend
# Tests
./mvnw test

# Build
./mvnw clean package -P production
```

## 🐳 Conteneurisation

### Build des Images
```bash
# Backend
docker build -t ecole-moliere-backend:latest ./backend
docker tag ecole-moliere-backend:latest $AWS_ECR_REGISTRY/ecole-moliere-backend:latest

# Frontend
docker build -t ecole-moliere-frontend:latest ./frontend
docker tag ecole-moliere-frontend:latest $AWS_ECR_REGISTRY/ecole-moliere-frontend:latest
```

### Push vers ECR
```bash
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin $AWS_ECR_REGISTRY
docker push $AWS_ECR_REGISTRY/ecole-moliere-backend:latest
docker push $AWS_ECR_REGISTRY/ecole-moliere-frontend:latest
```

## 🌐 Déploiement

### Configuration DNS et SSL
1. Créer une zone hébergée dans Route53
2. Demander un certificat SSL dans ACM
3. Configurer les enregistrements DNS

### Déploiement ECS
1. Créer un cluster ECS
2. Définir les task definitions
3. Créer les services
4. Configurer l'auto-scaling

```bash
# Déploiement des services
aws ecs update-service --cluster ecole-moliere-prod --service backend --force-new-deployment
aws ecs update-service --cluster ecole-moliere-prod --service frontend --force-new-deployment
```

### Configuration CDN
1. Créer une distribution CloudFront
2. Configurer les comportements de cache
3. Associer le certificat SSL

## 📊 Monitoring

### Sentry
1. Créer un projet dans Sentry
2. Configurer le DSN dans les variables d'environnement
3. Vérifier la capture des erreurs

### CloudWatch
1. Configurer les métriques personnalisées
2. Créer des tableaux de bord
3. Configurer les alertes

### Logs
1. Configurer la rotation des logs
2. Définir les niveaux de log par environnement
3. Mettre en place la rétention des logs

## 🔄 Rollback

### Procédure de Rollback
1. Identifier la version précédente stable
```bash
aws ecs describe-task-definition --task-definition ecole-moliere-backend:PREVIOUS_VERSION
```

2. Mettre à jour le service
```bash
aws ecs update-service --cluster ecole-moliere-prod --service backend --task-definition ecole-moliere-backend:PREVIOUS_VERSION
```

## 🔍 Vérification Post-Déploiement

### Liste de Contrôle
- [ ] Vérifier les endpoints API
- [ ] Tester l'authentification
- [ ] Vérifier les performances
- [ ] Contrôler les logs
- [ ] Vérifier les métriques
- [ ] Tester le SSL
- [ ] Vérifier le cache

## 🆘 Support

### Contacts
- Support Technique : support@abnsoft.com
- Urgences : +212 XXXXXXXXX

### Documentation
- Wiki Interne : https://wiki.abnsoft.com
- API Docs : https://api.ecole-moliere.com/docs
