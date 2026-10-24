# 📦 SunuShop Stock - Application Full-Stack

Application de gestion de stock multi-entrepôts avec réservations Premium 48h et authentification JWT.

[![Pipeline](https://img.shields.io/badge/pipeline-passed-brightgreen)](#)
[![Tests](https://img.shields.io/badge/tests-48%20passed-brightgreen)](#)
[![Coverage Backend](https://img.shields.io/badge/coverage%20backend-88%25-yellowgreen)](#)
[![Coverage Frontend](https://img.shields.io/badge/coverage%20frontend-48%25-yellow)](#)
[![Java](https://img.shields.io/badge/Java-17-blue)](#)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen)](#)
[![Angular](https://img.shields.io/badge/Angular-19-red)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](#)
[![Docker](https://img.shields.io/badge/Docker-ready-blue)](#)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange)](#)

## 🌐 Démo en ligne & Documentation

- **Application Frontend :** [https://sunushop-stock.pages.dev](https://sunushop-stock.pages.dev)
- **API Backend (Health Check) :** [https://sunushop-backend.onrender.com/api/actuator/health](https://sunushop-backend.onrender.com/api/actuator/health)
- **Documentation API (Swagger UI) :** [https://sunushop-backend.onrender.com/api/swagger-ui.html](https://sunushop-backend.onrender.com/api/swagger-ui.html)

*Note : Le backend étant hébergé sur le plan gratuit de Render, le premier chargement peut prendre 30 à 50 secondes (Cold Start).*

---

## 📸 Aperçu de l'application

![Aperçu SunuShop Stock](COLLE_TON_LIEN_IMAGE_ICI)

---

## 🎯 Fonctionnalités Clés

- 🔐 **Authentification sécurisée** : JWT avec Spring Security, mots de passe hachés en BCrypt.
- 📦 **Gestion des articles** : CRUD complet avec calcul automatique du stock disponible.
- 🔍 **Recherche & Pagination** : Filtrage en temps réel par référence ou désignation, avec pagination optimisée côté serveur.
- 🔔 **Notifications (UX)** : Messages d'erreur et de succès dynamiques via `ngx-toastr`.
- 📊 **Mouvements de stock** : Enregistrement des entrées (réceptions) et sorties (ventes).
- 🔖 **Réservations Premium** : Expiration automatique à 48h, règle métier stricte (max 30% du stock).
- 📚 **Documentation API** : Swagger UI intégré pour tester les endpoints directement depuis le navigateur.

---

## 🛠️ Stack technique

### Backend
| Technologie | Version |
|-------------|---------|
| Java | 17 |
| Spring Boot | 3.2.1 |
| Spring Security | 6.2.1 |
| Spring Data JPA | 3.2.1 |
| Hibernate | 6.4.1 |
| PostgreSQL | 15 |
| JJWT | 0.11.5 |
| Swagger (Springdoc) | 2.3.0 |
| Maven | 3.8 |
| Lombok | 1.18.30 |
| JUnit 5 + Mockito | 5.10.1 + 5.7.0 |
| JaCoCo | 0.8.11 |

### Frontend
| Technologie | Version |
|-------------|---------|
| Angular | 19.2 |
| TypeScript | 5.7 |
| RxJS | 7.8 |
| Zone.js | 0.15 |
| ngx-toastr | 19.0 |
| Jasmine + Karma | 5.6 + 6.4 |

### Infrastructure & CI/CD
| Technologie | Version / Plateforme |
|-------------|---------|
| Docker | 24+ |
| Docker Compose | 2.x |
| Nginx | alpine |
| Node.js | 20 |
| GitLab CI/CD | Pipeline automatisé |
| GitHub Actions / Git | Miroir de dépôt |
| Cloudflare Pages | Hébergement Frontend |
| Render | Hébergement Backend |
| Neon | Base de données Serverless |

---

## 🏗️ Architecture

L'application est découpée en 3 parties distinctes :
1. **Frontend (Angular)** : Servi par Cloudflare Pages. Communique avec l'API via des requêtes HTTP sécurisées.
2. **Backend (Spring Boot)** : API REST conteneurisée (Docker) et déployée sur Render. Contient la logique métier et sécurise les accès via JWT.
3. **Base de données (PostgreSQL)** : Hébergée sur Neon (Serverless).

---

## 🚀 Installation en local

1. Cloner le projet :
```bash
git clone https://github.com/User288-wq/SUNUSHOP_STOCK.git
cd SUNUSHOP_STOCK
Lancer le backend (Spring Boot) :

bash
cd sunushop-backend
mvn spring-boot:run
Lancer le frontend (Angular) :

bash
cd sunushop-frontend
npm install
npm start
L'application sera accessible sur http://localhost:4200
**⚠️ N'oublie pas de remplacer `COLLE_TON_LIEN_IMAGE_ICI` par le lien de ta capture d'écran !** 

Une fois collé, fais ton `git add .`, `git commit`, `git push origin main` (ou clique sur "Commit changes" sur GitHub). Ton profil va être ultra professionnel. 🚀🔥
