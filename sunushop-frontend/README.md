# SunuShop Frontend

![Tests](https://img.shields.io/badge/tests-10%20passed-brightgreen)
![Angular](https://img.shields.io/badge/Angular-19-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)

Interface Angular pour l'application de gestion de stocks SunuShop.

## Technologies

- **Angular 19** - Framework
- **TypeScript 5.2** - Langage
- **RxJS 7.8** - Programmation reactive
- **HttpClient** - Communication API
- **Jasmine + Karma** - Tests unitaires (10 tests, 100%)
- **Nginx** - Serveur de production

## Fonctionnalites

- Dashboard avec statistiques (4 cartes + graphique)
- Liste des articles (tableau avec stock disponible)
- Formulaire de creation d'article
- Formulaire de mouvement de stock (reception/sortie/ajustement)
- Liste des reservations actives
- Formulaire de creation de reservation
- Design moderne et responsive

## Structure

    src/app/
    ├── core/
    │   └── services/         # Services HTTP (Article, Stock, Reservation)
    ├── shared/
    │   └── models/           # Interfaces TypeScript
    ├── features/
    │   ├── dashboard/        # Page d'accueil avec stats
    │   ├── articles/         # Liste + Formulaire
    │   ├── stocks/           # Formulaire de mouvement
    │   └── reservations/     # Liste + Formulaire
    ├── app.component.ts      # Composant racine
    ├── app.config.ts         # Configuration (HttpClient)
    └── app.routes.ts         # Routes de l'application

## Routes

| Route | Description |
|-------|-------------|
| / | Redirection vers /dashboard |
| /dashboard | Tableau de bord avec statistiques |
| /articles | Liste des articles |
| /articles/new | Formulaire de creation d'article |
| /stocks/movement | Formulaire de mouvement |
| /reservations | Liste des reservations |
| /reservations/new | Formulaire de reservation |

## Installation

### Prerequis
- Node.js 20+
- npm 10+

### Lancement local

    # 1. Installer les dependances
    npm install

    # 2. Lancer le serveur de developpement
    npm start

L'application demarre sur **http://localhost:4200**

## Tests

    npm test

**10 tests - 100% de reussite**

## Build de production

    npm run build

Les fichiers sont generes dans `dist/sunushop-frontend/browser/`.

## Docker

    # Build de l'image
    docker build -t sunushop-frontend .

    # Lancer avec docker compose (depuis la racine)
    docker compose up -d frontend

## Configuration

Le fichier `proxy.conf.json` redirige les appels `/api/*` vers `http://localhost:8081`.

Pour le deploiement Docker, Nginx fait le proxy inverse (voir `nginx.conf`).

## Backend

Le backend Spring Boot est disponible sur :
**https://gitlab.com/diaraf1993diouf/sunushop-backend**

## Auteur

**Diaraf Diouf** - Developpeur Full-Stack

## Licence

Proprietaire - SunuShop