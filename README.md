# 📦 SunuShop Stock - Application Full-Stack

Application de gestion de stock multi-entrepôts avec réservations Premium 48h.

![Tests](https://img.shields.io/badge/tests-37%20passed-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-90%25-success)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-green)
![Angular](https://img.shields.io/badge/Angular-17-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)

## Aperçu

**SunuShop Stock** est une application full-stack dockerisée qui gère :
- Articles multi-entrepôts
- Mouvements de stock (entrées/sorties)
- Réservations clients Premium (48h)
- Dashboard de statistiques

## Stack

- **Backend** : Java 17, Spring Boot 3.2.1, PostgreSQL 15, JPA/Hibernate
- **Frontend** : Angular 17, TypeScript, RxJS, Nginx
- **Infra** : Docker, Docker Compose
- **Tests** : JUnit 5 + Mockito, Jasmine + Karma, JaCoCo

## Démarrage

```bash
docker compose up -d