# Project Structure Guide - LMS Platform
## Overview for New Portfolio Website Project

This document extracts the architectural patterns, frameworks, and best practices from our LMS monorepo to guide the creation of a new portfolio website project.

---

## 🏗️ Core Architecture

### Monorepo Setup (Turborepo)
- **Tool**: Turborepo for managing multiple packages and apps
- **Package Manager**: pnpm with workspaces
- **Node Version**: >= 18

### Workspace Structure
```
root/
├── apps/               # Next.js applications
├── packages/           # Shared packages
├── pnpm-workspace.yaml # Workspace configuration
├── turbo.json          # Turborepo configuration
└── package.json        # Root dependencies
```

---

## 📦 Technology Stack

### Frontend Framework
- **Next.js 15.5.7** (App Router)
- **React 19.2.1**
- **TypeScript 5.8.2**

### Styling
- **Tailwind CSS 4.1.17**
- **PostCSS** for processing
- **Autoprefixer** for browser compatibility

### State Management & Data Fetching
- **TanStack Query (React Query) 5.51.15** for server state
- **Axios 1.7.2** for HTTP requests
- **React Context** for client state

### Animation
- **Motion (Framer Motion) 12.23.25** for animations

### Build Tools
- **tsup** for building shared packages
- **Turbopack** for fast development (Next.js dev mode)

### Code Quality
- **ESLint 9.39.1**
- **Prettier 3.7.4** with Tailwind plugin
- **TypeScript** strict mode

### Testing
- **Jest 30.2.0**
- **@testing-library/react 16.3.0**
- **@swc/jest** for fast transforms

---

## 📁 Package Organization Pattern

### 1. Shared UI Components (`packages/ui`)
```json
{
  "name": "@repo/ui",
  "exports": {
    ".": "./src/index.ts",
    "./styles": "./src/styles.css"
  }
}
```

**Components Include:**
- Button, Input, Card, Dialog
- Form elements (Select, Checkbox, Radio)
- Navigation (Breadcrumb, Tabs, Sidebar)
- Data display (Table, Avatar, Badge)
- Feedback (Toast, Alert, Skeleton)
- Specialized (PhoneNumberInput, LanguageSwitcher)

**Key Pattern**: 
- Use `ui-` prefix for Tailwind classes to avoid conflicts
- Export all components from index.ts
- Include TypeScript types

### 2. Shared Hooks (`packages/hooks`)
```typescript
// packages/hooks/src/index.ts
export { useTranslations } from "./useTranslations";
export { useDebounce } from "./use-debounce";
export { useReorder } from "./use-reorder";
export { useDeleteConfirmation } from "./use-delete-confirmation";
export { TranslationsProvider, TranslationsContext } from "./contexts/TranslationsContext";
```

**Common Hooks:**
- `useTranslations` - i18n translations
- `useDebounce` - debouncing values
- `useReorder` - drag and drop reordering
- `useDeleteConfirmation` - confirmation dialogs

### 3. Internationalization (`packages/locales`)
```json
{
  "name": "@repo/locales",
  "exports": {
    ".": "./dist/index.js",
    "./en.json": "./src/en.json",
    "./ar.json": "./src/ar.json"
  }
}
```

**i18n Structure:**
```json
{
  "greeting": "Hello World!",
  "auth": {
    "login": {
      "title": "Login",
      "phoneNumber": "Phone Number"
    }
  },
  "notFound": {
    "title": "Page Not Found",
    "goHome": "Go Home"
  }
}
```

**Supported Locales:** `["en", "ar"]`
**Default Locale:** `"ar"`

### 4. API & Query Layer (`packages/query`)
```json
{
  "name": "@repo/query",
  "dependencies": {
    "@tanstack/react-query": "^5.51.15",
    "axios": "^1.7.2",
    "js-cookie": "^3.0.5",
    "firebase": "^12.5.0"
  }
}
```

**Features:**
- Centralized API calls
- Token management with cookies
- React Query hooks
- Firebase integration

### 5. Middleware Utilities (`packages/middleware-utils`)
**Purpose:** Shared middleware logic for Next.js apps

