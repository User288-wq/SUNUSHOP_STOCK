# SunuShop Stock API

![Tests](https://img.shields.io/badge/tests-25%20passed-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-85%25-success)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)

API REST de gestion de stocks multi-entrepots pour grossiste en fournitures de bureau.

## Technologies

- **Java 17** - Langage
- **Spring Boot 3.2.1** - Framework
- **Spring Data JPA + Hibernate 6** - ORM
- **PostgreSQL 15** - Base de donnees
- **JUnit 5 + Mockito** - Tests unitaires
- **JaCoCo** - Couverture de code (85%)
- **Swagger UI** - Documentation API
- **Docker** - Conteneurisation

## Fonctionnalites

- CRUD Articles
- Mouvements de stock (receptions, sorties, ajustements)
- Historique complet par article
- Reservations Premium (48h d'expiration)
- Gestion d'erreurs centralisee
- Verrou optimiste (@Version)
- Job planifie (@Scheduled)

## Tests

**25 tests backend - 100% de reussite - 85% de couverture**

    mvn clean verify

Rapport de couverture : target/site/jacoco/index.html

## API Endpoints

| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/v2/articles | Liste des articles |
| POST | /api/v2/articles | Creer un article |
| GET | /api/v2/articles/{id} | Details d'un article |
| POST | /api/v2/stocks/movements | Creer un mouvement |
| GET | /api/v2/stocks/articles/{id}/movements | Historique |
| POST | /api/v2/reservations | Creer une reservation |
| DELETE | /api/v2/reservations/{id} | Annuler une reservation |
| GET | /api/v2/reservations/active | Reservations actives |
| GET | /api/v2/stocks/health | Health check |

## Installation

### Prerequis
- Java 17+
- Maven 3.8+
- Docker (pour PostgreSQL)

### Lancement local

    # 1. Demarrer PostgreSQL
    docker compose up -d postgres

    # 2. Lancer l'application
    mvn spring-boot:run

L'application demarre sur **http://localhost:8081/api**

### Swagger UI

**http://localhost:8081/api/swagger-ui.html**

## Docker

    # Build de l'image
    docker build -t sunushop-backend .

    # Lancer avec docker compose (depuis la racine)
    docker compose up -d backend

## Auteur

**Diaraf Diouf** - Developpeur Full-Stack

## Licence

Proprietaire - SunuShop