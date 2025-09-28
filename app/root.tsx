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