**Key Features:**
- i18n middleware for locale detection
- Cookie domain management
- Locale negotiation (URL → Cookie → Header → Default)

```typescript
// Locale detection priority:
// 1. URL path (/en/page)
// 2. NEXT_LOCALE cookie
// 3. Accept-Language header
// 4. Default locale (ar)
```

### 6. Tailwind Configuration (`packages/tailwind-config`)
```json
{
  "name": "@repo/tailwind-config",
  "exports": {
    ".": "./shared-styles.css",
    "./postcss": "./postcss.config.js"
  }
}
```

**Shared Styles:** Common CSS imports and Tailwind directives

### 7. TypeScript Configuration (`packages/typescript-config`)
```
typescript-config/
├── base.json           # Base TS config
├── nextjs.json         # Next.js specific
└── react-library.json  # React library config
```

### 8. ESLint Configuration (`packages/eslint-config`)
```
eslint-config/
├── base.js             # Base rules
├── next.js             # Next.js rules
└── react-internal.js   # React component rules
```

### 9. Test Configuration (`packages/test-config`)
```
test-config/
├── jest.config.cjs     # Standard Jest config
├── jest.config.ci.cjs  # CI/CD config
└── jest.setup.js       # Test setup
```

### 10. Utilities (`packages/utils`)
**Purpose:** Shared utility functions across apps

---

## 🚀 Application Structure (Next.js App)

### Standard Next.js App Layout
```
apps/portfolio/
├── src/
│   ├── app/                 # App router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── [locale]/        # i18n routes
│   │   └── api/             # API routes
│   ├── components/          # App-specific components
│   ├── contexts/            # React contexts
│   ├── hooks/               # App-specific hooks
│   ├── lib/                 # Library code
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   └── middleware.ts        # Next.js middleware
├── public/                  # Static assets
├── next.config.ts           # Next.js config
├── tailwind.config.ts       # Tailwind config
├── postcss.config.js        # PostCSS config
├── tsconfig.json            # TypeScript config
├── eslint.config.js         # ESLint config
└── package.json
```

### Next.js Configuration Example
```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-cdn.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false, // Enable for production
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  staticPageGenerationTimeout: 300,
};

export default nextConfig;
```

### Middleware Pattern
```typescript
// src/middleware.ts
import { i18nMiddleware } from "@repo/middleware-utils";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest): NextResponse | undefined {
  return i18nMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next).*)", // Skip all internal paths
  ],
};
```

---

## ⚙️ Turborepo Configuration

### `turbo.json` Structure
```json
{
  "$schema": "https://turborepo.com/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"],
      "env": [
        "NEXT_PUBLIC_APP_ENV",
        "NEXT_PUBLIC_API_URL"
      ]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Root `package.json` Scripts
```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --concurrency 14",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "check-types": "turbo run check-types",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  }
}
```

### `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## 🎨 Styling Conventions

### Tailwind Setup in Apps
```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
};

export default config;
```

### PostCSS Configuration
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

### Shared Styles Import
```typescript
// app/layout.tsx
import "@repo/tailwind-config"; // Shared styles
import "./globals.css";          // App-specific styles
```

---

## 🌐 Internationalization (i18n) Pattern

### Setup Steps

1. **Create locale files** (`packages/locales/src/`)
```json
// en.json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  },
  "hero": {
    "title": "Welcome to Our Portfolio",
    "subtitle": "Building amazing digital experiences"
  }
}

// ar.json
{
  "nav": {
    "home": "الرئيسية",
    "about": "من نحن",
    "contact": "اتصل بنا"
  },
  "hero": {
    "title": "مرحباً بكم في معرض أعمالنا",
    "subtitle": "نبني تجارب رقمية مذهلة"
  }
}
```

2. **Use TranslationsProvider**
```typescript
// app/[locale]/layout.tsx
import { TranslationsProvider } from "@repo/hooks";
import en from "@repo/locales/en.json";
import ar from "@repo/locales/ar.json";

const translations = { en, ar };

export default function LocaleLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <TranslationsProvider 
      locale={params.locale} 
      translations={translations}
    >
      {children}
    </TranslationsProvider>
  );
}
```

