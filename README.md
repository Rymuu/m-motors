# M-Motors

Plateforme digitale d'achat et de location longue durée (LLD-OA) de véhicules d'occasion.

Projet réalisé dans le cadre du **Bloc 3 — Développer une solution digitale** du Mastère Développement Web (RNCP Niveau 7) — Studi / Paris Ynov Campus.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Front-end | Next.js 16, TypeScript, Tailwind CSS v4 |
| Back-end | Express 5, TypeScript, Prisma 7 |
| Base de données | PostgreSQL 16 |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Upload | Multer (stockage local VPS) |
| Validation | Zod v4 |
| Monorepo | pnpm workspaces |
| Infra | Docker, Traefik, OVH VPS |

---

## Structure du projet

```
m-motors/
├── apps/
│   ├── api/          # API Express 5
│   └── web/          # Front Next.js 16
├── packages/
│   └── types/        # Types TypeScript partagés
├── prisma/           # Schéma et migrations
└── docker-compose.yml
```

---

## Prérequis

- Node.js 22+
- pnpm 11+
- Docker Desktop

---

## Installation

```bash
# Cloner le repo
git clone https://github.com/Rymuu/m-motors.git
cd m-motors

# Installer les dépendances
pnpm install
```

### Variables d'environnement

**`apps/api/.env`**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mmotors?schema=public"
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

**`apps/web/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Lancement en développement

```bash
# 1. Démarrer la base de données
docker compose up -d

# 2. Appliquer les migrations Prisma
cd apps/api
pnpm exec prisma migrate dev

# 3. Seeder la base de données
pnpm run seed

# 4. Lancer l'API et le front (depuis la racine)
cd ../..
pnpm dev
```

- **API** : http://localhost:5000
- **Front** : http://localhost:3000

---

## Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | admin@m-motors.com | admin123 |
| Client | client@m-motors.com | user1234 |

---

## Fonctionnalités

### Site public
- Catalogue véhicules avec filtres (marque, carburant, transmission, prix)
- Recherche par marque (recherche partielle insensible à la casse)
- Fiche véhicule détaillée
- Inscription et connexion

### Espace client
- Tableau de bord personnel
- Dépôt de dossier d'achat ou de location LLD-OA
- Upload de documents (pièce d'identité, justificatif domicile, revenus, RIB)
- Suivi de l'avancement du dossier en temps réel

### Back-office admin
- Gestion des véhicules (statut, canal vente/location)
- Validation et refus des dossiers clients
- Vérification automatique de la complétude des documents (4 requis)
- Mise à jour automatique du statut véhicule à la validation

---

## Architecture

- **Monorepo pnpm** avec workspaces : `apps/api`, `apps/web`, `packages/types`
- **JWT Bearer token** pour l'authentification (7 jours)
- **Stockage local** des documents sur VPS (architecture modulaire S3-ready)
- **Prisma 7** avec adaptateur PostgreSQL natif (`@prisma/adapter-pg`)
- **Séparation services public/admin** : `vehicle.service.ts` / `vehicle.admin.service.ts`

---

## Déploiement

L'application est déployée sur un VPS OVH via Docker et Traefik.

- **API** : https://m-motors.api.rymuwu.com
- **Front** : https://m-motors.rymuwu.com

---

## Auteur

**Ryme** — Développeuse Web FullStack  
GitHub : [@Rymuu](https://github.com/Rymuu)