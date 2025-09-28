type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

// app/routes/app.chat.ts  (or app-chat.ts)
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { runChat } from "../server/run-chat.server"; // << relative import

export async function action({ request, context }: ActionFunctionArgs) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // Expect: { messages: ChatMessage[] }
  if (
    !payload ||
    typeof payload !== "object" ||
    !("messages" in payload) ||
    !Array.isArray((payload as any).messages)
  ) {
    return new Response("Body must be { messages: ChatMessage[] }", { status: 400 });
  }

  const { messages } = payload as { messages: ChatMessage[] };

  const env = (
    (context as any)?.cloudflare?.env ??
    (context as any)?.env ??
    {}
  ) as Record<string, unknown>;

  const stream = await runChat(messages, env);

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}


