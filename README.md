# IRMS Frontend (IRMS-FE)

A React + TypeScript + Vite frontend for the Integrated Restaurant Management System (IRMS). Provides menu browsing, cart management, and kitchen display system (KDS) interfaces with JWT-based authentication and Axios backend integration.

## Features

- **JWT Authentication** – Login/logout with token-based auth, auto-redirect on 401
- **Menu Management** – Dynamic menu loading from backend with category filtering
- **Shopping Cart** – Add/edit/remove items with customization options
- **Kitchen Display System (KDS)** – Real-time order queue with prep time tracking
- **Context-based State** – Auth, Menu, and Cart context providers for global state
- **Responsive UI** – Tailwind CSS with custom theming
- **Type-safe** – Full TypeScript coverage with strict mode enabled
- **React Compiler** – Optimized rendering with Babel preset

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:8080/api
```

Or use `.env.development` for dev and `.env.production` for production builds.

### Development

```bash
npm run dev
```

Runs on `http://localhost:5173` by default.

### Build

```bash
npm run build
```

Outputs to `dist/`.

### Preview

```bash
npm run preview
```

Preview the production build locally.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Navigation, protected routes
│   └── ui/             # Buttons, inputs, scroll areas
├── contexts/           # React contexts & providers
│   ├── AuthContext.tsx
│   ├── MenuContext.ts
│   └── CartContext.ts
├── features/           # Page-level features
│   ├── auth/           # Login page
│   ├── menu/           # Menu browsing page
│   ├── kds/            # Kitchen display system
│   ├── cart/           # Cart components
│   └── item/           # Item details/customization
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Auth logic
│   ├── useMenuQuery.ts # Menu context access
│   ├── useKDSQuery.ts  # KDS queue fetching
│   └── useItemQuery.ts
├── services/           # API client services
│   ├── authService.ts
│   ├── menuService.ts
│   ├── kdsService.ts
│   └── orderService.ts
├── types/              # TypeScript types & interfaces
├── utils/              # Utilities (API client, formatters)
└── data/               # Mock data for development
```

## Backend API Integration

All API calls go through `src/utils/api.ts`, an Axios instance configured with:

- **Base URL** – `VITE_API_URL` env variable (default: `http://localhost:8080/api`)
- **Credentials** – `withCredentials: true` for cookies
- **JWT Header** – Automatically adds `Authorization: Bearer <token>` if token exists in localStorage
- **Error Handling** – Redirects to `/login` on 401 (Unauthorized)

### Available Services

**Auth Service** (`authService`)
- `login(credentials)` – POST `/auth/login`
- `logout()` – POST `/auth/logout`
- `verify()` – GET `/auth/me` or `/auth/verify`

**Menu Service** (`menuService`)
- `getAllMenuItems()` – GET `/menu/all`
- `getMenuItemsByCategory(category)` – GET `/menu/items-by-category/{category}`
- `getMenuItemById(id)` – GET `/menu/item/{id}`

**KDS Service** (`kdsService`)
- `getQueue()` – GET `/kds/queue`
- `getAlerts(thresholdMinutes?)` – GET `/kds/alerts`

**Order Service** (`orderService`)
- `getOrder(id)` – GET `/orders/get/{id}`
- `createOrder(payload)` – POST `/orders/create`
- `updateOrder(id, payload)` – POST `/orders/update/{id}`
- `cancelOrder(id)` – POST `/orders/cancel/{id}`

## Hooks

**useAuth()**
```ts
const { user, isAuthenticated, isLoading, login, logout } = useAuth();
```

**useMenuQuery()**
```ts
const { menuItems, categories, isLoading } = useMenuQuery();
```

**useKDSQuery()**
```ts
const { orders, isLoading } = useKDSQuery();
```

## Docker Setup

Build and run with Docker Compose:

```bash
docker-compose up
```

This will start:
- **Frontend** on `http://localhost:5173`
- **Backend** on `http://localhost:8080`

Services communicate within the `irms-network` bridge network.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080/api` | Backend API base URL |

Production builds use `/api` for relative paths when deployed behind a proxy.

## Key Dependencies

- **React 19** – UI framework
- **Vite 8** – Build tool with HMR
- **TypeScript** – Type safety
- **React Router 7** – Client-side routing
- **Axios 1.15** – HTTP client
- **Tailwind CSS 4** – Styling
- **Lucide React** – Icons
- **GSAP 3** – Animations

## License

Internal project for IRMS system.
