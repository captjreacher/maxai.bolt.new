// app/root.tsx
import type { LinksFunction } from "@remix-run/cloudflare";
import { Meta, Links, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

// Side-effect CSS imports (keep these; no ?url)
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

import { kTheme } from "~/lib/stores/theme";

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
export function Head() {
  return (
    <>
      <Meta />
      <Links />
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
    </>
  );
}

export default function App() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
      <Scripts />
    </>
  );
}