3. **Use translations in components**
```typescript
import { useTranslations } from "@repo/hooks";

export function Hero() {
  const t = useTranslations();
  
  return (
    <div>
      <h1>{t("hero.title")}</h1>
      <p>{t("hero.subtitle")}</p>
    </div>
  );
}
```

4. **Language switcher component**
```typescript
import { LanguageSwitcher } from "@repo/ui";

// Already built in packages/ui
<LanguageSwitcher currentLocale="en" />
```

---

## 🔌 Integration Patterns

### 1. API Integration with React Query

**Setup Provider:**
```typescript
// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Use in App:**
```typescript
// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 2. Firebase Integration
```typescript
// packages/query/src/firebase-config.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

export const app = initializeApp(firebaseConfig);
```

### 3. Cookie Management
```typescript
import Cookies from "js-cookie";

// Set cookie
Cookies.set("token", "value", { expires: 7 });

// Get cookie
const token = Cookies.get("token");

// Remove cookie
Cookies.remove("token");
```

### 4. Axios Setup
```typescript
// packages/query/src/axios-instance.ts
import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

---

## 📝 TypeScript Configuration Pattern

### Base Config (`packages/typescript-config/base.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Next.js Config
```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 🧪 Testing Setup

### Jest Configuration
```javascript
// packages/test-config/jest.config.cjs
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageProvider: 'v8',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### Test Setup
```javascript
// packages/test-config/jest.setup.js
import '@testing-library/jest-dom';
```

---

## 🎯 Component Development Pattern

### 1. Create Component in Shared UI
```typescript
// packages/ui/src/hero.tsx
import React from "react";

interface HeroProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function Hero({ title, subtitle, className }: HeroProps) {
  return (
    <div className={`ui-hero ${className || ""}`}>
      <h1 className="ui-text-4xl ui-font-bold">{title}</h1>
      {subtitle && <p className="ui-text-xl">{subtitle}</p>}
    </div>
  );
}
```

### 2. Export from Index
```typescript
// packages/ui/src/index.ts
export { Hero } from "./hero";
export { Button } from "./button";
// ... other exports
```

### 3. Use in App
```typescript
// apps/portfolio/src/components/home-hero.tsx
import { Hero } from "@repo/ui";
import { useTranslations } from "@repo/hooks";

export function HomeHero() {
  const t = useTranslations();
  
  return (
    <Hero 
      title={t("hero.title")}
      subtitle={t("hero.subtitle")}
    />
  );
}
```

---

## 🚢 Deployment & Environment

### Environment Variables Pattern
```bash
# .env.local
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
```

### Build Commands
```json
{
  "scripts": {
    "build": "turbo run build",
    "build:app": "turbo run build --filter=portfolio",
    "start": "turbo run start"
  }
}
```

---

## 📦 Package Dependencies Pattern

### App Package.json Structure
```json
{
  "name": "portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000 --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --max-warnings 0",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/hooks": "workspace:*",
    "@repo/locales": "workspace:*",
    "@repo/middleware-utils": "workspace:*",
    "@repo/ui": "workspace:*",
    "next": "^15.5.7",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "motion": "^12.23.25"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/query": "workspace:*",
    "@repo/tailwind-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@repo/utils": "workspace:*",
    "@tailwindcss/postcss": "^4.1.17",
    "@types/node": "^22.19.2",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "eslint": "^9.39.1",
    "tailwindcss": "^4.1.17",
    "typescript": "5.8.2"
  }
}
```

### Shared Package Pattern
```json
{
  "name": "@repo/package-name",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint . --max-warnings 0"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  }
}
```

---

## 🎨 Design System Components Available

### Layout Components
- `SharedLayout` - Common layout wrapper
- `Sidebar` - Navigation sidebar
- `NavigationMenu` - Top navigation
- `Breadcrumb` - Breadcrumb navigation

### Form Components
- `Input` - Text input
- `Textarea` - Multi-line text
- `Select` - Dropdown select
- `Checkbox` - Checkbox input
- `RadioGroup` - Radio buttons
- `Switch` - Toggle switch
- `PhoneNumberInput` - Phone input with country code
- `MultiSelect` - Multiple selection dropdown

