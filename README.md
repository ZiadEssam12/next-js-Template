# Next.js Internationalized Template

A production-ready Next.js 16 template with built-in internationalization (i18n) support using `next-intl`.

## ✨ Features

- **Next.js 16** - Latest App Router with React 19
- **Internationalization** - Multi-language support with `next-intl` (English & Arabic)
- **RTL Support** - Automatic right-to-left layout for Arabic
- **TypeScript** - Full type safety
- **Tailwind CSS 4** - Utility-first styling with animations
- **React Query** - Server state management with devtools
- **Axios** - HTTP client for API requests
- **Lucide Icons** - Beautiful icon library
- **Motion** - Animation library

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/           # Locale-based routing
│   │   ├── layout.tsx      # Root layout with i18n providers
│   │   ├── page.tsx        # Home page
│   │   └── not-found.tsx   # 404 page
│   ├── globals.css         # Global styles
│   └── global.d.ts         # Type declarations
├── components/             # Reusable UI components
├── contexts/               # React contexts
├── hooks/                  # Custom hooks
├── i18n/
│   ├── routing.ts          # Locale routing configuration
│   ├── request.ts          # Server-side i18n setup
│   └── navigation.ts       # Navigation helpers
├── lib/                    # Utility libraries
├── providers/              # App providers (React Query, etc.)
├── types/                  # TypeScript types
└── utils/                  # Utility functions
messages/
├── en.json                 # English translations
└── ar.json                 # Arabic translations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Clone the template
git clone <repository-url> my-project
cd my-project

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🌐 Internationalization

### Supported Locales

- `en` - English
- `ar` - Arabic (RTL)

### Adding Translations

1. Add your translations to `messages/en.json` and `messages/ar.json`:

```json
{
  "myNamespace": {
    "myKey": "My translation"
  }
}
```

2. Use translations in your components:

```tsx
// Server Components
import { getTranslations } from "next-intl/server";

export default async function MyPage() {
  const t = await getTranslations("myNamespace");
  return <h1>{t("myKey")}</h1>;
}

// Client Components
("use client");
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("myNamespace");
  return <p>{t("myKey")}</p>;
}
```

### Adding a New Locale

1. Update `src/i18n/routing.ts`:

```ts
export const routing = defineRouting({
  locales: ["en", "ar", "fr"], // Add new locale
  defaultLocale: "en",
});
```

2. Create `messages/fr.json` with translations.

## 📜 Available Scripts

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start development server |
| `pnpm build` | Build for production     |
| `pnpm start` | Start production server  |
| `pnpm lint`  | Run ESLint               |

## 🛠️ Customization

### Metadata

Update the app metadata in `src/app/[locale]/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: "Your App Title",
  description: "Your app description.",
};
```

### Styling

- Global styles: `src/app/globals.css`
- Tailwind config: Uses Tailwind CSS 4 with `@import "tailwindcss"`

### API Client

Configure your API base URL in `src/lib/api-client.ts`.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📄 License

This template is open source and available under the [MIT License](LICENSE).
