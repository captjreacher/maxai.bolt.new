import { RemixBrowser } from '@remix-run/react';
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";

startTransition(() => {
  hydrateRoot(document.getElementById('root')!, <RemixBrowser />);
});