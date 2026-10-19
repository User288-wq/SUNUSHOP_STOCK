📦 SunuShop Stock - Application Full-Stack
Application de gestion de stock multi-entrepôts avec réservations Premium 48h et authentification JWT.

Pipeline Tests Coverage Backend Coverage Frontend Java Spring Boot Angular TypeScript PostgreSQL Docker JWT

## 🌐 Démo en ligne
- **Application Frontend :** [https://sunushop-stock.pages.dev](https://sunushop-stock.pages.dev)
- **API Backend (Health Check) :** [https://sunushop-backend.onrender.com/api/actuator/health](https://sunushop-backend.onrender.com/api/actuator/health)

*Note : Le backend étant hébergé sur le plan gratuit de Render, le premier chargement peut prendre 30 à 50 secondes (Cold Start).*

🎯 Aperçu
SunuShop Stock est une application full-stack dockerisée qui gère :

📦 Articles multi-entrepôts (CRUD complet)
📊 Mouvements de stock (entrées/sorties)
🔖 Réservations clients Premium (expiration 48h)
📈 Dashboard avec statistiques
🔐 Authentification JWT (register/login/logout)

✨ Fonctionnalités
🔐 Authentification JWT
Inscription avec vérification d'unicité
Connexion avec BCrypt
Tokens JWT valides 24h
Protection des routes frontend (AuthGuard)
Intercepteur HTTP qui ajoute le token automatiquement

📦 Module Articles
Création d'articles avec référence unique
Calcul automatique du stock disponible (physique - réservé)
Support multi-entrepôts (Dakar, Casablanca, Abidjan)

📊 Module Mouvements
Enregistrement des entrées (réceptions fournisseurs)
Enregistrement des sorties (ventes clients)
Historique complet par article
Vérification du stock disponible avant sortie

🔖 Module Réservations (Premium)
Réservations clients avec expiration automatique à 48h
Règle métier : maximum 30% du stock physique
Job planifié (@Scheduled) pour expirer les réservations
Annulation manuelle possible

📈 Dashboard
Statistiques en temps réel
Top 5 articles par stock
Répartition par catégorie
Réservations actives récentes

🛠️ Stack technique

Backend
Technologie	Version
Java	17
Spring Boot	3.2.1
Spring Security	6.2.1
Spring Data JPA	3.2.1
Hibernate	6.4.1
PostgreSQL	15
JJWT	0.11.5
Maven	3.8
Lombok	1.18.30
JUnit 5 + Mockito	5.10.1 + 5.7.0
JaCoCo	0.8.11

Frontend
Technologie	Version
Angular	19.2
TypeScript	5.7
RxJS	7.8
Zone.js	0.15
Jasmine + Karma	5.6 + 6.4

Infrastructure
Technologie	Version
Docker	24+
Docker Compose	2.x
Nginx	alpine
Node.js	20
GitLab CI/CD	—

🏗️ Architecture
