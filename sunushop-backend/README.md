# 📦 SunuShop Stock - Application Full-Stack

API REST et Application Web de gestion de stocks multi-entrepôts pour grossiste en fournitures de bureau.

[![Tests](https://img.shields.io/badge/tests-25%20passed-brightgreen)](#)
[![Coverage](https://img.shields.io/badge/coverage-85%25-yellowgreen)](#)
[![Java](https://img.shields.io/badge/Java-17-blue)](#)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen)](#)
[![Angular](https://img.shields.io/badge/Angular-19-red)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](#)
[![Docker](https://img.shields.io/badge/Docker-ready-blue)](#)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange)](#)

## 🌐 Statut du projet & Déploiement

- **Application Frontend (Angular) :** [https://sunushop-stock.pages.dev](https://sunushop-stock.pages.dev)
- **API Backend (Spring Boot) :** [https://sunushop-backend.onrender.com/api/actuator/health](https://sunushop-backend.onrender.com/api/actuator/health)
- **Documentation API (Swagger) :** [https://sunushop-backend.onrender.com/api/swagger-ui.html](https://sunushop-backend.onrender.com/api/swagger-ui.html)
- **Pipeline CI/CD (GitLab) :** ✅ 100% Vert (Builds & Tests automatisés)

---

## 🛠️ Technologies

### Backend
*   **Java 17** - Langage
*   **Spring Boot 3.2.1** - Framework
*   **Spring Data JPA + Hibernate 6** - ORM
*   **Spring Security + JWT** - Sécurité et Authentification
*   **PostgreSQL 15** - Base de données
*   **JUnit 5 + Mockito** - Tests unitaires
*   **JaCoCo** - Couverture de code (85%)
*   **Swagger UI (Springdoc)** - Documentation API
*   **Docker** - Conteneurisation

### Frontend
*   **Angular 19** - Framework Frontend
*   **TypeScript 5.7** - Langage
*   **Chart.js / ng2-charts** - Graphiques du Dashboard
*   **ngx-toastr** - Notifications UI
*   **Cloudflare Pages** - Hébergement Frontend

---

## ✨ Fonctionnalités Clés

*   🛡️ **Sécurité avancée (RBAC)** : Gestion des rôles (Admin/User). Seuls les administrateurs peuvent créer ou supprimer des articles.
*   📦 **CRUD Articles** : Création, lecture, mise à jour et suppression d'articles multi-entrepôts.
*   📊 **Mouvements de stock** : Réceptions, sorties et ajustements avec historique complet par article.
*   🔖 **Réservations Premium** : Expiration automatique à 48h avec règle métier (max 30% du stock).
*   📈 **Dashboard interactif** : Graphiques dynamiques (Chart.js) pour visualiser le stock par catégorie et les réservations.
*   📊 **Export de données** : Exportation de la liste des articles au format CSV/Excel en un clic.
*   🚨 **Alertes visuelles** : Mise en évidence des articles en rupture de stock (Stock bas).
*   📚 **Documentation API** : Swagger UI intégré pour tester les endpoints.
*   ⚙️ **Gestion d'erreurs centralisée** : Retours d'API propres et formatés.
*   🔒 **Verrou optimiste** (`@Version`) pour éviter les conflits de concurrence.
*   ⏰ **Job planifié** (`@Scheduled`) pour expirer les réservations.

---

## 🧪 Tests

**25 tests backend** - 100% de réussite - 85% de couverture.

```bash
mvn clean verify
Rapport de couverture : target/site/jacoco/index.html

📡 API Endpoints
Méthode	Endpoint	Description
GET	/api/v2/articles	Liste des articles (avec pagination & recherche)
POST	/api/v2/articles	Créer un article (Admin uniquement)
GET	/api/v2/articles/{id}	Détails d'un article
POST	/api/v2/stocks/movements	Créer un mouvement de stock
GET	/api/v2/stocks/articles/{id}/movements	Historique des mouvements
POST	/api/v2/reservations	Créer une réservation
DELETE	/api/v2/reservations/{id}	Annuler une réservation
GET	/api/v2/reservations/active	Réservations actives
GET	/api/v2/stocks/health	Health check
🚀 Installation en local
Prérequis
Java 17+

Maven 3.8+

Node.js 20+

Docker (pour PostgreSQL)

Lancement
Cloner le projet :

bash
git clone https://github.com/User288-wq/SUNUSHOP_STOCK.git
cd SUNUSHOP_STOCK
Démarrer PostgreSQL :

bash
docker compose up -d postgres
Lancer le Backend :

bash
cd sunushop-backend
mvn spring-boot:run
(L'API démarre sur http://localhost:8081/api)

Lancer le Frontend :

bash
cd sunushop-frontend
npm install --legacy-peer-deps
npm start
(L'application démarre sur http://localhost:4200)

🐳 Docker
bash
# Build de l'image
docker build -t sunushop-backend ./sunushop-backend

# Lancer avec docker compose (depuis la racine)
docker compose up -d
👨‍💻 Auteur
Diaraf Diouf - Développeur Full-Stack

LinkedIn (N'oublie pas de mettre ton lien ici !)

GitHub

📝 Licence
Propriétaire - SunuShop
