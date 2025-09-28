import type { AppLoadContext, EntryContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import ReactDOMServer from 'react-dom/server';
import * as ReactDOMServerBrowser from 'react-dom/server.browser';
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  const serverExports = ReactDOMServer as typeof import('react-dom/server');
  const browserServerExports =
    ReactDOMServerBrowser as typeof import('react-dom/server.browser');

  const renderToReadableStream =
    typeof serverExports.renderToReadableStream === 'function'
      ? serverExports.renderToReadableStream
      : browserServerExports.renderToReadableStream;

  const readable = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent') || '')) {
    await readable.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');

  responseHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
  responseHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');

  return new Response(readable, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