### Display Components
- `Card` - Content card
- `Avatar` - User avatar
- `Badge` - Status badge
- `Table` - Data table
- `Accordion` - Collapsible content
- `Tabs` - Tabbed interface
- `Carousel` - Image carousel

### Feedback Components
- `Toast` - Notification toasts
- `Alert` - Alert messages
- `Dialog` - Modal dialogs
- `DeleteConfirmationDialog` - Confirmation modal
- `Progress` - Progress bar
- `Skeleton` - Loading skeleton

### Utility Components
- `Button` - Action buttons
- `LanguageSwitcher` - Language toggle
- `LocalizedLink` - i18n-aware links
- `ScreenTracker` - Analytics tracking
- `Tooltip` - Hover tooltips
- `Popover` - Popover menus

---

## 🎯 Best Practices Summary

### 1. **Monorepo Organization**
   - Keep shared code in `packages/`
   - Keep app-specific code in `apps/`
   - Use workspace protocol: `workspace:*`

### 2. **TypeScript**
   - Always use strict mode
   - Share configs from `packages/typescript-config`
   - Define proper interfaces for props

### 3. **Styling**
   - Use Tailwind CSS exclusively
   - Prefix shared component classes with `ui-`
   - Import shared styles from `@repo/tailwind-config`

### 4. **i18n**
   - Always wrap apps with `TranslationsProvider`
   - Use `useTranslations` hook for text
   - Structure translations hierarchically

### 5. **State Management**
   - Use React Query for server state
   - Use Context for global client state
   - Keep local state in components

### 6. **Code Quality**
   - Run `pnpm lint` before commits
   - Use `pnpm check-types` for type checking
   - Write tests for critical paths

### 7. **Performance**
   - Use Next.js Image component
   - Implement proper loading states
   - Use React Query caching

### 8. **Accessibility**
   - Use semantic HTML
   - Include ARIA labels
   - Test keyboard navigation

---

## 🚀 Quick Start for New Project

### Step 1: Initialize Structure
```bash
mkdir portfolio-monorepo && cd portfolio-monorepo
pnpm init
```

### Step 2: Create Workspace Files
```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Step 3: Copy Package Structures
1. Copy `packages/` structure from LMS
2. Copy `turbo.json`
3. Copy shared configs (eslint, typescript, tailwind)

### Step 4: Create Portfolio App
```bash
cd apps
npx create-next-app@latest portfolio --typescript --tailwind --app
```

### Step 5: Configure Dependencies
Update `package.json` to use workspace packages:
```json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/hooks": "workspace:*",
    "@repo/locales": "workspace:*"
  }
}
```

### Step 6: Setup i18n
1. Copy locale files
2. Setup middleware
3. Add TranslationsProvider

### Step 7: Build & Run
```bash
pnpm install
pnpm dev
```

---

## 📚 Additional Resources

### Key Files to Reference
- [turbo.json](turbo.json) - Turborepo config
- [pnpm-workspace.yaml](pnpm-workspace.yaml) - Workspace config
- [packages/ui/src/](packages/ui/src/) - Component examples
- [packages/locales/src/](packages/locales/src/) - i18n examples
- [apps/3apaq/src/](apps/3apaq/src/) - App structure example

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TanStack Query Docs](https://tanstack.com/query)

---

## ✅ Checklist for New Portfolio Project

- [ ] Setup Turborepo monorepo structure
- [ ] Configure pnpm workspaces
- [ ] Create shared packages (ui, hooks, locales, utils)
- [ ] Setup Tailwind configuration package
- [ ] Configure TypeScript configs
- [ ] Setup ESLint configs
- [ ] Create Next.js app in `apps/`
- [ ] Implement i18n middleware
- [ ] Setup React Query provider
- [ ] Create translation files (en.json, ar.json)
- [ ] Build reusable UI components
- [ ] Configure environment variables
- [ ] Setup testing infrastructure
- [ ] Implement responsive design
- [ ] Add accessibility features
- [ ] Configure deployment pipeline

---

**This guide extracts the proven patterns from our LMS platform. Adapt these patterns based on your portfolio website's specific needs while maintaining the core architectural principles.**
