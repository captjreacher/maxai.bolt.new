// app/root.tsx
import { Meta, Links, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

// Side-effect CSS imports (keep these; no ?url)
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

// 👇 This is what entry.server.tsx expects to exist
export function Head() {
  return (
    <>
      <Meta />
      <Links />
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
