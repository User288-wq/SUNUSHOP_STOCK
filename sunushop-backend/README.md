# SunuShop Stock API

![Tests](https://img.shields.io/badge/tests-29%20passed-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-90%25-success)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-green)
![Angular](https://img.shields.io/badge/Angular-17-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)

Application Full-Stack de gestion de stocks multi-entrepôts pour grossiste en fournitures de bureau.

## Technologies

### Backend
- Java 17
- Spring Boot 3.2.1
- Spring Data JPA + Hibernate 6
- PostgreSQL 15
- JUnit 5 + Mockito
- JaCoCo (90% de couverture)

### Frontend
- Angular 17
- TypeScript 5.2
- RxJS 7.8
- Jasmine + Karma (8 tests, 100%)

### Infrastructure
- Docker + Docker Compose
- Nginx (reverse proxy)

## Fonctionnalités

- CRUD Articles
- Mouvements de stock (réceptions, sorties, ajustements)
- Historique complet par article
- Réservations Premium (48h d'expiration)
- Gestion d'erreurs centralisée
- Verrou optimiste (`@Version`)
- Job planifié (`@Scheduled`)
- Dashboard avec statistiques

## Tests

**37 tests au total — 100% de réussite — 90% de couverture backend**

### Backend
```bash
cd sunushop-backend
mvn clean verify