# SunuShop Stock Management - Full Stack

[![Backend Pipeline](https://gitlab.com/diaraf1993diouf/sunushop-backend/badges/main/pipeline.svg)](https://gitlab.com/diaraf1993diouf/sunushop-backend/-/pipelines)
[![Frontend Pipeline](https://gitlab.com/diaraf1993diouf/sunushop-frontend/badges/main/pipeline.svg)](https://gitlab.com/diaraf1993diouf/sunushop-frontend/-/pipelines)

Application Full-Stack de gestion de stocks multi-entrepots pour grossiste en fournitures de bureau.

## Vue d'ensemble

Ce projet est compose de 2 applications :

| Application | Technologie | Depot |
|-------------|-------------|-------|
| Backend | Java 17 + Spring Boot 3.2 | [sunushop-backend](https://gitlab.com/diaraf1993diouf/sunushop-backend) |
| Frontend | Angular 19 + TypeScript | [sunushop-frontend](https://gitlab.com/diaraf1993diouf/sunushop-frontend) |

## Architecture

    ┌─────────────────────────────────────────────┐
    │  Frontend Angular (port 4200)               │
    │  - Dashboard, Articles, Reservations        │
    └──────────────────┬──────────────────────────┘
                       │ HTTP / REST
                       ▼
    ┌─────────────────────────────────────────────┐
    │  Backend Spring Boot (port 8081)            │
    │  - API REST, Services, Repositories         │
    └──────────────────┬──────────────────────────┘
                       │ JDBC
                       ▼
    ┌─────────────────────────────────────────────┐
    │  PostgreSQL 15 (port 5433)                  │
    └─────────────────────────────────────────────┘

## Demarrage rapide avec Docker

Tout se lance avec une seule commande :

    docker compose up -d

Puis ouvrez :

- **Frontend** : http://localhost:4200
- **Backend**  : http://localhost:8081/api
- **Swagger**  : http://localhost:8081/api/swagger-ui.html

## Fonctionnalites

- Gestion des articles (CRUD)
- Mouvements de stock (receptions, sorties, ajustements)
- Historique complet par article
- Reservations Premium avec expiration automatique 48h
- Dashboard avec statistiques et graphiques
- Gestion d'erreurs centralisee
- Verrou optimiste pour la concurrence

## Tests

| Cote | Tests | Couverture |
|------|-------|-----------|
| Backend | 25 tests (JUnit 5 + Mockito) | 85% |
| Frontend | 10 tests (Jasmine + Karma) | 100% |
| **Total** | **35 tests** | - |

## Structure du projet

    .
    ├── docker-compose.yml        # Orchestration Docker
    ├── README.md
    ├── sunushop-backend/         # API Spring Boot
    │   ├── .gitlab-ci.yml        # Pipeline CI/CD
    │   ├── Dockerfile
    │   ├── pom.xml
    │   ├── README.md
    │   └── src/
    └── sunushop-frontend/        # Interface Angular
        ├── .gitlab-ci.yml        # Pipeline CI/CD
        ├── Dockerfile
        ├── nginx.conf
        ├── package.json
        ├── README.md
        └── src/

## CI/CD

Chaque projet a son propre pipeline GitLab CI/CD :

1. **Build** - Compilation du code
2. **Test** - Execution des tests
3. **Coverage** - Rapport JaCoCo
4. **Package** - Creation du JAR / bundle
5. **Docker** - Construction et publication des images

## Technologies

### Backend
Java 17, Spring Boot 3.2.1, Spring Data JPA, Hibernate 6, PostgreSQL 15, JUnit 5, Mockito, JaCoCo

### Frontend
Angular 19, TypeScript 5.2, RxJS 7.8, Jasmine, Karma

### DevOps
Docker, Docker Compose, Nginx, GitLab CI/CD, Maven, npm

## Commandes utiles

    # Demarrer tous les conteneurs
    docker compose up -d

    # Voir les logs
    docker compose logs -f

    # Arreter tout
    docker compose down

    # Reconstruire les images
    docker compose build --no-cache

    # Tests backend
    cd sunushop-backend && mvn clean verify

    # Tests frontend
    cd sunushop-frontend && npm test

## Auteur

**Diaraf Diouf** - Developpeur Full-Stack Java/JEE

## Licence

Proprietaire - SunuShop