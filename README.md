# École Molière - Système de Gestion Scolaire

## État d'Avancement du Projet

### 1. Architecture Backend (Spring Boot)

#### ✅ Configuration de Base
- Configuration Maven avec dépendances
- Application properties configuré
- Structure des packages établie

#### ✅ Modèles de Données
- Entités de base créées :
  - User, Role, Permission (Sécurité)
  - Student, Teacher, SchoolClass, Subject (Académique)
- Relations entre entités définies
- Validation des données configurée

#### ✅ Sécurité
- Configuration JWT implémentée
- Filtres d'authentification
- Gestion des utilisateurs
- Gestion des rôles et permissions

#### ✅ Persistence
- Scripts de migration Flyway créés
- Repositories JPA implémentés :
  - UserRepository
  - StudentRepository
  - TeacherRepository

#### 🚧 En Cours
- Services métier
- Contrôleurs REST
- Tests unitaires et d'intégration
- Documentation API (OpenAPI/Swagger)

### 2. Architecture Frontend (React)

#### ✅ Configuration de Base
- Configuration Vite/TypeScript
- Material-UI intégré
- Structure des composants établie

#### ✅ Composants de Base
- Layout principal
- Barre de navigation
- Composants communs :
  - Loading
  - ErrorBoundary
  - Sidebar

#### 🚧 En Cours
- Formulaires d'authentification
- Pages principales
- Gestion d'état (Redux)
- Internationalisation
- Tests unitaires

### 3. Base de Données

#### ✅ Schéma
- Tables de sécurité
- Tables académiques
- Relations et contraintes

#### ✅ Données Initiales
- Rôles par défaut
- Permissions par défaut
- Utilisateur admin

### 4. Prochaines Étapes

#### Backend
1. Implémenter les services métier
2. Créer les contrôleurs REST
3. Ajouter la validation et la gestion des erreurs
4. Configurer les tests
5. Documenter l'API

#### Frontend
1. Créer les formulaires d'authentification
2. Développer les pages principales
3. Intégrer Redux pour la gestion d'état
4. Ajouter l'internationalisation
5. Implémenter les tests

#### Infrastructure
1. Configuration Docker
2. Pipeline CI/CD
3. Environnements de déploiement
4. Monitoring et logging

### 5. Modules Fonctionnels

#### 🚧 Gestion des Utilisateurs
- [ ] Inscription
- [ ] Authentification
- [ ] Gestion des profils
- [ ] Gestion des rôles

#### 🚧 Gestion Académique
- [ ] Gestion des étudiants
- [ ] Gestion des enseignants
- [ ] Gestion des classes
- [ ] Gestion des matières

#### 📅 À Venir
- Gestion des emplois du temps
- Gestion des notes
- Gestion des absences
- Communication interne
- Gestion des documents
- Rapports et statistiques

## Technologies Utilisées

### Backend
- Java 11
- Spring Boot 2.7.0
- Spring Security
- JWT
- MySQL
- Flyway
- Lombok
- MapStruct

### Frontend
- React 18
- TypeScript
- Material-UI
- Redux Toolkit
- React Query
- Vite

### Outils
- Maven
- Git
- Docker (à venir)
- Jenkins (à venir)

## Installation et Démarrage

[Instructions à venir]

## Documentation

[Liens vers la documentation à venir]

## Contribution

[Guidelines à venir]
