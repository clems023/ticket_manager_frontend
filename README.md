# 🎫 Ticket Manager

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**[English](#english)** · **[Français](#français)**

---

<a id="english"></a>

## English

> A modern ticket management web app — **React portfolio project** showcasing a typed, maintainable front-end architecture.

### About

**Ticket Manager** is the front-end of a ticket management application. It consumes a JWT-secured REST API and provides a full user flow: authentication, paginated list, detail view, creation and editing.

This repository highlights skills in **React**, **TypeScript** and **API integration**: reusable components, server state management, validated forms, protected routing and polished UX.

> **Note — no live demo**  
> The backend API (Symfony) requires paid server hosting. Only the front-end is published here.  
> The project is designed to be **cloned and run locally** in minutes with your own API.

### Features

| Module | Details |
|--------|---------|
| **Authentication** | Login / register, JWT token stored client-side |
| **Ticket list** | Pagination, sorting, filters (status, priority), search |
| **Detail view** | Dedicated page `/tickets/:id` with full metadata |
| **Creation** | Modal form with validation |
| **Editing** | `PATCH` updates with toast feedback |
| **UX** | Dark mode, skeleton loaders, empty states, notifications |
| **Security** | Protected routes, Axios Bearer token interceptor |

### Tech stack

| Layer | Technologies |
|-------|--------------|
| **UI** | React 19, TypeScript, Tailwind CSS v4 |
| **Build** | Vite 7 |
| **Data** | TanStack React Query (cache, mutations, invalidation) |
| **Forms** | React Hook Form |
| **HTTP** | Axios (request/response interceptors) |
| **Routing** | React Router v7 (auth guards) |
| **Notifications** | Sonner |

### Architecture

```
src/
├── api/                 # Axios client + REST endpoints
├── components/
│   ├── auth/            # Protected / guest routes
│   ├── layout/          # AppLayout (header, navigation)
│   └── ui/              # Design system (Button, Input, Card, Modal…)
├── contexts/            # AuthContext, ThemeContext
├── features/tickets/    # Ticket domain logic (cards, filters, modals)
├── hooks/               # useTickets, useTicket, useCreateTicket, useUpdateTicket
├── pages/               # TicketListPage, TicketDetailPage, LoginRegister
├── providers/           # QueryProvider
├── routes/              # AppRouter
└── utils/               # API error handling, date formatting
```

**Architecture choices:**
- **Pages / features / UI components** separation for readability
- **React Query** to avoid duplicating server state
- **Vite proxy** in dev to bypass CORS issues
- **Reusable UI components** decoupled from business logic

### Quick start

**Requirements:** Node.js 18+ · Compatible REST API (see [API contract](#api-contract))

```bash
git clone https://github.com/clems023/ticket_manager_frontend.git
cd ticket_manager_frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

In development, Vite proxies `/api/*` to this URL (no CORS setup needed).

```bash
npm run dev      # http://localhost:5173
npm run build    # production build
npm run preview  # preview production build
```

<a id="api-contract"></a>

### API contract

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/login` | `{ email, password }` → `{ token }` |
| `POST` | `/api/register` | `{ email, password }` → `{ token, user }` |
| `GET` | `/api/tickets` | Paginated list (`sort`, `order`, `page`, `limit`, `status`, `priority`, `search`) |
| `GET` | `/api/tickets/:id` | Ticket detail |
| `POST` | `/api/tickets` | Create `{ title, description?, status, priority }` |
| `PATCH` | `/api/tickets/:id` | Partial update |

Errors follow the format `{ "message": "…" }`.

### What this project demonstrates

- Building a **scalable** React SPA (routing, features, hooks)
- Integrating a REST API with **JWT authentication**
- Managing cache and mutations with **TanStack Query**
- Building **robust forms** (validation, API errors)
- Polished **UX** (loading states, toasts, dark mode, keyboard accessibility)
- Modern **dev workflow** (Vite, TypeScript, ESLint, CI)

---

<a id="français"></a>

## Français

> Application web de gestion de tickets — **projet vitrine React** démontrant une architecture front-end moderne, typée et maintenable.

### À propos

**Ticket Manager** est le front-end d'une application de gestion de tickets. Il consomme une API REST sécurisée par JWT et propose un parcours complet : authentification, liste paginée, détail, création et édition.

Ce dépôt met en avant mes compétences en **React**, **TypeScript** et **intégration d'API** : composants réutilisables, gestion d'état serveur, formulaires validés, routing protégé et soin porté à l'expérience utilisateur.

> **Note — pas de démo en ligne**  
> L'API backend (Symfony) nécessite un hébergement serveur payant. Seul le front-end est publié ici.  
> Le projet est conçu pour être **cloné et lancé en local** en quelques minutes, avec votre propre API.

### Fonctionnalités

| Module | Détails |
|--------|---------|
| **Authentification** | Connexion / inscription, token JWT stocké côté client |
| **Liste des tickets** | Pagination, tri, filtres (statut, priorité), recherche |
| **Détail** | Page dédiée `/tickets/:id` avec toutes les métadonnées |
| **Création** | Formulaire modal avec validation |
| **Édition** | Mise à jour via `PATCH`, retour visuel (toast) |
| **UX** | Dark mode, skeleton loaders, empty states, notifications |
| **Sécurité** | Routes protégées, intercepteur Axios pour le Bearer token |

### Stack technique

| Couche | Technologies |
|--------|--------------|
| **UI** | React 19, TypeScript, Tailwind CSS v4 |
| **Build** | Vite 7 |
| **Données** | TanStack React Query (cache, mutations, invalidation) |
| **Formulaires** | React Hook Form |
| **HTTP** | Axios (intercepteurs request/response) |
| **Routing** | React Router v7 (guards auth) |
| **Notifications** | Sonner |

### Architecture

```
src/
├── api/                 # Client Axios + endpoints REST
├── components/
│   ├── auth/            # Routes protégées / invité
│   ├── layout/          # AppLayout (header, navigation)
│   └── ui/              # Design system (Button, Input, Card, Modal…)
├── contexts/            # AuthContext, ThemeContext
├── features/tickets/    # Logique métier tickets (cartes, filtres, modales)
├── hooks/               # useTickets, useTicket, useCreateTicket, useUpdateTicket
├── pages/               # TicketListPage, TicketDetailPage, LoginRegister
├── providers/           # QueryProvider
├── routes/              # AppRouter
└── utils/               # Gestion erreurs API, formatage dates
```

**Choix d'architecture :**
- Séparation **pages / features / composants UI** pour la lisibilité
- **React Query** pour éviter la duplication d'état serveur
- **Proxy Vite** en dev pour contourner les problèmes CORS
- Composants UI **réutilisables** et indépendants du métier

### Démarrage rapide

**Prérequis :** Node.js 18+ · API backend compatible (voir [contrat API](#contrat-api))

```bash
git clone https://github.com/clems023/ticket_manager_frontend.git
cd ticket_manager_frontend
npm install
cp .env.example .env
```

Éditez `.env` :

```env
VITE_API_URL=http://127.0.0.1:8000
```

En développement, Vite redirige automatiquement les appels `/api/*` vers cette URL (proxy intégré, pas de CORS).

```bash
npm run dev      # http://localhost:5173
npm run build    # build production
npm run preview  # prévisualisation du build
```

<a id="contrat-api"></a>

### Contrat API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/login` | `{ email, password }` → `{ token }` |
| `POST` | `/api/register` | `{ email, password }` → `{ token, user }` |
| `GET` | `/api/tickets` | Liste paginée (`sort`, `order`, `page`, `limit`, `status`, `priority`, `search`) |
| `GET` | `/api/tickets/:id` | Détail d'un ticket |
| `POST` | `/api/tickets` | Création `{ title, description?, status, priority }` |
| `PATCH` | `/api/tickets/:id` | Mise à jour partielle |

Les erreurs suivent le format `{ "message": "…" }`.

### Ce que ce projet démontre

- Structurer une SPA React **scalable** (routing, features, hooks)
- Intégrer une API REST avec **authentification JWT**
- Gérer le cache et les mutations avec **TanStack Query**
- Construire des **formulaires robustes** (validation, erreurs API)
- Soigner l'**UX** (loading states, toasts, dark mode, accessibilité clavier)
- Configurer un **workflow de développement** moderne (Vite, TypeScript, ESLint, CI)

---

## License / Licence

MIT — free to use and study / libre d'utilisation et d'étude.
