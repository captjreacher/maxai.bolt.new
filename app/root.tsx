// app/root.tsx
import type { LinksFunction } from "@remix-run/cloudflare";
import {
  Meta,
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { ReactNode } from "react";

// Side-effect CSS imports (keep these; no ?url)
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

import { DEFAULT_THEME, kTheme } from "~/lib/stores/theme";

const themeInitScript = `(() => {
  try {
    const storedTheme = localStorage.getItem(${JSON.stringify(kTheme)});
    if (storedTheme) {
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  } catch {}
})();`;

export const links: LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

// 👇 This is what entry.server.tsx expects to exist
export default function App() {
  return <Outlet />;
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme={DEFAULT_THEME}>
      <head>
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh bg-neutral-950 text-white antialiased">
        <div id="root" className="h-full w-full">
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  let message = "Something went wrong";

  if (isRouteErrorResponse(error)) {
    message = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <Layout>
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <h1 className="text-2xl font-semibold">Application error</h1>
        <p className="max-w-lg text-balance text-neutral-300">{message}</p>
      </div>
    </Layout>
  );
}
