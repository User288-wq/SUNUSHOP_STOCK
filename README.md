# SunuShop Stock Management - Full Stack

[![Pipeline](https://gitlab.com/diaraf1993diouf/sunushop-fullstack/badges/main/pipeline.svg)](https://gitlab.com/diaraf1993diouf/sunushop-fullstack/-/pipelines)
[![Coverage](https://img.shields.io/badge/coverage-85%25-success)](https://gitlab.com/diaraf1993diouf/sunushop-fullstack/-/pipelines)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://gitlab.com/diaraf1993diouf/sunushop-fullstack)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-green)](https://gitlab.com/diaraf1993diouf/sunushop-fullstack)
[![Angular](https://img.shields.io/badge/Angular-19-red)](https://gitlab.com/diaraf1993diouf/sunushop-fullstack)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://gitlab.com/diaraf1993diouf/sunushop-fullstack)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED)](https://gitlab.com/diaraf1993diouf/sunushop-fullstack)

Application Full-Stack de gestion de stocks multi-entrepots pour grossiste en fournitures de bureau.

## Vue d'ensemble

Ce projet est compose de 2 applications :

| Application | Technologie | Dossier |
|-------------|-------------|---------|
| Backend | Java 17 + Spring Boot 3.2 | `sunushop-backend/` |
| Frontend | Angular 19 + TypeScript | `sunushop-frontend/` |

## Architecture

    Frontend Angular (port 4200)
    - Dashboard, Articles, Reservations
              |
              | HTTP / REST
              v
    Backend Spring Boot (port 8081)
    - API REST, Services, Repositories
              |
              | JDBC
              v
    PostgreSQL 15 (port 5433)

## Demarrage rapide avec Docker

Tout se lance avec une seule commande :

    docker compose up -d

Puis ouvrez :

- Frontend : http://localhost:4200
- Backend  : http://localhost:8081/api
- Swagger  : http://localhost:8081/api/swagger-ui.html

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
    ├── docker-compose.yml
    ├── README.md
    ├── LICENSE
    ├── sunushop-backend/
    │   ├── Dockerfile
    │   ├── pom.xml
    │   ├── README.md
    │   └── src/
    └── sunushop-frontend/
        ├── Dockerfile
        ├── nginx.conf
        ├── package.json
        ├── README.md
        └── src/

## CI/CD

Pipeline GitLab automatique sur chaque commit :

1. Build backend (Maven)
2. Tests backend (25 tests)
3. Install frontend (npm)
4. Tests frontend (10 tests)
5. Build frontend (Angular production)

## Technologies

### Backend
Java 17, Spring Boot 3.2.1, Spring Data JPA, Hibernate 6, PostgreSQL 15, JUnit 5, Mockito, JaCoCo

### Frontend
Angular 19, TypeScript 5.2, RxJS 7.8, Jasmine, Karma

### DevOps
Docker, Docker Compose, Nginx, GitLab CI/CD, Maven, npm

## Auteur

Diaraf Diouf - Developpeur Full-Stack Java/JEE

## Licence

Proprietaire - SunuShop