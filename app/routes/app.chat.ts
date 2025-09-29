type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

// app/routes/app.chat.ts  (or app-chat.ts)
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { env as processEnv } from "node:process";
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

  const apiKey =
    (typeof env.ANTHROPIC_API_KEY === "string" && env.ANTHROPIC_API_KEY) ||
    processEnv.ANTHROPIC_API_KEY;

  if (typeof apiKey !== "string" || apiKey.length === 0) {
    console.error("ANTHROPIC_API_KEY is not configured");
    return new Response("Server is not configured", { status: 500 });
  }

  try {
    const stream = await runChat(messages, {
      ...env,
      ANTHROPIC_API_KEY: apiKey,
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Failed to run chat", error);
    return new Response("There was an error processing your request", { status: 500 });
  }
}


